import { useState, useEffect } from "react";
import { createJob } from '../services/createjob.ts'
import { getDiarizationById } from "../services/getDiarizationById.ts";
import type { Audio } from "../../../shared/types/audio.types.ts";
import type { MultiAPIResponse } from "../types/apiResponse.types.ts";
import { MAXTIMEPROCESSING, TIMEBETTWENEACHPOLLING } from "../config.ts";

interface UseDiarizationReturn {
  diarizationPayload: MultiAPIResponse | null;
  isLoading: boolean;
  error: string | null;
  statusInfo: string | null;
}

export const usePolling = (audio: Audio | null, minSpeakers?: number, maxSpeakers?: number) : UseDiarizationReturn => {
  const [diarizationPayload, setDiarizationPayload] = useState<MultiAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!audio) return;

    const controller = new AbortController();
    const signal = controller.signal;
    
    // Reset states
    setIsLoading(true);
    setError(null);
    setDiarizationPayload(null);

    const pollInterval = Number(TIMEBETTWENEACHPOLLING);
    const maxTime = Number(MAXTIMEPROCESSING);

    const fetchProcess = async () => {
      try {
        // 1. Création du Job
        const jobPayload = await createJob(audio, minSpeakers, maxSpeakers, signal);

        const jobId = jobPayload.data.job_id;
        let attempts = 0;
        const maxAttempts = maxTime / pollInterval;
        let isComplete = false;

        // Attente initiale avant le premier polling
        await new Promise((r) => setTimeout(r, pollInterval));

        // 2. Polling Loop
        while (attempts < maxAttempts && !signal.aborted && !isComplete) {
          const payload = await getDiarizationById(jobId);
          const status = payload.status;

          if (status === "success") {
            const jobStatus = payload.data.status;
            if (jobStatus === "COMPLETED") {
              setDiarizationPayload(payload);
              isComplete = true;
            } else if (jobStatus === "PENDING") {
              setStatusInfo(`En file d'attente (Position: ${payload.data.position})`);
            } else if (jobStatus === "PROCESSING") {
              setStatusInfo("Traitement audio en cours...");
            } else {
              setStatusInfo("Etat de transcription inconnu");
            }
          }
          else if (status === "FAILED") {
            const errorMessage = payload.message;
            setStatusInfo(errorMessage);
          }
          else{
            throw new Error("Réponse inattendue du serveur");
          }

          if (!isComplete) {
            attempts++;
            await new Promise((r) => setTimeout(r, pollInterval));
          }
        }
        
        if (!isComplete && !signal.aborted) {
            setStatusInfo("Délai d'attente dépassé")
        }

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || "Une erreur inconnue est survenue");
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    fetchProcess();

    return () => controller.abort();
  }, [audio]); // Se relance uniquement si l'objet audio change

  return { diarizationPayload, isLoading, error, statusInfo };
};