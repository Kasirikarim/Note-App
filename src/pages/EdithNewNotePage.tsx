import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput,
  IonTextarea, IonButton, IonBackButton, IonButtons, IonSelect, IonSelectOption
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";

const categories = ["Personal", "Work", "Ideas", "Uncategorised"];

const EditNotePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Uncategorised");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const notesString = localStorage.getItem("notes");
    if (notesString) {
      const notes = JSON.parse(notesString);
      const note = notes.find((n: any) => n.id === id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || "Uncategorised");
      }
    }
  }, [id]);

  const handleSave = () => {
    const notesString = localStorage.getItem("notes");
    let notes = notesString ? JSON.parse(notesString) : [];
    notes = notes.map((n: any) =>
      n.id === id ? { ...n, title, content, category } : n
    );
    localStorage.setItem("notes", JSON.stringify(notes));
    history.push("/notes");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/notes" /></IonButtons>
          <IonTitle>Edit Note</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          placeholder="Title"
          value={title}
          onIonChange={e => setTitle(e.detail.value!)}
        />
        <IonTextarea
          placeholder="Content"
          value={content}
          onIonChange={e => setContent(e.detail.value!)}
        />
        <IonSelect
          value={category}
          placeholder="Select Category"
          onIonChange={e => setCategory(e.detail.value)}
        >
          {categories.map(cat => (
            <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
          ))}
        </IonSelect>
        <IonButton expand="block" onClick={handleSave}>Save Changes</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditNotePage;