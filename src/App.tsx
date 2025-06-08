
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Subjects from "./pages/Subjects";
import Timer from "./pages/Timer";
import Statistics from "./pages/Statistics";
import Calendar from "./pages/Calendar";
import StressRelief from "./pages/StressRelief";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-studyflow-light-gray">
            <AppSidebar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/timer" element={<Timer />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/stress-relief" element={<StressRelief />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
