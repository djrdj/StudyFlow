import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Heart, Volume2, VolumeX } from "lucide-react";

const breathingQuotes = [
  "Breathe in peace, breathe out stress. You've got this! 🌸",
  "Every breath is a fresh start. Let go and breathe deeply. 💫",
  "Your breath is your anchor to the present moment. 🌊", 
  "Inhale confidence, exhale doubt. You are capable! ✨",
  "Deep breaths create space for clarity and calm. 🍃",
  "With each breath, you're becoming more centered. 🧘‍♀️",
  "Let your breath be your guide back to peace. 🌙",
  "Breathing mindfully is a gift you give yourself. 🎁"
];

const ambientSounds = [
  {
    name: "Rain & Thunder",
    url: "https://www.soundjay.com/misc/rain-04.wav",
    description: "Gentle rain with distant thunder"
  },
  {
    name: "Ocean Waves", 
    url: "https://www.soundjay.com/misc/ocean-waves-1.wav",
    description: "Peaceful ocean waves"
  },
  {
    name: "Forest Birds",
    url: "https://www.soundjay.com/misc/birds-chirping-1.wav", 
    description: "Chirping birds in a quiet forest"
  }
];

const StressRelief = () => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-pause)
  const breathingPattern = {
    inhale: 4,
    hold: 4, 
    exhale: 4,
    pause: 4
  };

  useEffect(() => {
    const randomQuote = breathingQuotes[Math.floor(Math.random() * breathingQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (isBreathingActive) {
      intervalRef.current = setInterval(() => {
        setBreathingTimer(prev => {
          const newTime = prev + 1;
          const currentPhaseDuration = breathingPattern[breathingPhase];
          
          if (newTime >= currentPhaseDuration) {
            // Move to next phase
            switch (breathingPhase) {
              case 'inhale':
                setBreathingPhase('hold');
                break;
              case 'hold':
                setBreathingPhase('exhale');
                break;
              case 'exhale':
                setBreathingPhase('pause');
                break;
              case 'pause':
                setBreathingPhase('inhale');
                setBreathingCycle(cycle => cycle + 1);
                break;
            }
            return 0;
          }
          return newTime;
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
  }, [isBreathingActive, breathingPhase]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
  };

  const pauseBreathing = () => {
    setIsBreathingActive(false);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('pause');
    setBreathingTimer(0);
    setBreathingCycle(0);
  };

  const playAmbientSound = async (soundUrl: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Create new audio with better error handling
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.volume = isMuted ? 0 : 0.3;
      
      // Handle load errors
      audio.onerror = (error) => {
        console.log("Audio load error:", error);
        // Fallback to a simple tone generator if external audio fails
        playFallbackSound();
      };
      
      audio.onloadstart = () => {
        console.log("Started loading audio:", soundUrl);
      };
      
      audio.oncanplaythrough = () => {
        console.log("Audio ready to play");
      };
      
      audio.src = soundUrl;
      audioRef.current = audio;
      
      await audio.play();
      setSelectedSound(soundUrl);
      console.log("Audio playing successfully");
      
    } catch (error) {
      console.log("Audio playback failed:", error);
      // Fallback to a simple tone if external audio fails
      playFallbackSound();
    }
  };

  const playFallbackSound = () => {
    // Create a simple white noise using Web Audio API as fallback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = 4096;
      const whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
      
      whiteNoise.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 0.1 - 0.05; // Low volume white noise
        }
      };
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : 0.1;
      
      whiteNoise.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Store reference for cleanup
      (audioRef as any).current = { 
        pause: () => {
          whiteNoise.disconnect();
          audioContext.close();
        },
        volume: gainNode.gain.value
      };
      
      setSelectedSound("fallback");
      console.log("Playing fallback white noise");
    } catch (error) {
      console.log("Fallback audio also failed:", error);
    }
  };

  const stopAmbientSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedSound(null);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (audioRef.current) {
        if ('volume' in audioRef.current) {
          audioRef.current.volume = newMuted ? 0 : 0.3;
        } else if ('gain' in audioRef.current) {
          (audioRef.current as any).gain.value = newMuted ? 0 : 0.1;
        }
      }
      return newMuted;
    });
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      case 'pause':
        return 'Rest...';
    }
  };

  const getBreathingCircleScale = () => {
    const progress = breathingTimer / breathingPattern[breathingPhase];
    switch (breathingPhase) {
      case 'inhale':
        return 1 + (progress * 0.5); // Scale from 1 to 1.5
      case 'hold':
        return 1.5; // Stay at maximum
      case 'exhale':
        return 1.5 - (progress * 0.5); // Scale from 1.5 back to 1
      case 'pause':
        return 1; // Stay at minimum
    }
  };

  const refreshQuote = () => {
    const newQuote = breathingQuotes[Math.floor(Math.random() * breathingQuotes.length)];
    setCurrentQuote(newQuote);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Stress Relief</h1>
        <p className="text-lg text-muted-foreground">Take a moment to breathe and find your center</p>
      </div>

      {/* Ambient Sounds */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-secondary-foreground" />
              <span>Ambient Sounds</span>
            </div>
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="border-muted-foreground/20"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ambientSounds.map((sound, index) => (
              <Card key={index} className="bg-studyflow-light-gray border-studyflow-gray">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-foreground mb-2">{sound.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sound.description}</p>
                  {selectedSound === sound.url || (selectedSound === "fallback" && index === 0) ? (
                    <Button 
                      onClick={stopAmbientSound}
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => playAmbientSound(sound.url)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Note: If external audio fails to load, a gentle white noise will play as a fallback. Click play to start ambient sounds.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <p className="text-xl font-medium text-foreground italic">"{currentQuote}"</p>
            <Button 
              onClick={refreshQuote}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Exercise */}
      <Card className="bg-card shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-center">
            <Heart className="w-6 h-6 text-primary" />
            <span>Breathing Exercise</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            {/* Breathing Circle */}
            <div className="flex justify-center">
              <div 
                className="w-48 h-48 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center transition-transform duration-1000 ease-in-out"
                style={{ transform: `scale(${getBreathingCircleScale()})` }}
              >
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary">{getBreathingInstruction()}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {breathingPattern[breathingPhase] - breathingTimer}s
                  </p>
                </div>
              </div>
            </div>

            {/* Cycle Counter */}
            <div className="text-center">
              <p className="text-lg text-foreground">Cycles Completed: <span className="font-bold text-primary">{breathingCycle}</span></p>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isBreathingActive ? (
                <Button 
                  onClick={startBreathing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Breathing
                </Button>
              ) : (
                <Button 
                  onClick={pauseBreathing}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={resetBreathing}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StressRelief;
