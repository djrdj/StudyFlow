
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, Clock, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTimer } from "@/hooks/useTimer";
import { getStoredData, formatTimeDetailed } from "@/lib/storage";
import { useSearchParams } from "react-router-dom";

const Timer = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const timer = useTimer();
  
  const [subjects, setSubjects] = useState(() => getStoredData().subjects);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [pomodoroInterval, setPomodoroInterval] = useState(25); // in minutes
  const [lastPomodoroCheck, setLastPomodoroCheck] = useState(0);

  const pomodoroOptions = [
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 20, label: "20 minutes" },
    { value: 25, label: "25 minutes (Classic)" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "60 minutes" },
  ];

  // Set subject from URL params
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam && !timer.subjectId) {
      setSelectedSubject(subjectParam);
    } else if (timer.subjectId) {
      setSelectedSubject(timer.subjectId);
    }
  }, [searchParams, timer.subjectId]);

  // Check for Pomodoro intervals
  useEffect(() => {
    if (timer.isRunning && timer.time > 0) {
      const minutesElapsed = Math.floor(timer.time / 60);
      const intervalsPassed = Math.floor(minutesElapsed / pomodoroInterval);
      const lastIntervalsPassed = Math.floor(lastPomodoroCheck / 60 / pomodoroInterval);
      
      if (intervalsPassed > lastIntervalsPassed) {
        timer.playPomodoroSound();
        toast({
          title: "Pomodoro Break! 🔔",
          description: `You've studied for ${pomodoroInterval} minutes. Time for a break!`,
        });
        setLastPomodoroCheck(timer.time);
      }
    }
  }, [timer.time, timer.isRunning, pomodoroInterval, lastPomodoroCheck, toast, timer]);

  const handleStartTimer = () => {
    if (!selectedSubject) {
      toast({
        title: "Select a Subject",
        description: "Please choose a subject before starting the timer.",
        variant: "destructive",
      });
      return;
    }
    
    timer.startTimer(selectedSubject);
    setLastPomodoroCheck(0);
    
    const subjectName = subjects.find(s => s.id === selectedSubject)?.name;
    toast({
      title: "Timer Started! ⏰",
      description: `Good luck studying ${subjectName}!`,
    });
  };

  const handlePauseTimer = () => {
    timer.pauseTimer();
    toast({
      title: "Timer Paused",
      description: "Take a moment, then resume when ready.",
    });
  };

  const handleResumeTimer = () => {
    timer.resumeTimer();
    toast({
      title: "Timer Resumed",
      description: "Back to studying! You've got this!",
    });
  };

  const handleStopTimer = () => {
    if (timer.time > 0) {
      const subjectName = subjects.find(s => s.id === selectedSubject)?.name;
      timer.stopTimer();
      
      // Refresh subjects to show updated total time
      setSubjects(getStoredData().subjects);
      
      toast({
        title: "Great Session! 🎉",
        description: `You studied ${subjectName} for ${formatTimeDetailed(timer.time)}. Well done!`,
      });
    } else {
      timer.stopTimer();
    }
    setLastPomodoroCheck(0);
  };

  const nextPomodoroBreak = () => {
    const minutesElapsed = Math.floor(timer.time / 60);
    const nextBreakMinute = Math.ceil((minutesElapsed + 1) / pomodoroInterval) * pomodoroInterval;
    const minutesUntilBreak = nextBreakMinute - minutesElapsed;
    return minutesUntilBreak;
  };

  const formatSessionTime = () => {
    if (timer.startTime) {
      const start = timer.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const current = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${start} - ${current}`;
    }
    return '';
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
              {formatTimeDetailed(timer.time)}
            </div>
            
            {timer.isRunning && timer.time > 0 && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Next break in {nextPomodoroBreak()} minutes</span>
                </div>
                {timer.startTime && (
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Session: {formatSessionTime()}</span>
                  </div>
                )}
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
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={timer.isRunning}
              >
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
              <Select 
                value={pomodoroInterval.toString()} 
                onValueChange={(value) => setPomodoroInterval(parseInt(value))}
                disabled={timer.isRunning}
              >
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
              {!timer.isRunning ? (
                <Button 
                  onClick={timer.time > 0 ? handleResumeTimer : handleStartTimer}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {timer.time > 0 ? "Resume Timer" : "Start Timer"}
                </Button>
              ) : (
                <Button 
                  onClick={handlePauseTimer}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause Timer
                </Button>
              )}
              
              {timer.time > 0 && (
                <Button 
                  onClick={handleStopTimer}
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
