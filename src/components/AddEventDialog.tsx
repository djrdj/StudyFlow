
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getStoredData } from "@/lib/storage";
import { saveEvent, type Event } from "@/lib/eventStorage";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdded: () => void;
  editingEvent?: Event | null;
}

const AddEventDialog = ({ open, onOpenChange, onEventAdded, editingEvent }: AddEventDialogProps) => {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [description, setDescription] = useState(editingEvent?.description || "");
  const [date, setDate] = useState<Date>(editingEvent?.date ? new Date(editingEvent.date) : undefined);
  const [time, setTime] = useState(editingEvent?.time || "09:00");
  const [subject, setSubject] = useState<string>(editingEvent?.subject || "none");
  const [reminder, setReminder] = useState(editingEvent?.reminder || "1 hour before");
  const [customReminder, setCustomReminder] = useState(false);
  const [customReminderValue, setCustomReminderValue] = useState("");
  const [customReminderUnit, setCustomReminderUnit] = useState<"minutes" | "hours" | "days">("minutes");

  const subjects = getStoredData().subjects;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // Calculate reminder
    let finalReminder = reminder;
    if (customReminder && customReminderValue) {
      const value = parseInt(customReminderValue);
      finalReminder = `${value} ${customReminderUnit} before`;
    }

    const eventData: Omit<Event, 'id'> | Event = editingEvent 
      ? {
          ...editingEvent,
          title,
          description,
          date: format(date, "yyyy-MM-dd"),
          time,
          subject: subject === "none" ? "none" : subject,
          reminder: finalReminder,
        }
      : {
          title,
          description,
          date: format(date, "yyyy-MM-dd"),
          time,
          subject: subject === "none" ? "none" : subject,
          reminder: finalReminder,
        };

    saveEvent(eventData);

    // Reset form
    setTitle("");
    setDescription("");
    setDate(undefined);
    setTime("09:00");
    setSubject("none");
    setReminder("1 hour before");
    setCustomReminder(false);
    setCustomReminderValue("");
    setCustomReminderUnit("minutes");
    onOpenChange(false);
    onEventAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Math Final Exam"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject (Optional)</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No subject</SelectItem>
                {subjects.map((subjectItem) => (
                  <SelectItem key={subjectItem.id} value={subjectItem.name}>
                    {subjectItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Remind Me</Label>
            <div className="space-y-3">
              <Select 
                value={customReminder ? "custom" : reminder} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setCustomReminder(true);
                  } else {
                    setCustomReminder(false);
                    setReminder(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutes before">15 minutes before</SelectItem>
                  <SelectItem value="30 minutes before">30 minutes before</SelectItem>
                  <SelectItem value="1 hour before">1 hour before</SelectItem>
                  <SelectItem value="1 day before">1 day before</SelectItem>
                  <SelectItem value="1 week before">1 week before</SelectItem>
                  <SelectItem value="custom">Custom time</SelectItem>
                </SelectContent>
              </Select>

              {customReminder && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter value"
                    value={customReminderValue}
                    onChange={(e) => setCustomReminderValue(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={customReminderUnit} onValueChange={(value: "minutes" | "hours" | "days") => setCustomReminderUnit(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {editingEvent ? "Update Event" : "Add Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
