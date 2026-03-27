import type { RouteObject } from "react-router-dom";
import StreamingPage from "./StreamingPage.tsx"; 
import { MODULE_ROUTES } from "../../core/router/routes.tsx";

// On récupère la config spécifique à ce module
const streamingConfig = MODULE_ROUTES.find(route => route.id === 'streaming');
export const streamingRoutes: RouteObject[] = [
  {
    // On utilise le path défini dans la config globale
    path: streamingConfig?.path, 
    element: <StreamingPage />,
    children: [
        // Les sous-routes éventuels ici
    ]
  }
];