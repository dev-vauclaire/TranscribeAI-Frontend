import type { RouteObject } from "react-router-dom";
import DiarizationPage from "./TranscriptionDiarizationPage.tsx"; 
import { MODULE_ROUTES } from "../../core/router/routes.tsx";

// On récupère la config spécifique à ce module
const diarizationConfig = MODULE_ROUTES.find(route => route.id === 'diarization');

export const diarizationRoutes: RouteObject[] = [
  {
    // On utilise le path défini dans la config globale
    path: diarizationConfig?.path, 
    element: <DiarizationPage />,
    children: [
        // Les sous-routes éventuels ici
    ]
  }
];