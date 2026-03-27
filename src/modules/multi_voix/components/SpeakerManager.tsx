import { Box, Typography, Stack } from '@mui/material';
import type { Speaker } from '../types/uiData.types.ts';
import SpeakerItem from './SpeakerItem.tsx';

interface PropsSpeakerManager {
  speakersList: Speaker[];
  onSpeakersChange: (apiSpeakerId: string, selectedProfile: Speaker) => void;
  open: boolean;
}

export default function SpeakerManager({ speakersList, onSpeakersChange, open }: PropsSpeakerManager) {
  const nbSpeakers = speakersList.length;
  if(nbSpeakers === 0) {return null}
  return (
    <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column'}}>
      {
        open &&
        <>
          <Typography sx={{ mb: 2 }}> Nombre de locuteurs : {nbSpeakers} </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Configuration des voix :
          </Typography>
        </>
      }
      <Stack direction="column"
        spacing={2}>
        {speakersList.map((speaker, index) => (
          <SpeakerItem 
            key={speaker.id}
            speaker={speaker}
            index={index}
            onSpeakersChange={onSpeakersChange}
          />
        ))}
      </Stack>
    </Box>
  );
}