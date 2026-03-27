import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { Module } from '../../shared/types/module.type.ts';

// Pour assurer la cohérence, les id ne doivent pas changer
// La derniere route de fullPath doit être égale à path
export const MODULE_ROUTES: Module[] = [
    {
    id: 'streaming',
    title: "Dictée vocale",
    description: "Transcrivez l'audio en direct avec une latence minimale pour une expérience fluide.",
    icon: [<RecordVoiceOverIcon />],
    path: "streaming",
    fullPath: "/app/streaming",
    enable: true,
  },
  {
    id: 'transcription',
    title: "Transcription mono-voix",
    description: "Convertissez vos fichiers audio volumineux en texte, avec un seul locuteur.",
    icon: [<PersonIcon />, <FileDownloadIcon />],
    path: "transcription",
    fullPath: "/app/transcription",
    enable: true,
  },
  {
    id: 'diarization',
    title: "Transcription réunions",
    description: "Convertissez vos fichiers audio volumineux en texte, avec plusieurs locuteurs.",
    icon: [<GroupsIcon />, <FileDownloadIcon />],
    path: "diarization",
    fullPath: "/app/diarization",
    enable: true,
  }
];