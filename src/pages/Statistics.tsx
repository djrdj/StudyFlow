
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart } from "lucide-react";

const Statistics = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Study Statistics</h1>
        <p className="text-lg text-muted-foreground">Track your progress and see how far you've come</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <BarChart className="w-12 h-12 text-primary" />
              <PieChart className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Beautiful Charts Coming Soon!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're working on amazing visualizations to show your study progress, including:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
              <li>• Daily, weekly, and monthly study time breakdowns</li>
              <li>• Subject distribution pie charts</li>
              <li>• Progress tracking over time</li>
              <li>• Study streak analysis</li>
              <li>• Goal achievement metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
