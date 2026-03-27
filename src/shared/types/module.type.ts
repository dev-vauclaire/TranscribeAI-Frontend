import type { ReactElement } from 'react';

/**
 * Interface représentant un module et ses composantes dans l'application.
 */
export interface Module {
  /** Identifiant unique et stable du module (ex: 'transcription') */
  id: string;
  
  /** Titre affiché dans l'interface */
  title: string;
  
  /** Description détaillée de la fonctionnalité */
  description: string;
  
  /** Composant d'icône React (généralement une icône MUI) */
  icon: ReactElement[];
  
  /** Chemin relatif utilisé pour la configuration des routes (ex: 'diarization') */
  path: string;
  
  /** Chemin absolu utilisé pour les liens de navigation (ex: '/app/diarization') */
  fullPath: string;

  enable?: boolean; // Indique si le module est actif ou non
}