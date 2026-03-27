/* Component that render a timer */
// Import react hooks
import { useState, useEffect } from "react";
import ListItemText from '@mui/material/ListItemText';
import { formatTime } from "../utils/formatTime.tsx";

interface TimerProps {
  isRecording: boolean;
  isPause: boolean;
}

const Timer = ({isRecording, isPause}: TimerProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isRecording || isPause) return;

    // Increase the timer to 1 each second
    let timer = setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearTimeout(timer)
    
  }, [count, isRecording, isPause]);

  // Reset the timer when recording stops
  useEffect(() => {
     if (!isRecording) setCount(0);
  }, [isRecording]);

  const format = formatTime(count);

  return (
    <>
      <ListItemText primary={format} />
    </>
  );
};

export default Timer;
