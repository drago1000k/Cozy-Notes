/**
 * aiAssistant.js
 * AI-powered utility functions for:
 *  1. Formatting raw speech transcription into a clean note (formatSpeechWithAI)
 *  2. Bulk-organizing all notes into semantic clusters (bulkOrganizeNotes)
 *  3. Categorizing a single new note and placing it near its cluster (categorizeSingleNote)
 *
 * All functions call the Google Gemini API using the key stored in VITE_GEMINI_API_KEY.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

/**
 * Low-level helper: send a plain-text prompt to Gemini and return the raw text response.
 * @param {string} prompt
 * @returns {Promise<string>} - raw text from the model
 */
async function callGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.'
    );
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return rawText;
}

/**
 * Helper: extract a JSON object/array from a raw Gemini text response.
 * Gemini sometimes wraps JSON in markdown code fences - this strips them.
 * @param {string} rawText
 * @returns {any} - parsed JSON
 */
function extractJSON(rawText) {
  // Remove optional ```json ... ``` or ``` ... ``` fences
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/``` */g, '')
    .trim();

  // Find the first [ or { to the last ] or } to be safe
  const start = cleaned.search(/[[{]/);
  const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
  if (start === -1 || end === -1) {
    throw new Error('No JSON found in Gemini response: ' + rawText.slice(0, 200));
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

// -----------------------------------------------------------------------------
// Feature 1 - Smart Voice-to-Text Dictation
// -----------------------------------------------------------------------------

/**
 * Formats raw speech transcription with the AI.
 * Returns a structured note with an inferred title and cleaned body text.
 *
 * @param {string} rawText - The unformatted string from SpeechRecognition
 * @returns {Promise<{ title: string, formattedText: string }>}
 */
export async function formatSpeechWithAI(rawText) {
  const prompt = `You are a note-taking assistant. A user has just dictated the following raw speech:

"${rawText}"

Your task:
- Fix grammar and spelling mistakes.
- Add proper punctuation (commas, periods, etc.).
- Use line breaks and bullet points if there are multiple distinct ideas.
- Infer a concise, descriptive title (max 6 words) from the content.
- CRITICAL RULE: Detect the exact language of the user's raw input. The generated title and formatted text MUST be strictly written in that same language. Do NOT translate the input into English or any other language.
- Do NOT add any extra commentary or explanation.

Return ONLY a valid JSON object in this exact format (no markdown, no code fences):
{ "title": "...", "formattedText": "..." }`;

  const raw = await callGemini(prompt);
  const parsed = extractJSON(raw);

  return {
    title: parsed.title ?? 'Untitled Note',
    formattedText: parsed.formattedText ?? rawText,
  };
}

// -----------------------------------------------------------------------------
// Feature 2 - Context-Aware Auto-Organize
// -----------------------------------------------------------------------------

/**
 * Analyzes all notes and returns new positions + color assignments so that
 * semantically similar notes cluster together on the whiteboard.
 *
 * @param {Array<{ id: string, title: string, text: string }>} notes
 * @returns {Promise<Array<{ id: string, newX: number, newY: number, newColorIndex: number }>>}
 */
export async function bulkOrganizeNotes(notes) {
  if (!notes || notes.length === 0) return [];

  // Build a compact summary of each note for the prompt (strip HTML tags)
  const notesSummary = notes.map((n) => ({
    id: n.id,
    title: n.title || '(no title)',
    // Strip HTML tags so the model sees clean text
    text: (n.text || '').replace(/<[^>]*>/g, '').slice(0, 120),
  }));

  const prompt = `You are an intelligent note-organizing assistant.

Here are the user's sticky notes as a JSON array:
${JSON.stringify(notesSummary, null, 2)}

Your task:
- Analyze these notes and group them logically by semantic intent (e.g., Work, Personal, Ideas, Shopping, Health, etc.).
- Assign a consistent colorIndex (integer 0-7) per group so all notes in the same group share one color.
  Color palette reference: 0=Amber, 1=Pink, 2=Mint, 3=Sky, 4=Lavender, 5=Rose, 6=Yellow, 7=Cyan
- Generate new x and y coordinates so each group forms a distinct physical cluster on a 2500x1500 canvas.
- Groups should NOT overlap. Leave at least 200px of space between clusters.
- Individual notes within a cluster should be staggered (approximately 20-30px apart) so they look hand-placed.
- Do NOT add commentary. Return ONLY a valid JSON array in this exact format:
[{ "id": "...", "newX": 123, "newY": 456, "newColorIndex": 2 }]`;

  const raw = await callGemini(prompt);
  const parsed = extractJSON(raw);

  // Validate and clamp coordinates to canvas bounds
  return parsed.map((item) => ({
    id: item.id,
    newX: Math.max(20, Math.min(Number(item.newX) || 100, 2338)), // canvas 2500 - note width 162
    newY: Math.max(20, Math.min(Number(item.newY) || 100, 1332)), // canvas 1500 - note height 168
    newColorIndex: Math.max(0, Math.min(Number(item.newColorIndex) || 0, 7)),
  }));
}

/**
 * Determines where a single new note should be placed on the board, based on
 * which semantic cluster it belongs to.
 *
 * @param {{ id: string, title: string, text: string }} newNote
 * @param {Array<{ id: string, title: string, text: string, x: number, y: number, colorIndex: number }>} existingNotes
 * @returns {Promise<{ newX: number, newY: number, newColorIndex: number }>}
 */
export async function categorizeSingleNote(newNote, existingNotes) {
  // Build a compact board summary
  const boardSummary = (existingNotes || [])
    .filter((n) => n.id !== newNote.id)
    .map((n) => ({
      id: n.id,
      title: n.title || '(no title)',
      text: (n.text || '').replace(/<[^>]*>/g, '').slice(0, 80),
      x: Math.round(n.x),
      y: Math.round(n.y),
      colorIndex: n.colorIndex,
    }));

  const newNoteSummary = {
    id: newNote.id,
    title: newNote.title || '(no title)',
    text: (newNote.text || '').replace(/<[^>]*>/g, '').slice(0, 120),
  };

  const prompt = `You are an intelligent whiteboard assistant.

Here is the current board of sticky notes (each has a position and colorIndex):
${JSON.stringify(boardSummary, null, 2)}

Here is a NEW note just added by the user:
${JSON.stringify(newNoteSummary, null, 2)}

Your task:
- Determine which semantic group the NEW note belongs to (based on its content compared to existing notes).
- If it fits an existing group, place it physically close to that group (within approximately 150px of the centroid of that cluster).
- If it is a completely new topic, assign it a new isolated coordinate far from existing clusters, and pick an unused or fitting colorIndex (0-7).
- Do NOT overlap with existing note positions; offset by at least 20px from the nearest note.
- The canvas is 2500x1500. Keep coordinates inside bounds (x: 20-2338, y: 20-1332).
- Do NOT add commentary. Return ONLY a valid JSON object in this exact format:
{ "newX": 123, "newY": 456, "newColorIndex": 2 }`;

  const raw = await callGemini(prompt);
  const parsed = extractJSON(raw);

  return {
    newX: Math.max(20, Math.min(Number(parsed.newX) || 200, 2338)),
    newY: Math.max(20, Math.min(Number(parsed.newY) || 200, 1332)),
    newColorIndex: Math.max(0, Math.min(Number(parsed.newColorIndex) || 0, 7)),
  };
}
