import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QRProvider } from "@/contexts/QRContext";
import Header from "@/components/Header";
import Home from "./pages/Home";
import CreateQR from "./pages/CreateQR";
import ScanQR from "./pages/ScanQR";
import Statistics from "./pages/Statistics";
import MyQRs from "./pages/MyQRs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <QRProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateQR />} />
                <Route path="/scan" element={<ScanQR />} />
                <Route path="/stats" element={<Statistics />} />
                <Route path="/my-qrs" element={<MyQRs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QRProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
