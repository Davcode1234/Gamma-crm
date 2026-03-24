import { useState } from 'react';
import { addNote, deleteNote } from '../services/clients-service';

const useNotes = (clientID: string) => {
  const [notes, setNotes] = useState([]);
  const [noteValue, setNoteValue] = useState('');
  const [isMouseOverIcon, setIsMouseOverIcon] = useState({
    isOver: false,
    noteID: '',
  });

  const handleDeleteNote = async (clientId, noteID) => {
    await deleteNote(clientId, noteID);
    const filteredNotes = notes.filter((note) => note._id !== noteID);

    setNotes(filteredNotes);
  };

  const handleAddNote = async (text) => {
    const updatedNotes = await addNote({ text, date: new Date(), clientID });

    setNotes(updatedNotes);
  };

  return {
    notes,
    setNotes,
    noteValue,
    setNoteValue,
    isMouseOverIcon,
    setIsMouseOverIcon,
    handleDeleteNote,
    handleAddNote,
  };
};

export default useNotes;
