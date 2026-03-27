/**
 * Statuts possibles d'un job.
 */
export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED";

/**
 * Interface: BaseSuccessResponse
 * Structure commune à toutes les réponses "success".
 * Elle garantit:
 * - status = "success" au top-level
 * - data contient au minimum job_id + status
 */
export interface BaseSuccessResponse {
  status: "success";
  data: {
    status: JobStatus;
    job_id: string;
  };
}

/**
 * Interface: PendingResponse
 * Cas où le job est dans la file d'attente.
 * - data.status = "PENDING"
 * - data.position indique la position dans la queue
 */
export interface PendingResponse extends BaseSuccessResponse {
  data: BaseSuccessResponse["data"] & {
    status: "PENDING";
    position: number;
  };
}

/**
 * Interface: ProcessingResponse
 * Cas où le job est en cours de traitement.
 * - data.status = "PROCESSING"
 */
export interface ProcessingResponse extends BaseSuccessResponse {
  data: BaseSuccessResponse["data"] & {
    status: "PROCESSING";
  };
}

/**
 * Interface: CompletedResponse<Result>
 * Cas où le job est terminé.
 * - data.status = "COMPLETED"
 * - data.result contient le résultat typé (générique)
 */
export interface CompletedResponse<Result> extends BaseSuccessResponse {
  data: BaseSuccessResponse["data"] & {
    status: "COMPLETED";
    result: Result;
  };
}

/**
 * Interface: ErrorAPIResponse
 * Cas d'erreur.
 * - status = "error" ou "FAILED"
 * - message fournit le détail de l'erreur
 */
export interface ErrorAPIResponse {
  status: "error" | "FAILED";
  message: string;
}

/**
 * Type: BaseSuccessAPIResponse<Result>
 * Union discriminante générique côté "success".
 * Le discriminant est `data.status`.
 */
export type BaseSuccessAPIResponse<Result> =
  | PendingResponse
  | ProcessingResponse
  | CompletedResponse<Result>;

/**
 * Type: BaseAPIResponse<Result>
 * Union complète générique (success OU error).
 */
export type BaseAPIResponse<Result> = BaseSuccessAPIResponse<Result> | ErrorAPIResponse;