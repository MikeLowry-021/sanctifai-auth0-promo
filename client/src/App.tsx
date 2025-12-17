import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import Home from "@/pages/home";
import Results from "@/pages/results";
import Library from "@/pages/library";
import Community from "@/pages/community";
import SubmitReview from "@/pages/submit-review";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/results" component={Results} />
          <Route path="/library" component={Library} />
          <Route path="/community" component={Community} />
          <Route path="/submit-review" component={SubmitReview} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
