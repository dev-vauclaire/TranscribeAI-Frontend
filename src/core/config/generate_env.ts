// Récupère les variables d'environnement à partir de window.__ENV_TEMPLATE__, qui est défini dans public/env.template.js

export {};

declare global {
  interface Window {
    __ENV_TEMPLATE__?: Record<string, string>;
  }
}

const runtimeEnv = window.__ENV_TEMPLATE__ ?? {};

const getEnv = (key: string, fallback?: string) => {
  const v = runtimeEnv[key];
  return (v !== undefined && v !== "") ? v : fallback;
};

export const BaseEnv = {
  API_KEY: getEnv("VITE_APP_API_KEY", "default_api_key"),
  BASE_URL: getEnv("VITE_APP_BASE_URL", ""),
};

export const BatchTranscriptionEnv = {
  MAX_SIZE_AUDIO: getEnv("VITE_APP_MAX_SIZE_AUDIO_BATCH", "200"),
  MAX_TIME_PROCESSING: getEnv("VITE_APP_MAX_TIME_PROCESSING_BATCH", "60"),
  TIME_BETWEEN_EACH_POLLING: getEnv("VITE_APP_TIME_BETWEEN_EACH_POLLING_BATCH", "3"),
};

export const DiarizationEnv = {
  MAX_SIZE_AUDIO: getEnv("VITE_APP_MAX_SIZE_AUDIO_DIARIZATION", "200"),
  MAX_TIME_PROCESSING: getEnv("VITE_APP_MAX_TIME_PROCESSING_DIARIZATION", "90"),
  TIME_BETWEEN_EACH_POLLING: getEnv("VITE_APP_TIME_BETWEEN_EACH_POLLING_DIARIZATION", "3"),
  MAX_SPEAKERS: getEnv("VITE_APP_MAX_SPEAKERS_DIARIZATION", "20"),
};

export const StreamingEnv = {
};
