import { error } from "console";

/*"active_transcription" lorsque la transcription est en cours. "no_audio_detected" lorsque aucun discours n'a été détecté.*/
export type TranscriptionStatus = 'active_transcription' | 'no_audio_detected';

export type SessionLanguage = 'auto' | string;

/**
 * Horodatage renvoyé par l'API au format H:MM:SS
 * Exemples: "0:00:03", "1:12:45"
 */

export type TimestampString = string;

/**
 * Une ligne de transcription validée par le serveur.
 * speaker = -2 représente un segment de silence.
 * text peut être null uniquement pour les segments de silence.
 */
export interface StreamingLine {
    speaker: number;
    text: string | null;
    start: TimestampString;
    end: TimestampString;
    translation?: string;
    detected_language?: string;
}

/* Message d'update de streaming */
export interface StreamingUpdateMessage {
    type: "diff",
    seq: number,
    status: TranscriptionStatus,
    n_lines: number,
    lines_pruned?: number,
    new_lines?: StreamingLine[],
    buffer_transcription: string,
    buffer_diarization: string,
    buffer_translation: string,
    remaining_time_transcription: number,
    remaining_time_diarization: number,
    error?: string;
}

/**
 * Message envoyé par le serveur quand il a fini de traiter tout l'audio,
 * après réception du signal de fin (frame binaire vide).
 */
export interface StreamingReadyToStopMessage {
  type: 'ready_to_stop';
}

/**
 * Message envoyé immédiatement après l'ouverture de la websocket.
 */
export interface StreamingConfigMessage {
  type: 'config'; 
  useAudioWorklet: boolean;
  mode: "diff";
}

/* le premier message de transcription envoyé par le serveur après ouverture de la websocket, 
contenant un "snapshot" complet de l'état de la transcription à ce moment-là.
Utile pour synchroniser l'état côté client en cas de reconnexion ou de perte de messages. */
export interface StreamingSnapshotMessage {
    type: "snapshot",
    seq: number,
    status: TranscriptionStatus,
    lines: StreamingLine[],
    buffer_transcription: string,
    buffer_diarization: string,
    buffer_translation: string,
    remaining_time_transcription: number,
    remaining_time_diarization: number,
    error?: string;
}

/* Union type pour tous les messages possibles du serveur */
export type StreamingServerMessage = StreamingSnapshotMessage | StreamingUpdateMessage | StreamingReadyToStopMessage | StreamingConfigMessage;

/**
 * Paramètres de session frontend.
 */
export interface StreamingSessionParams {
  wsBaseUrl: string;
  language: SessionLanguage;
  mode: "diff";
}

/**
 * Etat websocket / session côté frontend.
 */
export type StreamingConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'streaming'
  | 'stopping'
  | 'closed'
  | 'error';


/* Etat complet de la session de streaming côté client, incluant la connexion websocket et les données de transcription. */
export interface StreamingClientState {
  seq: number | null;
  status: TranscriptionStatus;
  lines: StreamingLine[];
  buffer_transcription: string;
  buffer_diarization: string;
  buffer_translation: string;
  remaining_time_transcription: number;
  remaining_time_diarization: number;
  isReadyToStop: boolean;
  isConfigured: boolean;
  useAudioWorklet: boolean | null;
  error: string | null;
}

