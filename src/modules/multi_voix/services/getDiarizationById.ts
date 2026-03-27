import {API_KEY, BASE_URL} from '../config.ts'
import type { MultiAPIResponse } from '../types/apiResponse.types.ts';

// Envoie une requete GET pour récupérer la diarization ou les statuts associés à un job_id
export async function getDiarizationById(
  job_id: string,
): Promise<MultiAPIResponse> {

  // Vérifie les données manquantes
  if (!job_id) throw new Error("Aucun id fourni.");
  if (!API_KEY) throw new Error("Aucune API key fournie.");

  const response = await fetch(`${BASE_URL}/api/diarizationTranscription/result?job_id=${job_id}`, {
    headers: { "X-API-KEY": API_KEY }
  });
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de la transcription: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload;
}