import { useState, useEffect } from 'react';
import { Box, Avatar, TextField } from '@mui/material';
import type { Speaker } from '../types/uiData.types.ts';

interface SpeakerItemProps {
  speaker: Speaker;
  index: number;
  onSpeakersChange: (apiSpeakerId: string, selectedProfile: Speaker) => void;
}

export default function SpeakerItem({ speaker, index, onSpeakersChange }: SpeakerItemProps) {
  const [localName, setLocalName] = useState(speaker.name || "");
  const [localColor, setLocalColor] = useState(speaker.color || "#000000");

  useEffect(() => {
    setLocalName(speaker.name || "");
    setLocalColor(speaker.color || "#000000");
  }, [speaker.name, speaker.color]); // Dépendances précises pour éviter les boucles

  const handleValidation = (updatedColor?: string) => {
    const colorToSave = updatedColor || localColor;
    if (localName !== speaker.name || colorToSave !== speaker.color) {
      onSpeakersChange(speaker.id, { 
        ...speaker, 
        name: localName, 
        color: colorToSave 
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
      {/* Avatar qui affiche la couleur en temps réel */}
      <Avatar 
        sx={{ 
          bgcolor: localColor, // On utilise localColor pour un feedback immédiat
          width: 32, 
          height: 32, 
          fontSize: '0.8rem',
          transition: 'background-color 0.2s' 
        }}
      >
        {index + 1}
      </Avatar>
      
      <TextField
        variant="standard"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleValidation();
            (e.target as HTMLInputElement).blur();
          }
        }}
        onBlur={() => handleValidation()}
        fullWidth
        slotProps={{
          input: { sx: { fontSize: '0.85rem' } }
        }}
      />

      {/* Sélecteur de couleur invisible superposé à une icône ou un cercle */}
      <Box sx={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
        <input
          type="color"
          value={localColor}
          onChange={(e) => {
            setLocalColor(e.target.value);
            // On peut valider ici pour que la waveform change en temps réel
            onSpeakersChange(speaker.id, { ...speaker, name: localName, color: e.target.value });
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            border: '2px solid #ddd',
            backgroundColor: localColor,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }} 
        />
      </Box>
    </Box>
  );
}