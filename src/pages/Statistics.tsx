import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Calendar, Clock, TrendingUp, BookOpen, Target } from "lucide-react";
import { getStoredData, formatTime } from "@/lib/storage";

type TimeFrame = 'daily' | 'weekly' | 'monthly';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const Statistics = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const data = getStoredData();

  // Filter sessions based on timeframe
  const getFilteredSessions = () => {
    const now = new Date();
    let startDate = new Date();

    switch (timeFrame) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return data.sessions.filter(session => session.startTime >= startDate);
  };

  const filteredSessions = getFilteredSessions();

  // Calculate statistics
  const totalStudyTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionLength = filteredSessions.length > 0 
    ? Math.round(totalStudyTime / filteredSessions.length) 
    : 0;

  // Subject breakdown for pie chart
  const subjectData = data.subjects.map(subject => {
    const subjectSessions = filteredSessions.filter(s => s.subjectId === subject.id);
    const time = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
    return {
      name: subject.name,
      value: time,
      sessions: subjectSessions.length
    };
  }).filter(item => item.value > 0);

  // Daily breakdown for line chart
  const dailyData = useMemo(() => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const daySessions = filteredSessions.filter(session => 
        session.startTime >= date && session.startTime <= dayEnd
      );
      
      const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        time: Math.round(totalTime / 60), // Convert to minutes
        sessions: daySessions.length
      });
    }
    
    return days;
  }, [filteredSessions]);

  // Weekly breakdown for bar chart
  const weeklyData = data.subjects.map(subject => {
    const subjectSessions = filteredSessions.filter(s => s.subjectId === subject.id);
    const time = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
    return {
      subject: subject.name,
      time: Math.round(time / 60), // Convert to minutes
      sessions: subjectSessions.length
    };
  }).filter(item => item.time > 0);

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'daily': return 'Today';
      case 'weekly': return 'Last 7 Days';
      case 'monthly': return 'Last 30 Days';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Statistics</h1>
        <p className="text-lg text-muted-foreground">Track your progress and identify patterns</p>
      </div>

      {/* Time Frame Filter */}
      <div className="flex justify-center">
        <Select value={timeFrame} onValueChange={(value: TimeFrame) => setTimeFrame(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Today</SelectItem>
            <SelectItem value="weekly">Last 7 Days</SelectItem>
            <SelectItem value="monthly">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Clock className="w-5 h-5" />
              <span>Total Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatTime(totalStudyTime)}</p>
            <p className="text-sm text-muted-foreground">{getTimeFrameLabel()}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-secondary-foreground">
              <Target className="w-5 h-5" />
              <span>Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{filteredSessions.length}</p>
            <p className="text-sm text-muted-foreground">Study sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-accent/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-accent-foreground">
              <TrendingUp className="w-5 h-5" />
              <span>Average</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatTime(averageSessionLength)}</p>
            <p className="text-sm text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <BookOpen className="w-5 h-5" />
              <span>Subjects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{subjectData.length}</p>
            <p className="text-sm text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Trend */}
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Daily Study Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} min`, 'Study Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution Pie Chart */}
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-secondary-foreground" />
              <span>Subject Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatTime(value), 'Study Time']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown Bar Chart */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="w-5 h-5 text-accent-foreground" />
            <span>Study Time by Subject ({getTimeFrameLabel()})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} min`, 'Study Time']}
                />
                <Bar 
                  dataKey="time" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject Details */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Subject Breakdown ({getTimeFrameLabel()})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectData.map((subject, index) => (
              <div key={subject.name} className="flex items-center justify-between p-4 bg-studyflow-light-gray rounded-lg border border-studyflow-gray hover:shadow-sm transition-all">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-foreground">{subject.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="bg-background">
                    {subject.sessions} sessions
                  </Badge>
                  <span className="font-semibold text-primary">{formatTime(subject.value)}</span>
                </div>
              </div>
            ))}
            {subjectData.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No study sessions in this time period</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
