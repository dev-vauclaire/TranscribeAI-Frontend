// Composants
import AudioUpload from '../../shared/components/AudioUpload.tsx';
import { Box, Divider, Chip } from "@mui/material";
import AudioPlayer from '../../shared/components/AudioPlayer.tsx';
import ResizableSidebar from '../../shared/components/ResizableSidebar.tsx'
import TextBox from './components/TextBox.tsx';
import SpeakerManager from './components/SpeakerManager.tsx'
import LoadingBarProgress from '../../shared/components/loadingBarProgress.tsx';
import Exporter from '../../shared/components/Exporter.tsx'
import WordReplacement from '../mono_voix/components/WordReplacement.tsx';
import { TranscriptionConfigDialog } from './components/DiarizationConfig.tsx';
// Type 
import type { TranscriptionSettings } from './components/DiarizationConfig.tsx';
import type { Audio } from "../../shared/types/audio.types.ts";
import type { Speaker } from './types/uiData.types.ts';
// Contexte d'alerte
import {useAlert} from '../../shared/contexts/AlertContext.tsx'
// Hook
import { useState, useRef, useEffect } from "react";
import { usePolling } from './hooks/usePolling.ts';
// Variable d'env
import { MAXSIZEAUDIO } from "./config.ts";
// Utilitaires
import { fullText } from './utils/getFullText.ts';
import { formatTime } from '../../shared/utils/formatTime.ts';
import type { UiDiarizationResult } from './types/uiData.types.ts';
import { convertApiToUiData } from './utils/apiToUi.ts';
import { isCompletedMultiResponse } from './types/apiResponse.types.ts';

export default function DiarizationPage() {
  const { showAlert } = useAlert();

  // États pour le Dialog
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<Audio | null>(null);

  // Locuteur minimum et maximum pour la diarization
  const [minSpeakers, setMinSpeakers] = useState<number | undefined>(undefined);
  const [maxSpeakers, setMaxSpeakers] = useState<number | undefined>(undefined);

  const [diarizationData, setDiarizationData] = useState<UiDiarizationResult>({ conversationFlow: [], speakersById: {} });

  // États pour les sidebars
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);

  // Lié à l'audio
  const [audio, setAudio] = useState<Audio | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Récupération de la diarization via le hook
  const { diarizationPayload, isLoading, error, statusInfo } = usePolling(audio, minSpeakers, maxSpeakers);

  // Ouvre la pop up et stocker l'audio temporairement en attendant la confirmation de la configuration
  const handleAudioUpload = (newAudio: Audio) => {
    if (audio?.filename === newAudio.filename && audio?.blob.size === newAudio.blob.size) {
        showAlert("Vous venez d'envoyer le même audio", "info");
        return;
    }
    setPendingAudio(newAudio);
    setIsConfigOpen(true); 
  };

  useEffect(() => {
    // Cas d'erreur
    if (error) showAlert(error, "error");

    // Cas d'information sur le statut du job
    if (statusInfo) showAlert(statusInfo, "info");

    // Cas où la diarization a échoué
    if (diarizationPayload?.status === "FAILED") {
      showAlert(diarizationPayload.message, "error");
    }

    // Cas où la diarization est un succès
    if (
      diarizationPayload?.status === "success" &&
      diarizationPayload?.data.status === "COMPLETED"
    ) {
      if (isCompletedMultiResponse(diarizationPayload)) {
        showAlert(
          `La transcription est un succès ! Durée : ${formatTime(
            diarizationPayload.data.diarization_time
          )}`,
          "success"
        );

        const convertedData = convertApiToUiData(diarizationPayload);
        setDiarizationData(convertedData);
      }
    }
  }, [error, statusInfo, diarizationPayload, showAlert]);

  // Déplace le curseur de lecture audio
  const goToTimestamp = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = seconds;
        }
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  // Fonction pour modifier un speaker dans la liste des speakers
  const handleSpeakerChange = (apiSpeakerId: string, selectedProfile: Speaker) => {
    setDiarizationData((prevData) => {
      const updatedSpeakersById = { ...prevData.speakersById, [apiSpeakerId]: selectedProfile };
      return { ...prevData, speakersById: updatedSpeakersById };
    });
  }

  // Affectation de l'audio
  const handleAudioSetter = (newAudio: Audio) => {
    setAudio((prevAudio) => {
      // Si on a déjà un audio et que le blob est le même, on ne change rien
      // (Le re-render ne sera pas déclenché)
      if (prevAudio?.filename === newAudio.filename && prevAudio?.blob.size === newAudio.blob.size) {
        showAlert("Vous venez d'envoyer le même audio", "info");
        return prevAudio;
      }
      return {
        blob: newAudio.blob,
        mimeType: newAudio.mimeType,
        filename: newAudio.filename
      };
    });
  };
  
  // Confirmation de la configuration : on applique les paramètres et on lance la transcription
  const handleConfigConfirm = (settings: TranscriptionSettings) => {
    if (pendingAudio) {
      setMinSpeakers(settings.enableDiarization ? settings.minSpeakers : undefined);
      setMaxSpeakers(settings.enableDiarization ? settings.maxSpeakers : undefined);
      handleAudioSetter(pendingAudio);
      setPendingAudio(null);
    }
  };

  // Change un mot et ses occurrence par un autre
  const handleGlobalReplace = (search: string, replace: string) => {
    const regex = new RegExp(search, 'gi'); 
    setDiarizationData((prevData) => {
      const updatedConversationFlow = prevData.conversationFlow.map((bubble) => {
        const updatedSegments = bubble.segments.map((seg) => ({
          ...seg,
          text: seg.text.replace(regex, replace)
        }));
        return { ...bubble, segments: updatedSegments };
      });
      return { ...prevData, conversationFlow: updatedConversationFlow };
    }); 
  };

  // Permet l'édition manuelle d'un segment précis
  const handleManualEdit = (objectId: number, segmentId: number, newText: string) => {
    setDiarizationData(prevData => {
      const updatedConversationFlow = [...prevData.conversationFlow];
      const updatedBubble = { ...updatedConversationFlow[objectId] };
      const updatedSegments = [...updatedBubble.segments];
      updatedSegments[segmentId] = { ...updatedSegments[segmentId], text: newText };
      updatedBubble.segments = updatedSegments;
      updatedConversationFlow[objectId] = updatedBubble;
      return { ...prevData, conversationFlow: updatedConversationFlow };
    });
  };

  // Supprime la transcription 
  const handleDelete = () => { setDiarizationData({ conversationFlow: [], speakersById: {} });
    showAlert("Transcription supprimée", "success");
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: "100%"}}>
      {/* Dialog de configuration avant transcription */}
      <TranscriptionConfigDialog 
        open={isConfigOpen}
        fileName={pendingAudio?.filename || ""}
        onClose={() => setIsConfigOpen(false)}
        onConfirm={handleConfigConfirm}
      />
    
      {/* Boite à outils de gauche */}
        <ResizableSidebar 
        open={isLeftSidebarOpen}
        onToggle={toggleLeftSidebar}
        side="left"
        title="Boite à outils"
        expandedWidth={280} 
        collapsedWidth={50}
        >
        {/* Section 1 : Entrée Audio */}
        {
          isLeftSidebarOpen && 
          <Divider sx={{ my: 2, width: '90%' }}>
            <Chip label="Entrée Audio" size="small" sx={{ fontSize: '0.65rem' }} />
          </Divider>
        }
        <Box sx={{ p: isLeftSidebarOpen ? 1 : 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <AudioUpload onUploadEnd={handleAudioUpload} MAXSIZEBYTES_VAL={MAXSIZEAUDIO}/>
        </Box>

        {/* Section 2 : Options d'édition */}
        { isLeftSidebarOpen &&      
        <>
          <Divider sx={{ my: 2, width: '90%' }}>
            <Chip label="Édition" size="small" sx={{ fontSize: '0.65rem' }} />
          </Divider>
          <Box>
            <WordReplacement onReplace={handleGlobalReplace} />
          </Box>
        </>
          }
          {/* Section 3 : Options d'exportation */}
        { 
          <>
            {isLeftSidebarOpen && 
            <Divider sx={{ my: 2, width: '90%' }}>
              <Chip label="Options d'exportation" size="small" sx={{ fontSize: '0.65rem' }} />
            </Divider>}
            <Box>
              <Exporter textToExport={fullText(diarizationData)}/>
            </Box>
          </>
        }
        </ResizableSidebar>

      {/* Main */}
      <Box sx={{ 
        width: "100%",
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        p: 3,
        boxSizing: "border-box" }}>
        <Box sx ={{
          flex: 1,
          display : 'flex',
          flexDirection :"column",
          alignItems : 'center',
          gap : 2,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Texte box où sera afficher les segments de texte récupérés */}
          <TextBox 
            diarizationData={diarizationData}
            currentTime={currentTime}
            gotoTimestamp={goToTimestamp}
            handleManualEdit={handleManualEdit}
            onDelete={handleDelete}/>
          { isLoading && <LoadingBarProgress /> }
          <AudioPlayer ref={audioRef} audio = {audio} setCurrentTime={setCurrentTime} />
        </Box>
      </Box>

      {/* Boite à outils de droite */}
      <Box>
        <ResizableSidebar 
        open={isRightSidebarOpen}
        onToggle={toggleRightSidebar}
        side="right"
        title="Gestion des locuteurs"
        expandedWidth={240} 
        collapsedWidth={50}
        >
          <SpeakerManager 
            speakersList={Object.values(diarizationData.speakersById)}  
            onSpeakersChange={handleSpeakerChange}
            open={isRightSidebarOpen}
          />
        </ResizableSidebar>
      </Box>
    </Box>
  );
}