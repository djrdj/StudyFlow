
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, Clock, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
}

const Timer = () => {
  const { toast } = useToast();
  const [subjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
  ]);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [pomodoroInterval, setPomodoroInterval] = useState(25); // in minutes
  const [lastPomodoroTime, setLastPomodoroTime] = useState(0);

  const pomodoroOptions = [
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 20, label: "20 minutes" },
    { value: 25, label: "25 minutes (Classic)" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "60 minutes" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          
          // Check for Pomodoro interval
          const minutesElapsed = Math.floor(newTime / 60);
          const lastMinutesElapsed = Math.floor(lastPomodoroTime / 60);
          
          if (minutesElapsed % pomodoroInterval === 0 && minutesElapsed > lastMinutesElapsed) {
            playPomodoroSound();
            toast({
              title: "Pomodoro Break! 🔔",
              description: `You've studied for ${pomodoroInterval} minutes. Time for a break!`,
            });
            setLastPomodoroTime(newTime);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, pomodoroInterval, lastPomodoroTime, toast]);

  const playPomodoroSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!selectedSubject) {
      toast({
        title: "Select a Subject",
        description: "Please choose a subject before starting the timer.",
        variant: "destructive",
      });
      return;
    }
    setIsRunning(true);
    toast({
      title: "Timer Started! ⏰",
      description: `Good luck studying ${subjects.find(s => s.id === selectedSubject)?.name}!`,
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    toast({
      title: "Timer Paused",
      description: "Take a moment, then resume when ready.",
    });
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (time > 0) {
      const subjectName = subjects.find(s => s.id === selectedSubject)?.name;
      toast({
        title: "Great Session! 🎉",
        description: `You studied ${subjectName} for ${formatTime(time)}. Well done!`,
      });
    }
    setTime(0);
    setLastPomodoroTime(0);
  };

  const nextPomodoroBreak = () => {
    const minutesElapsed = Math.floor(time / 60);
    const nextBreakMinute = Math.ceil((minutesElapsed + 1) / pomodoroInterval) * pomodoroInterval;
    const minutesUntilBreak = nextBreakMinute - minutesElapsed;
    return minutesUntilBreak;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Timer</h1>
        <p className="text-lg text-muted-foreground">Focus on your studies with Pomodoro technique</p>
      </div>

      {/* Timer Display */}
      <Card className="bg-card shadow-lg border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl md:text-8xl font-mono font-bold text-primary animate-pulse-gentle">
              {formatTime(time)}
            </div>
            
            {isRunning && time > 0 && (
              <div className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Next break in {nextPomodoroBreak()} minutes</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Selection */}
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-secondary-foreground" />
              <span>Study Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Subject
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject to study" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Pomodoro Interval
              </label>
              <Select value={pomodoroInterval.toString()} onValueChange={(value) => setPomodoroInterval(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pomodoroOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Timer Controls */}
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-primary" />
              <span>Timer Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isRunning ? (
                <Button 
                  onClick={startTimer}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {time > 0 ? "Resume Timer" : "Start Timer"}
                </Button>
              ) : (
                <Button 
                  onClick={pauseTimer}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause Timer
                </Button>
              )}
              
              {time > 0 && (
                <Button 
                  onClick={stopTimer}
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop & Save Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timer;
