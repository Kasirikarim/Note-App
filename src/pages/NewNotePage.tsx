import React, { useState, useEffect, useRef } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel,
  IonButton, IonButtons, IonBackButton, useIonToast, IonIcon, IonProgressBar
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { arrowBack, mic, stop, play, trash } from "ionicons/icons";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  audioBlob?: string;
  audioDuration?: number;
}

const NewNotePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Uncategorised");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [presentToast] = useIonToast();
  const history = useHistory();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

 
  useEffect(() => {
    if (id) {
      const notesString = localStorage.getItem("notes");
      const existingNotes: Note[] = notesString ? JSON.parse(notesString) : [];
      const noteToEdit = existingNotes.find(note => note.id === id);
      
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setCategory(noteToEdit.category);
        setAudioBlob(noteToEdit.audioBlob || null);
        setAudioDuration(noteToEdit.audioDuration || 0);
        setIsEditMode(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [id]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBlob(base64data);
        };
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error recording:", err);
      presentToast({
        message: "Please allow microphone access to record",
        duration: 3000,
        position: "top",
        color: "danger"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioDuration(recordingTime);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setAudioDuration(0);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      await presentToast({
        message: "Please enter a title",
        duration: 2000,
        position: "top",
        color: "warning"
      });
      return;
    }

    try {
      const notesString = localStorage.getItem("notes");
      const existingNotes: Note[] = notesString ? JSON.parse(notesString) : [];

      const noteData = {
        title: title.trim(),
        content: content.trim(),
        category,
        audioBlob: audioBlob || undefined,
        audioDuration: audioBlob ? audioDuration : undefined,
        updatedAt: new Date().toISOString()
      };

      if (isEditMode && id) {
       
        const updatedNotes = existingNotes.map(note => 
          note.id === id ? { 
            ...note, 
            ...noteData,
            createdAt: note.createdAt 
          } : note
        );
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
      } else {
    
        const newNote: Note = {
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        } as Note;
        localStorage.setItem("notes", JSON.stringify([...existingNotes, newNote]));
      }

      await presentToast({
        message: `Note ${isEditMode ? 'updated' : 'saved'} successfully!`,
        duration: 1500,
        position: "top",
        color: "success"
      });

      history.replace("/notes");
      
    } catch (error) {
      console.error("Save error:", error);
      await presentToast({
        message: "Failed to save note. Storage might be full.",
        duration: 3000,
        position: "top",
        color: "danger"
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes" icon={arrowBack} text="" />
          </IonButtons>
          <IonTitle>{isEditMode ? "Edit Note" : "New Note"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      
          <div>
            <IonLabel position="stacked">Note title *</IonLabel>
            <IonInput
              value={title}
              placeholder="Enter title"
              onIonChange={(e) => setTitle(e.detail.value!)}
              className="ion-margin-top"
            />
          </div>

          
          <div>
            <IonLabel position="stacked">Note content</IonLabel>
            <IonTextarea
              value={content}
              placeholder="Start typing..."
              autoGrow
              rows={6}
              onIonChange={(e) => setContent(e.detail.value!)}
              className="ion-margin-top"
            />
          </div>

          
          <div>
            <IonLabel position="stacked">
              Voice Recording {audioDuration ? `(${formatTime(audioDuration)})` : ''}
            </IonLabel>
            
            {isRecording && (
              <IonProgressBar 
                value={recordingTime / 60} 
                color="danger" 
                style={{ margin: "8px 0" }}
              />
            )}
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              marginTop: "8px"
            }}>
              {isRecording ? (
                <IonButton 
                  color="danger" 
                  onClick={stopRecording}
                  shape="round"
                >
                  <IonIcon icon={stop} slot="start" />
                  Stop ({formatTime(recordingTime)})
                </IonButton>
              ) : (
                <>
                  <IonButton 
                    onClick={startRecording}
                    shape="round"
                    disabled={isPlaying}
                  >
                    <IonIcon icon={mic} slot="start" />
                    Record
                  </IonButton>
                  
                  {(audioURL || audioBlob) && (
                    <>
                      <IonButton 
                        onClick={playRecording}
                        shape="round"
                        disabled={(!audioURL && !audioBlob) || isPlaying}
                      >
                        <IonIcon icon={play} slot="start" />
                        Play
                      </IonButton>
                      <IonButton 
                        color="danger" 
                        onClick={deleteRecording}
                        shape="round"
                        fill="outline"
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </>
                  )}
                </>
              )}
            </div>
            
            <audio 
              ref={audioRef} 
              src={audioURL || (audioBlob ? audioBlob : undefined)} 
              hidden
              onEnded={handleAudioEnded}
            />
          </div>

          
          <div>
            <IonLabel position="stacked">Category</IonLabel>
            <IonSelect
              value={category}
              interface="action-sheet"
              onIonChange={(e) => setCategory(e.detail.value)}
              className="ion-margin-top"
            >
              <IonSelectOption value="Uncategorised">Uncategorised</IonSelectOption>
              <IonSelectOption value="Personal">Personal</IonSelectOption>
              <IonSelectOption value="Work">Work</IonSelectOption>
              <IonSelectOption value="Ideas">Ideas</IonSelectOption>
            </IonSelect>
          </div>

          
          <IonButton 
            expand="block" 
            onClick={handleSave}
            className="ion-margin-top"
            disabled={!title.trim()}
          >
            {isEditMode ? "Update Note" : "Save Note"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NewNotePage;
