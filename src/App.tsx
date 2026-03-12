import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import IdeaPage from "./pages/IdeaPage";
import FavouritesPage from "./pages/FavouritesPage";
import GetIdeasPage from "./pages/GetIdeasPage";
import SettingsPage from "./pages/Settings";
import MentorsPage from "./pages/MentorsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<IdeaPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/get-ideas" element={<GetIdeasPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
