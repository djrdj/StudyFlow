
import { toast } from "@/hooks/use-toast";

export const useNotifications = () => {
  const showSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
      variant: "default",
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const showInfo = (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};
