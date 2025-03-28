import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Teams from "@/pages/teams";
import Guide from "@/pages/guide";
import TeamProfile from "@/pages/team-profile";
import FundraiserProfile from "@/pages/fundraiser-profile";
import Dashboard from "@/pages/dashboard";
import Incentives from "@/pages/incentives";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AboutPage from "@/pages/about"; // Import the AboutPage component

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/teams" component={Teams} />
            <Route path="/guide" component={Guide} />
            <Route path="/team/:id" component={TeamProfile} />
            <Route path="/fundraiser/:id" component={FundraiserProfile} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/incentives" component={Incentives} />
            <Route path="/about" component={AboutPage} /> {/* Added About route */}
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}