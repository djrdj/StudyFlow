
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Event } from "@/lib/eventStorage";

interface CalendarGridProps {
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

const CalendarGrid = ({ events, onDateClick, onEventClick }: CalendarGridProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors
                  ${isCurrentMonth ? "bg-background hover:bg-accent/50" : "bg-muted/30 text-muted-foreground"}
                  ${isDayToday ? "ring-2 ring-primary" : ""}
                `}
                onClick={() => onDateClick(day)}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isDayToday ? "text-primary font-bold" : ""}
                `}>
                  {format(day, "d")}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      {event.time && (
                        <div className="text-[10px] opacity-70">{event.time}</div>
                      )}
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                
                {dayEvents.length === 0 && isCurrentMonth && (
                  <div className="flex items-center justify-center h-8 opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;
