import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useAlert } from '../contexts/AlertContext.tsx';

type CopyButtonProps = {
  /** Text to copy */
  textToCopy: string | null;
  /** Duration of the feedback display (ms) */
  duration?: number;
  /** Icon size */
  size?: 'small' | 'medium' | 'large';
};

export default function CopyButton({textToCopy, duration = 1500, size = 'small'}: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const {showAlert} = useAlert();

  const handleCopy = async () => {
    if(textToCopy=== "" || textToCopy === null) {
      showAlert("Impossible de copier car rien n’a été retranscrit.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch {
      showAlert("Impossible de copier le texte", "error");
    }
  };

  return (
    <>
      <Tooltip title={copied ? 'Copié !' : 'Copier'}>
        <IconButton
          onClick={handleCopy}
          color={copied ? 'success' : 'default'}
          size={size}
        >
          {copied ? <CheckIcon /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={copied}
        message="Texte copié dans le presse-papier"
        autoHideDuration={duration}
      />
    </>
  );
};