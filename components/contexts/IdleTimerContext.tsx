import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

interface IdleTimerContextType {
  idleTimeLeft: number;
  resetTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  setIdleTimeTo: (value: number) => void;
}

const IdleTimerContext = createContext<IdleTimerContextType | undefined>(undefined);

export const IdleTimerProvider = ({ children }: { children: ReactNode }) => {
  const [idleTimeLeft, setIdleTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const tick = () => {
    setIdleTime((prev) => {
      console.log('Timer:', prev);
      if (prev >= 300) {
        stopTimer(); 
        router.replace('/');
        return 0;
      }
      return prev + 1;
    });
  };
  

  const startTimer = () => {
    if (timerRef.current !== null) return;
    timerRef.current = setInterval(tick, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    setIdleTime(0);
  };

  const setIdleTimeTo = (value: number) => {
    setIdleTime(value);
  };

  useEffect(() => {
    const handleUserInteraction = () => resetTimer();
    const eventTypes = ['touchstart', 'mousedown', 'keydown'];
    eventTypes.forEach((event) => document.addEventListener(event, handleUserInteraction));
    return () => {
      eventTypes.forEach((event) => document.removeEventListener(event, handleUserInteraction));
    };
  }, []);

  return (
    <IdleTimerContext.Provider value={{ idleTimeLeft, resetTimer, setIdleTimeTo, startTimer, stopTimer }}>
      <TouchableWithoutFeedback onPress={resetTimer}>
        <View style={{ flex: 1 }}>{children}</View>
      </TouchableWithoutFeedback>
    </IdleTimerContext.Provider>
  );
};

export const useIdleTimer = () => useContext(IdleTimerContext)!;