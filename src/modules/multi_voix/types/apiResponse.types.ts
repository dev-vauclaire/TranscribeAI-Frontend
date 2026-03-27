import type {
  CompletedResponse,
  ErrorAPIResponse,
  PendingResponse,
  ProcessingResponse,
} from "../../../shared/types/jobApiResponse.types.ts";

export interface DiarizationSegment {
  segment_id: number;
  start: number;
  end: number;
  speaker: string;
  text: string;
}

export interface DiarizationResult {
  segments : DiarizationSegment[];
}

/**
 * Interface: CompletedMultiResponse
 * Réponse "COMPLETED" spécifique au multi-voix.
 * On étend CompletedResponse<DiarizationResult> et on ajoute:
 * - diarization_time
 */
export interface CompletedMultiResponse extends CompletedResponse<DiarizationResult> {
  data: CompletedResponse<DiarizationResult>["data"] & {
    diarization_time: number;
  };
}

/**
 * Type: MultiSuccessAPIResponse
 * Union discriminante "success" spécifique au multi-voix.
 * Le discriminant est `data.status`.
 */
export type MultiSuccessAPIResponse =
  | PendingResponse
  | ProcessingResponse
  | CompletedMultiResponse;

/**
 * Type: MultiAPIResponse
 * Union complète pour le module multi-voix (success OU error).
 */
export type MultiAPIResponse = MultiSuccessAPIResponse | ErrorAPIResponse;

export function isCompletedMultiResponse(
  response: MultiAPIResponse | null | undefined
): response is CompletedMultiResponse {
  return (
    response !== null &&
    response !== undefined &&
    response.status === "success" &&

    // Vérifie que data existe
    "data" in response &&
    response.data !== undefined &&

    // Discriminant principal
    response.data.status === "COMPLETED" &&

    // Sécurité supplémentaire (évite les crash runtime)
    "result" in response.data &&
    response.data.result !== null &&

    "diarization_time" in response.data &&
    typeof response.data.diarization_time === "number"
  );
}