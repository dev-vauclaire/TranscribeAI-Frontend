// src/mono/api_response.types.ts

import type {
  CompletedResponse,
  ErrorAPIResponse,
  PendingResponse,
  ProcessingResponse,
} from "../../../shared/types/jobApiResponse.types.ts";

/**
 * Interface: TranscriptionSegment
 * Un segment de transcription mono-voix.
 */
export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

/**
 * Interface: TranscriptionResult
 * Résultat complet de transcription mono-voix.
 */
export interface TranscriptionResult {
  full_text: string;
  language: string;
  segments: TranscriptionSegment[];
}

/**
 * Interface: CompletedMonoResponse
 * Réponse "COMPLETED" spécifique au mono-voix.
 * On étend CompletedResponse<TranscriptionResult> et on ajoute:
 * - transcription_time
 */
export interface CompletedMonoResponse extends CompletedResponse<TranscriptionResult> {
  data: CompletedResponse<TranscriptionResult>["data"] & {
    transcription_time: number;
  };
}

/**
 * Type: MonoSuccessAPIResponse
 * Union discriminante "success" spécifique au mono-voix.
 * Le discriminant est `data.status`.
 */
export type MonoSuccessAPIResponse =
  | PendingResponse
  | ProcessingResponse
  | CompletedMonoResponse;

/**
 * Type: MonoAPIResponse
 * Union complète pour le module mono-voix (success OU error).
 */
export type MonoAPIResponse = MonoSuccessAPIResponse | ErrorAPIResponse;