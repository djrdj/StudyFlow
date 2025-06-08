
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-studyflow-light-gray">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! This page seems to be taking a study break</p>
        <p className="text-muted-foreground">
          Don't worry, even the best students sometimes take wrong turns. Let's get you back on track!
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
          <Button 
            onClick={() => navigate("/subjects")}
            variant="outline"
            className="w-full border-secondary text-secondary-foreground hover:bg-secondary/10"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Subjects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
