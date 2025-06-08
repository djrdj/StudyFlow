
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Clock, Bell, Trash2 } from "lucide-react";
import AddEventDialog from "@/components/AddEventDialog";
import { getEvents, deleteEvent, type Event } from "@/lib/eventStorage";
import { format, isToday, isFuture, isPast } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const loadEvents = () => {
    setEvents(getEvents());
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventAdded = () => {
    loadEvents();
    setIsAddDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    loadEvents();
    toast({
      title: "Event deleted",
      description: "The event has been successfully removed.",
    });
  };

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.date);
    if (isToday(eventDate)) return "today";
    if (isFuture(eventDate)) return "upcoming";
    if (isPast(eventDate)) return "past";
    return "past";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today": return "bg-primary text-primary-foreground";
      case "upcoming": return "bg-secondary text-secondary-foreground";
      case "past": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const todayEvents = sortedEvents.filter(event => isToday(new Date(event.date)));
  const upcomingEvents = sortedEvents.filter(event => isFuture(new Date(event.date)));
  const pastEvents = sortedEvents.filter(event => isPast(new Date(event.date)) && !isToday(new Date(event.date)));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage your study schedule and events</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <CalendarIcon className="w-5 h-5" />
              <span>Today's Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <Badge className={getStatusColor(getEventStatus(event))}>
                        Today
                      </Badge>
                      {event.subject !== "none" && (
                        <Badge variant="outline">{event.subject}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.reminder && (
                        <div className="flex items-center space-x-1">
                          <Bell className="w-4 h-4" />
                          <span>{event.reminder}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => setEditingEvent(event)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <Badge className={getStatusColor(getEventStatus(event))}>
                        Upcoming
                      </Badge>
                      {event.subject !== "none" && (
                        <Badge variant="outline">{event.subject}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.reminder && (
                        <div className="flex items-center space-x-1">
                          <Bell className="w-4 h-4" />
                          <span>{event.reminder}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => setEditingEvent(event)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Past Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-muted-foreground">{event.title}</h3>
                      <Badge className={getStatusColor(getEventStatus(event))}>
                        Completed
                      </Badge>
                      {event.subject !== "none" && (
                        <Badge variant="outline" className="opacity-60">{event.subject}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 opacity-70">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">Start organizing your study schedule by adding your first event.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Event
            </Button>
          </CardContent>
        </Card>
      )}

      <AddEventDialog
        open={isAddDialogOpen || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingEvent(null);
          }
        }}
        onEventAdded={handleEventAdded}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;
