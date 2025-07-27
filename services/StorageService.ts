export const getNotes = (category?: string) => {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  if (category && category !== 'all') {
    return notes.filter((note: any) => note.category === category);
  }
  return notes;
};

export const searchNotes = (query: string) => {
  const notes = getNotes();
  if (!query) return notes;
  
  return notes.filter((note: any) => 
    note.title.toLowerCase().includes(query.toLowerCase()) || 
    note.content.toLowerCase().includes(query.toLowerCase())
  );
};

export const deleteNote = (id: number) => {
  const notes = getNotes().filter((note: any) => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes));
};