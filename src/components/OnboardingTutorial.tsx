
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TutorialStep {
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to StudyFlow! 🎉",
    description: "Let's take a quick tour to help you get started with tracking your study time and staying focused.",
  },
  {
    title: "Dashboard Overview",
    description: "This is your main dashboard where you can see today's study progress and quick actions.",
  },
  {
    title: "Subjects Management",
    description: "Add and manage your subjects here. Each subject will track its own study time.",
  },
  {
    title: "Study Timer",
    description: "Use the timer to track your study sessions. It includes a Pomodoro mode for focused work.",
  },
  {
    title: "Statistics",
    description: "View detailed charts and analytics about your study habits and progress over time.",
  },
  {
    title: "Stress Relief",
    description: "Take breaks with guided breathing exercises and calming ambient sounds.",
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem("studyflow-onboarding-completed");
    if (hasCompleted) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("studyflow-onboarding-completed", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {currentStep + 1} of {tutorialSteps.length}
            </Badge>
          </div>
          <CardTitle className="text-xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{step.description}</p>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="flex items-center space-x-2">
              <span>{currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}</span>
              {currentStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          <div className="text-center">
            <Button variant="link" onClick={handleSkip} className="text-sm text-muted-foreground">
              Skip tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
