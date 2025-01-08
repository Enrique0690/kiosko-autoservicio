import { useState } from 'react';

interface TimerContextType {
  idleTimeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
}

export const useIdleTimer = (clearCart: () => void, router: any): TimerContextType => {
  const [idleTimeLeft, setIdleTimeLeft] = useState<number>(300);  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); 

  const startTimer = () => {
    setIdleTimeLeft(300); 
    const interval = setInterval(() => {
      setIdleTimeLeft((prev) => {
        console.log('Idle time left:', prev);
        if (prev <= 1) {
          clearCart();
          router.push('/'); 
          clearInterval(interval);
        }
        return prev - 1; 
      });
    }, 1000); 
    setTimer(interval); 
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const resetTimer = () => {
    stopTimer(); 
    setIdleTimeLeft(300); 
    startTimer();
  };

  return {
    idleTimeLeft,
    startTimer,
    stopTimer,
    resetTimer,
  };
};