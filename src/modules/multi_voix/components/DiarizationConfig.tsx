import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';

import { MAXSPEAKERS } from "../config.ts"

interface TranscriptionConfigProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (config: TranscriptionSettings) => void;
  fileName: string;
}

export interface TranscriptionSettings {
  enableDiarization: boolean;
  minSpeakers?: number;
  maxSpeakers?: number;
}

export const TranscriptionConfigDialog = ({ open, onClose, onConfirm, fileName }: TranscriptionConfigProps) => {

    {/* Configuration du formulaire */}
    const [config, setConfig] = useState<TranscriptionSettings>({
        enableDiarization: false,
        minSpeakers: 2,
        maxSpeakers: 2,
    });

    const [alert, setAlert] = useState<{ message: string; severity: 'error' | 'warning' | 'info' | 'success' } | null>(null);

    const handleConfigChange = (newConfig: TranscriptionSettings) => {
        if(newConfig.enableDiarization && newConfig.minSpeakers && newConfig.maxSpeakers && newConfig.minSpeakers > newConfig.maxSpeakers) {
        setAlert({ message: "Le nombre minimum de locuteurs ne peut pas être supérieur au nombre maximum", severity: "error" });
        return;
        }
        if(newConfig.enableDiarization && newConfig.minSpeakers && newConfig.maxSpeakers && newConfig.minSpeakers < 2) {
            setAlert({ message: "Le nombre minimum de locuteurs ne peut pas être inférieur à 2", severity: "error" });
            return;
        }
        if(newConfig.enableDiarization && newConfig.minSpeakers && newConfig.maxSpeakers && newConfig.maxSpeakers > MAXSPEAKERS) {
            setAlert({ message: `Le nombre maximum de locuteurs ne peut pas être supérieur à ${MAXSPEAKERS}`, severity: "error" });
            return;
        }
        setAlert(null);
        setConfig(newConfig);
    };

    const handleConfirm = () => {
        onConfirm(config);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Configuration de la transcription</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
            Fichier : <strong>{fileName}</strong>
            </DialogContentText>
            
            <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControlLabel
                control={
                <Switch 
                    checked={config.enableDiarization} 
                    onChange={(e) => handleConfigChange({...config, enableDiarization: e.target.checked})} 
                />
                }
                label="Distinguer les locuteurs (Diarisation)"
            />

            {config.enableDiarization && (
                <Stack direction="row" spacing={2}>
                <TextField
                    label="Min. locuteurs"
                    type="number"
                    size="small"
                    slotProps={{ htmlInput: { min: 2 } }}
                    value={config.minSpeakers}
                    onChange={(e) => handleConfigChange({...config, minSpeakers: parseInt(e.target.value)})}
                />
                <TextField
                    label="Max. locuteurs"
                    type="number"
                    size="small"
                    slotProps={{ htmlInput: { min: 2 } }}
                    value={config.maxSpeakers}
                    onChange={(e) => handleConfigChange({...config, maxSpeakers: parseInt(e.target.value)})}
                />
                </Stack>
            )}
            </Stack>
            {alert && (
            <DialogContentText color={alert.severity === "error" ? "error" : alert.severity === "warning" ? "warning.main" : alert.severity === "info" ? "info.main" : "success.main"} sx={{ mt: 2 }}>
            {alert.message}
            </DialogContentText>
        )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={onClose} color="inherit">Annuler</Button>
            <Button onClick={handleConfirm} variant="contained" disableElevation>
            Confirmer
            </Button>
        </DialogActions>
        </Dialog>
    );
};