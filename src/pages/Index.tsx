
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredData, getTodaySessions, formatTime } from "@/lib/storage";

const motivationalQuotes = [
  "Every expert was once a beginner. Keep going! 🌟",
  "Progress, not perfection. You're doing great! 💪",
  "Small steps lead to big achievements. 🚀",
  "Learning is a journey, not a destination. 📚",
  "Your future self will thank you for studying today! ✨",
];

const Index = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [subjects, setSubjects] = useState(() => getStoredData().subjects);
  const [todaySessions, setTodaySessions] = useState(() => getTodaySessions());

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const totalTodayTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
  const todayBySubject = subjects.map(subject => {
    const subjectSessions = todaySessions.filter(s => s.subjectId === subject.id);
    const todayTime = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
    return { ...subject, todayTime };
  });

  const handleStartTimer = (subjectId: string) => {
    navigate(`/timer?subject=${subjectId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Welcome to StudyFlow</h1>
        <p className="text-lg text-muted-foreground">Track your learning journey and stay motivated</p>
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-foreground font-medium">{quote}</p>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Clock className="w-5 h-5" />
              <span>Today's Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{formatTime(totalTodayTime)}</p>
            <p className="text-sm text-muted-foreground mt-1">Time studied today</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-secondary-foreground">
              <BookOpen className="w-5 h-5" />
              <span>Active Subjects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{subjects.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Subjects in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-accent/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-accent-foreground">
              <Calendar className="w-5 h-5" />
              <span>Study Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">7</p>
            <p className="text-sm text-muted-foreground mt-1">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Subjects */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Today's Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayBySubject.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-4 bg-studyflow-light-gray rounded-lg border border-studyflow-gray hover:shadow-sm transition-all">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{subject.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <span>Today: {formatTime(subject.todayTime)}</span>
                    <span>•</span>
                    <span>Total: {formatTime(subject.totalTime)}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleStartTimer(subject.id)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => navigate("/subjects")}
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Subjects
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {todaySessions.length > 0 && (
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.slice(-3).reverse().map((session) => {
                const subject = subjects.find(s => s.id === session.subjectId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-studyflow-light-gray rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{subject?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">{formatTime(session.duration)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
