
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
import { addEvent, updateEvent, StudyEvent } from "@/lib/eventStorage";

interface AddEventDialogProps {
  onEventAdded: () => void;
  editEvent?: StudyEvent;
}

const AddEventDialog = ({ onEventAdded, editEvent }: AddEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editEvent?.title || "");
  const [description, setDescription] = useState(editEvent?.description || "");
  const [date, setDate] = useState<Date>(editEvent?.date || undefined);
  const [time, setTime] = useState(editEvent?.date ? format(editEvent.date, "HH:mm") : "09:00");
  const [type, setType] = useState<StudyEvent['type']>(editEvent?.type || "exam");
  const [subjectId, setSubjectId] = useState<string>(editEvent?.subjectId || "none");
  const [notifyBefore, setNotifyBefore] = useState(editEvent?.notifyBefore || 60);
  const [customReminder, setCustomReminder] = useState(false);
  const [customReminderValue, setCustomReminderValue] = useState("");
  const [customReminderUnit, setCustomReminderUnit] = useState<"minutes" | "hours" | "days">("minutes");

  const subjects = getStoredData().subjects;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const eventDateTime = new Date(date);
    eventDateTime.setHours(hours, minutes, 0, 0);

    // Calculate reminder time
    let reminderMinutes = notifyBefore;
    if (customReminder && customReminderValue) {
      const value = parseInt(customReminderValue);
      switch (customReminderUnit) {
        case "hours":
          reminderMinutes = value * 60;
          break;
        case "days":
          reminderMinutes = value * 24 * 60;
          break;
        default:
          reminderMinutes = value;
      }
    }

    const eventData = {
      title,
      description,
      date: eventDateTime,
      type,
      subjectId: subjectId === "none" ? undefined : subjectId,
      notifyBefore: reminderMinutes,
      completed: false
    };

    if (editEvent) {
      updateEvent(editEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setDate(undefined);
    setTime("09:00");
    setType("exam");
    setSubjectId("none");
    setNotifyBefore(60);
    setCustomReminder(false);
    setCustomReminderValue("");
    setCustomReminderUnit("minutes");
    setOpen(false);
    onEventAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          {editEvent ? "Edit Event" : "Add Event"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editEvent ? "Edit Study Event" : "Add Study Event"}</DialogTitle>
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
            <Label>Event Type</Label>
            <Select value={type} onValueChange={(value: StudyEvent['type']) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="study-session">Study Session</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject (Optional)</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No subject</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Remind Me</Label>
            <div className="space-y-3">
              <Select 
                value={customReminder ? "custom" : notifyBefore.toString()} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setCustomReminder(true);
                  } else {
                    setCustomReminder(false);
                    setNotifyBefore(Number(value));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                  <SelectItem value="10080">1 week before</SelectItem>
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
            {editEvent ? "Update Event" : "Add Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
