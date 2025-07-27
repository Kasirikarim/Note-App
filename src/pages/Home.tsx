import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonIcon, 
  IonFab, IonFabButton, IonButton, IonText
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { settingsOutline, add, documentOutline, play, trash } from "ionicons/icons";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  audioBlob?: string; // Base64 encoded audio
  audioDuration?: number; // in seconds
}

const categories = ["All", "Personal", "Work", "Ideas", "Uncategorised"];

const NotesPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const history = useHistory();

  // Load notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };
    
    loadNotes();
    // Add event listener for storage changes
    window.addEventListener('storage', loadNotes);
    return () => window.removeEventListener('storage', loadNotes);
  }, []);

  // Filter notes based on search and category
  const filteredNotes = notes.filter(note =>
    (selectedCategory === "All" || note.category === selectedCategory) &&
    (note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Handle note deletion
  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  // Format audio duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notes</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear"
            onClick={() => history.push("/settings")}
            aria-label="Settings"
          >
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
        
        <IonSearchbar
          placeholder="Search notes..."
          value={searchText}
          debounce={300}
          onIonChange={e => setSearchText(e.detail.value!)}
        />
        
        <IonSegment
          value={selectedCategory}
          onIonChange={e => setSelectedCategory(e.detail.value as string)}
        >
          {categories.map((cat) => (
            <IonSegmentButton key={cat} value={cat}>
              <IonLabel>{cat}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>
      </IonHeader>

      <IonContent className="ion-padding">
        {filteredNotes.length === 0 ? (
          <div className="ion-text-center" style={{ marginTop: "40%" }}>
            <IonIcon 
              icon={documentOutline} 
              style={{ fontSize: "64px", opacity: 0.2 }} 
            />
            <IonText color="medium">
              <p>No notes found</p>
              <IonButton 
                fill="outline"
                onClick={() => history.push("/new")}
              >
                Create Your First Note
              </IonButton>
            </IonText>
          </div>
        ) : (
          <IonList lines="full">
            {filteredNotes.map((note) => (
              <IonItem key={note.id}>
                <IonLabel className="ion-text-wrap">
                  <h2>{note.title}</h2>
                  <p>{note.content.substring(0, 60)}{note.content.length > 60 ? "..." : ""}</p>
                  
                  {/* Audio Player Section */}
                  {note.audioBlob && (
                    <div style={{ marginTop: "8px" }}>
                      <audio
                        controls
                        src={note.audioBlob}
                        style={{ width: "100%", marginBottom: "4px" }}
                      />
                      <IonText style={{ fontSize: "12px", color: "var(--ion-color-medium)" }}>
                        {formatDuration(note.audioDuration)}
                      </IonText>
                    </div>
                  )}
                  
                  <p style={{ fontSize: "12px", color: "var(--ion-color-medium)", marginTop: "4px" }}>
                    {note.category} • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </IonLabel>
                <IonButton 
                  slot="end" 
                  fill="clear"
                  onClick={() => history.push(`/edit/${note.id}`)}
                >
                  Edit
                </IonButton>
                <IonButton 
                  slot="end" 
                  fill="clear"
                  color="danger"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            color="primary" 
            onClick={() => history.push("/new")}
            aria-label="Add new note"
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default NotesPage;