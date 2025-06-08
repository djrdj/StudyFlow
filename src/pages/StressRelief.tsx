
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Headphones, Quote } from "lucide-react";

const stressReliefQuotes = [
  "Take a deep breath. You've got this! 🌸",
  "Progress is progress, no matter how small. 🌱",
  "Your mind is powerful. Give it rest when it needs it. 🧘‍♀️",
  "Every challenge is an opportunity to grow stronger. 💪",
  "Be kind to yourself. You're doing better than you think. 💝",
  "Take breaks. They're not giving up, they're recharging. ⚡",
];

const StressRelief = () => {
  const getRandomQuote = () => {
    return stressReliefQuotes[Math.floor(Math.random() * stressReliefQuotes.length)];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Stress Relief</h1>
        <p className="text-lg text-muted-foreground">Take a moment to breathe and recharge</p>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <Quote className="w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium text-foreground">{getRandomQuote()}</p>
        </CardContent>
      </Card>

      {/* Breathing Exercise */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Breathing Exercise</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-studyflow-light-gray p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">4-7-8 Breathing Technique</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>📖 <strong>Inhale</strong> through your nose for <strong>4 seconds</strong></p>
              <p>⏸️ <strong>Hold</strong> your breath for <strong>7 seconds</strong></p>
              <p>💨 <strong>Exhale</strong> through your mouth for <strong>8 seconds</strong></p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              Repeat this cycle 3-4 times to help reduce stress and anxiety
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calming Audio */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-secondary-foreground" />
            <span>Calming Audio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-studyflow-light-gray p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">MyNoise - Nature Sounds</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Immerse yourself in calming nature soundscapes
              </p>
              <iframe
                src="https://mynoise.net/superGenerator.php"
                width="100%"
                height="200"
                frameBorder="0"
                title="MyNoise Nature Sounds"
                className="rounded border border-studyflow-gray"
              ></iframe>
            </div>
            
            <div className="bg-studyflow-light-gray p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">Ambient Soundscapes</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Soothing background sounds for focus and relaxation
              </p>
              <div className="space-y-2">
                <a 
                  href="https://mynoise.net/radios.php" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded text-center transition-colors"
                >
                  🎵 MyNoise Radio
                </a>
                <a 
                  href="https://www.youtube.com/channel/UCnJk9mmcKpBN8hlxyjRDj9Q" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground p-3 rounded text-center transition-colors"
                >
                  🎬 Calming YouTube Channel
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Quick Stress Relief Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-studyflow-light-gray p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🧘‍♀️</div>
              <h4 className="font-medium text-foreground">Mindful Moment</h4>
              <p className="text-sm text-muted-foreground">Take 2 minutes to focus only on your breathing</p>
            </div>
            <div className="bg-studyflow-light-gray p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🚶‍♂️</div>
              <h4 className="font-medium text-foreground">Quick Walk</h4>
              <p className="text-sm text-muted-foreground">Step outside for fresh air and gentle movement</p>
            </div>
            <div className="bg-studyflow-light-gray p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">💧</div>
              <h4 className="font-medium text-foreground">Stay Hydrated</h4>
              <p className="text-sm text-muted-foreground">Drink water and give your brain the fuel it needs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StressRelief;
