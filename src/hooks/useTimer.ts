
import { useState, useEffect, useRef } from 'react';
import { addSession } from '@/lib/storage';

interface TimerState {
  isRunning: boolean;
  time: number; // seconds
  subjectId: string | null;
  startTime: Date | null;
}

const TIMER_STORAGE_KEY = 'studyflow-timer-state';

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    time: 0,
    subjectId: null,
    startTime: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext>();

  // Load timer state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TIMER_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.startTime) {
          data.startTime = new Date(data.startTime);
          // Calculate elapsed time if timer was running
          if (data.isRunning) {
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - data.startTime.getTime()) / 1000);
            data.time = elapsed;
          }
        }
        setState(data);
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  }, []);

  // Save timer state to localStorage
  const saveTimerState = (newState: TimerState) => {
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prevState => {
          const newState = { ...prevState, time: prevState.time + 1 };
          saveTimerState(newState);
          return newState;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  const playPomodoroSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const startTimer = (subjectId: string) => {
    const startTime = new Date();
    const newState = {
      isRunning: true,
      time: 0,
      subjectId,
      startTime,
    };
    setState(newState);
    saveTimerState(newState);
  };

  const pauseTimer = () => {
    const newState = { ...state, isRunning: false };
    setState(newState);
    saveTimerState(newState);
  };

  const resumeTimer = () => {
    const newState = { ...state, isRunning: true };
    setState(newState);
    saveTimerState(newState);
  };

  const stopTimer = () => {
    if (state.subjectId && state.startTime && state.time > 0) {
      const endTime = new Date();
      addSession(state.subjectId, state.startTime, endTime);
    }
    
    const newState = {
      isRunning: false,
      time: 0,
      subjectId: null,
      startTime: null,
    };
    setState(newState);
    saveTimerState(newState);
    
    // Clear stored timer state
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  return {
    ...state,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    playPomodoroSound,
  };
};
