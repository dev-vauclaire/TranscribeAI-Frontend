/* Componente for recording audio from microphone, it set the parent audio by calling onRecordEnd callback */
// Import react hooks
import { useState, useRef, useEffect } from "react";
// Import a class that allows to record
import Recorder from '../utils/Recorder.js';
// Import icons from material UI
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TimerIcon from '@mui/icons-material/Timer';
// Import components from material UI
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
// Import our component Timer
import Timer from './Timer.tsx';
// Import types
import type { Audio } from "../types/audio.types.ts";
import { useAlert } from "../contexts/AlertContext.tsx";

interface AudioRecorderProps {
    onRecordEnd: (audio: Audio) => void;
}

const pulseStyle = {
  animation: "pulse 1s infinite ease-in-out",
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", opacity: 1 },
    "50%": { transform: "scale(1.3)", opacity: 0.6 },
    "100%": { transform: "scale(1)", opacity: 1 }
  }
};

export default function AudioRecorder({ onRecordEnd } : AudioRecorderProps){
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPause, setIsPause] = useState<boolean>(false);
    const audioRecorderRef = useRef<Recorder | null>(null);
    const { showAlert } = useAlert();

    // Initialize the audio recorder at the first render
    useEffect(() => {
        const recorder = new Recorder();
        recorder.init();
        audioRecorderRef.current = recorder;
    }, []);

    // start recording
    const handlerStartRecording = () => {
        if (isRecording) return;
        setIsRecording(true);
        audioRecorderRef.current?.start();
        showAlert("L'enregistrement est en cours.", "info");
    };

    // pause recording
    const handlerPauseRecording = () => {
        setIsPause(!isPause);
        if(isPause){
        audioRecorderRef.current?.resume();
        showAlert( "L'enregistrement a repris.", "info");
        return;
        }
        audioRecorderRef.current?.pause();
        showAlert( "L'enregistrement est en pause.", "info");
    }

    // stop recording and return the audio to parent component
    const handlerStopRecording = async () => {
        let newAudio: Audio = {blob: null, mimeType: "", filename: ""};
        setIsRecording(false); 
        setIsPause(false);
        const blobResult = await audioRecorderRef.current?.stop();
        if (!blobResult) {
            onRecordEnd(newAudio);
            showAlert( "Une erreur est survenue lors de l'enregistrement audio.", "error");
            return;
        }
        newAudio = {blob: blobResult.audioBlob, mimeType: "audio/webm", filename: "recorded-audio.webm"};
        onRecordEnd(newAudio);
        showAlert( "L'enregistrement est terminé.", "info");
    }
    return(
        <>
            {/* Bouton ENREGISTRER */}
            <ListItem disablePadding>
                <ListItemButton onClick={handlerStartRecording}>
                    <ListItemIcon>
                            <FiberManualRecordIcon
                        sx={{
                            color: isRecording ? "red" : "inherit",
                            ...(isRecording && pulseStyle)
                        }}/>
                    </ListItemIcon>
                    <ListItemText primary="Enregistrer" />
                </ListItemButton>
            </ListItem>
            {/* Bouton PAUSE */}
            <ListItem disablePadding>
                <ListItemButton disabled={!isRecording} onClick={handlerPauseRecording}>
                    <ListItemIcon>
                        {!isPause ? <PauseIcon /> : <PlayArrowIcon />}
                    </ListItemIcon>
                    <ListItemText primary={!isPause ? "Pause" : "Reprendre"} />
                </ListItemButton>
            </ListItem>
            {/* Bouton STOP */}
            <ListItem disablePadding>
                <ListItemButton disabled={!isRecording} onClick={handlerStopRecording}>
                    <ListItemIcon>
                        <StopIcon />
                    </ListItemIcon>
                    <ListItemText primary="Stop" />
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <TimerIcon />
                </ListItemIcon>
                <Timer isRecording={isRecording} isPause = {isPause}/>
            </ListItem>
        </>
    );
}