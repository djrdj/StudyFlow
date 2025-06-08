
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Bell, Clock, BookOpen, CheckCircle, Trash2, Edit } from "lucide-react";
import { getStoredEvents, getUpcomingEvents, updateEvent, deleteEvent, StudyEvent } from "@/lib/eventStorage";
import { getStoredData } from "@/lib/storage";
import AddEventDialog from "@/components/AddEventDialog";
import { format } from "date-fns";

const Calendar = () => {
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<StudyEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<StudyEvent | undefined>(undefined);
  const subjects = getStoredData().subjects;

  const loadEvents = () => {
    setEvents(getStoredEvents());
    setUpcomingEvents(getUpcomingEvents());
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleMarkComplete = (eventId: string) => {
    updateEvent(eventId, { completed: true });
    loadEvents();
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    loadEvents();
  };

  const handleEditEvent = (event: StudyEvent) => {
    setEditingEvent(event);
  };

  const getEventTypeColor = (type: StudyEvent['type']) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'assignment': return 'bg-orange-500';
      case 'study-session': return 'bg-blue-500';
      case 'reminder': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSubjectName = (subjectId?: string) => {
    if (!subjectId) return null;
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name;
  };

  const formatReminderTime = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} before`;
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} before`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} before`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Calendar</h1>
        <p className="text-lg text-muted-foreground">Manage your tests and important study dates</p>
      </div>

      {/* Add Event Button */}
      <div className="flex justify-center">
        <AddEventDialog onEventAdded={loadEvents} />
      </div>

      {/* Edit Event Dialog */}
      {editingEvent && (
        <AddEventDialog 
          onEventAdded={() => {
            loadEvents();
            setEditingEvent(undefined);
          }} 
          editEvent={editingEvent} 
        />
      )}

      {/* Upcoming Events */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Upcoming Events (Next 7 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming events in the next 7 days</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first event to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-studyflow-light-gray rounded-lg border border-studyflow-gray">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                          {event.type}
                        </Badge>
                        {getSubjectName(event.subjectId) && (
                          <Badge variant="outline">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {getSubjectName(event.subjectId)}
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {format(event.date, "PPP")}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(event.date, "p")}
                        </span>
                        <span className="flex items-center">
                          <Bell className="w-4 h-4 mr-1" />
                          {formatReminderTime(event.notifyBefore)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditEvent(event)}
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleMarkComplete(event.id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Events */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-secondary-foreground" />
            <span>All Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${event.completed ? 'bg-green-50 border-green-200' : 'bg-studyflow-light-gray border-studyflow-gray'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {event.title}
                      </span>
                      <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                        {event.type}
                      </Badge>
                      {event.completed && (
                        <Badge className="bg-green-500 text-white">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {format(event.date, "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                      {!event.completed && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditEvent(event)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleMarkComplete(event.id)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteEvent(event.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
