import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useFirestoreSync() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [moodState, setMoodState] = useState({ current: 'clear', history: ['clear'] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes([]);
      setMoodState({ current: 'clear', history: ['clear'] });
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.notes) setNotes(data.notes);
        if (data.moodState) setMoodState(data.moodState);
        else if (data.mood) setMoodState({ current: data.mood, history: [data.mood] });
      } else {
        // Initialize doc if it doesn't exist
        setDoc(userDocRef, { notes: [], moodState: { current: 'clear', history: ['clear'] } }).catch(console.error);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore sync error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Sync functions
  const updateNotes = (newNotesOrUpdater) => {
    setNotes((prev) => {
      const nextNotes = typeof newNotesOrUpdater === 'function' ? newNotesOrUpdater(prev) : newNotesOrUpdater;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        updateDoc(userDocRef, { notes: nextNotes }).catch(console.error);
      }
      return nextNotes;
    });
  };

  const updateMoodState = (newMoodOrUpdater) => {
    setMoodState((prev) => {
      const nextMood = typeof newMoodOrUpdater === 'function' ? newMoodOrUpdater(prev) : newMoodOrUpdater;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        updateDoc(userDocRef, { moodState: nextMood }).catch(console.error);
      }
      return nextMood;
    });
  };

  return { notes, moodState, setNotes: updateNotes, setMoodState: updateMoodState, loading };
}
