
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Clock } from "lucide-react";
import { getStoredData, getTodaySessions, formatTime } from "@/lib/storage";
import { useState, useEffect } from "react";

const Statistics = () => {
  const [data, setData] = useState(() => getStoredData());
  const [todaySessions, setTodaySessions] = useState(() => getTodaySessions());

  const weekSessions = data.sessions.filter(session => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return session.startTime >= weekAgo;
  });

  const totalWeekTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
  const totalTodayTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
  
  const subjectStats = data.subjects.map(subject => {
    const subjectSessions = data.sessions.filter(s => s.subjectId === subject.id);
    const weekSessions = subjectSessions.filter(s => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return s.startTime >= weekAgo;
    });
    const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    
    return {
      ...subject,
      sessionCount: subjectSessions.length,
      weekTime
    };
  }).sort((a, b) => b.totalTime - a.totalTime);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Statistics</h1>
        <p className="text-lg text-muted-foreground">Track your progress and see how far you've come</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Clock className="w-5 h-5" />
              <span>Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatTime(totalTodayTime)}</p>
            <p className="text-sm text-muted-foreground">{todaySessions.length} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-secondary-foreground">
              <TrendingUp className="w-5 h-5" />
              <span>This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatTime(totalWeekTime)}</p>
            <p className="text-sm text-muted-foreground">{weekSessions.length} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-accent/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-accent-foreground">
              <BarChart3 className="w-5 h-5" />
              <span>Total Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{data.sessions.length}</p>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <PieChart className="w-5 h-5" />
              <span>Avg Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {data.sessions.length > 0 
                ? formatTime(Math.round(data.sessions.reduce((sum, s) => sum + s.duration, 0) / data.sessions.length))
                : "0m"
              }
            </p>
            <p className="text-sm text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectStats.map((subject) => (
              <div key={subject.id} className="p-4 bg-studyflow-light-gray rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{subject.name}</h3>
                  <span className="text-sm font-medium text-primary">{formatTime(subject.totalTime)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>This week: {formatTime(subject.weekTime)}</span>
                  <span>{subject.sessionCount} sessions total</span>
                </div>
                <div className="mt-2 w-full bg-studyflow-gray rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.max(5, (subject.totalTime / Math.max(...subjectStats.map(s => s.totalTime))) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <BarChart3 className="w-12 h-12 text-primary" />
              <PieChart className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Beautiful Charts Coming Soon!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're working on amazing visualizations including interactive charts, progress graphs, and detailed analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
