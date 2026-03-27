// Définition du texte de diarization après traitement
import type { DiarizationSegment } from "./apiResponse.types.ts";

export interface Speaker {
  id: string;
  name: string;
  color: string;
}

export interface BulleTextDiarization {
  segments: DiarizationSegment[];
  speakerId: string
}

export interface UiDiarizationResult {
  // 1. La liste ordonnée (pour l'affichage chronologique)
  conversationFlow: BulleTextDiarization[];
  // 2. La "Base de données" des speakers
  speakersById: Record<string, Speaker>; 
}