
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Bell } from "lucide-react";

const Calendar = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Calendar</h1>
        <p className="text-lg text-muted-foreground">Manage your tests and important study dates</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <CalendarIcon className="w-12 h-12 text-primary" />
              <Bell className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Smart Calendar Coming Soon!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personal study calendar will help you stay organized with:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
              <li>• Test and exam scheduling</li>
              <li>• Smart reminder notifications</li>
              <li>• Subject-based event organization</li>
              <li>• Countdown timers to important dates</li>
              <li>• Study plan suggestions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
