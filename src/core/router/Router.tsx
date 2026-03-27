import { createBrowserRouter, Navigate } from "react-router-dom";
import { streamingRoutes } from "../../modules/streaming/routes.tsx";
import { transcriptionRoutes } from "../../modules/mono_voix/routes.tsx";
import { diarizationRoutes } from "../../modules/multi_voix/routes.tsx"
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import {AlertProvider} from '../../shared/contexts/AlertContext.tsx'
import HomePage from "../../modules/home/HomePage.tsx";
import AuthPage from "../../modules/auth/AuthPage.tsx";
import MainLayout from "../../shared/layouts/MainLayout.tsx";
import NotFoundPage from "../../shared/pages/NotFoundPage.tsx";
import AidePage from "../../modules/aide/AidePage.tsx"

export const router = createBrowserRouter([
  // 1. Redirection initiale
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },

  // 2. Page d'authentification
  {
    path: "/auth",
    element: <AuthPage />,
  },

  // 3. La partie Application (Protégée)
  {
    element: <ProtectedRoute />, 
    children: [
      { path: "/home", index: true, element: <HomePage /> },
      {
        path: "/app",
        element: (<AlertProvider><MainLayout /></AlertProvider>),
        children: [
          ...diarizationRoutes,
          ...transcriptionRoutes,
          ...streamingRoutes
        ],
      },
      {path: "aide", index: true, element: <AidePage />},
    ],
  },

  // 4. Page de capture d'erreur (404)
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);