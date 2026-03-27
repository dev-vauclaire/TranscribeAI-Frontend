import type { Audio } from '../../../shared/types/audio.types.ts'
import type {CreateJobAPIResponse} from '../../../shared/types/createJobResponse.type.ts'
import {BASE_URL} from '../config.ts'
import {API_KEY} from "../config.ts"

export async function createJob(
  audio: Audio,
  minSpeakers?: number,
  maxSpeakers?: number,
  signal?: AbortSignal
): Promise<CreateJobAPIResponse> {

  if (!audio?.blob) throw new Error("Aucun fichier audio fourni.");
  if (!API_KEY) throw new Error("Aucune API key fournie.");

  const headers = new Headers({ "X-API-KEY": API_KEY });
  const audioFile = new File([audio.blob], audio.filename, { type: audio.mimeType });

  const formData = new FormData();
  formData.append("audioFile", audioFile);

  if(minSpeakers !== null && minSpeakers !== undefined){
    formData.append("min_speakers", minSpeakers.toString());
  }
  if(maxSpeakers !== null && maxSpeakers !== undefined){
    formData.append("max_speakers", maxSpeakers.toString());
  }
  let response: Response;
  try {
      response = await fetch(`${BASE_URL}/api/diarizationTranscription/createJob`, {
      method: "POST",
      headers: headers,
      body: formData,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("La requête a été annulée.");
    }

    throw new Error("Impossible de contacter le serveur. Vérifiez votre connexion.");
  }

  const payload = await response.json();
  return payload;
}