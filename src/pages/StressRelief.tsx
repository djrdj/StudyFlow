
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Heart, Quote, Volume2, VolumeX } from "lucide-react";

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  }
];

const AMBIENT_SOUNDS = [
  {
    name: "Rain Sounds",
    url: "https://www.soundjay.com/misc/sounds/rain-01.wav",
    description: "Gentle rainfall"
  },
  {
    name: "Ocean Waves",
    url: "https://www.soundjay.com/misc/sounds/ocean-wave-1.wav", 
    description: "Peaceful ocean sounds"
  },
  {
    name: "Forest Ambiance",
    url: "https://www.soundjay.com/misc/sounds/birds-singing.wav",
    description: "Birds chirping in nature"
  }
];

const StressRelief = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Breathing timer logic
  useEffect(() => {
    if (!breathingActive) return;

    const phases = {
      inhale: 4000,  // 4 seconds
      hold: 7000,    // 7 seconds  
      exhale: 8000   // 8 seconds
    };

    const timer = setTimeout(() => {
      if (breathingPhase === 'inhale') {
        setBreathingPhase('hold');
      } else if (breathingPhase === 'hold') {
        setBreathingPhase('exhale');
      } else {
        setBreathingPhase('inhale');
        setBreathingCount(prev => prev + 1);
      }
    }, phases[breathingPhase]);

    return () => clearTimeout(timer);
  }, [breathingActive, breathingPhase]);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const getNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % QUOTES.length);
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
    }
  };

  const getCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-100';
      default: return 'scale-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Stress Relief
        </h1>
        <p className="text-lg text-muted-foreground">Take a moment to relax and recharge</p>
      </div>

      {/* Breathing Exercise */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Breathing Exercise</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="relative flex items-center justify-center h-64">
            <div 
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 transition-transform duration-1000 ease-in-out ${getCircleScale()}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">
                  {breathingActive ? getBreathingInstruction() : 'Ready to breathe?'}
                </p>
                {breathingActive && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Cycle {breathingCount + 1}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!breathingActive ? (
              <Button onClick={startBreathing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                Start Breathing
              </Button>
            ) : (
              <Button onClick={stopBreathing} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetBreathing} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-sm text-muted-foreground max-w-md mx-auto">
            <p>Follow the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.</p>
          </div>
        </CardContent>
      </Card>

      {/* Ambient Sounds */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-secondary-foreground" />
            <span>Calming Sounds</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AMBIENT_SOUNDS.map((sound) => (
              <div 
                key={sound.name}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedSound === sound.name 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedSound(selectedSound === sound.name ? null : sound.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{sound.name}</h3>
                    <p className="text-sm text-muted-foreground">{sound.description}</p>
                  </div>
                  {selectedSound === sound.name && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/10">Playing</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioMuted(!audioMuted);
                        }}
                      >
                        {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <p>Click on a sound to start playing. Note: Audio requires user interaction to play.</p>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quotes */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Quote className="w-5 h-5 text-accent-foreground" />
            <span>Daily Inspiration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="min-h-[120px] flex items-center justify-center">
            <div className="max-w-2xl">
              <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed">
                "{QUOTES[currentQuote].text}"
              </blockquote>
              <cite className="text-muted-foreground font-medium mt-4 block">
                — {QUOTES[currentQuote].author}
              </cite>
            </div>
          </div>
          
          <Button onClick={getNextQuote} variant="outline">
            <Quote className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Study Break Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Physical Wellness</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take a 5-10 minute walk</li>
                <li>• Do simple stretches</li>
                <li>• Practice good posture</li>
                <li>• Stay hydrated</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Mental Wellness</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Practice gratitude</li>
                <li>• Take deep breaths</li>
                <li>• Listen to calming music</li>
                <li>• Connect with friends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StressRelief;
