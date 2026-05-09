const musicFiles = import.meta.glob('../assets/Musics/**/*.mp3', { as: 'url', eager: true });

export const TRACKS = [
  {
    id: 'Rainy_Night',
    name: 'Rainy Night',
    emoji: '🌧️',
    files: []
  },
  {
    id: 'Study',
    name: 'Study',
    emoji: '📚',
    files: []
  },
  {
    id: 'Sunset',
    name: 'Sunset',
    emoji: '🌅',
    files: []
  }
];

// Group files by their parent folder
for (const [path, url] of Object.entries(musicFiles)) {
  const parts = path.split('/');
  // path looks like "../assets/musics/Rainy_Night/song.mp3"
  const folder = parts[parts.length - 2];
  const filename = parts[parts.length - 1].replace('.mp3', '');
  
  const channel = TRACKS.find(t => t.id === folder);
  if (channel) {
    channel.files.push({
      name: filename,
      url: url
    });
  }
}

// Sort files alphabetically
TRACKS.forEach(channel => {
  channel.files.sort((a, b) => a.name.localeCompare(b.name));
});
