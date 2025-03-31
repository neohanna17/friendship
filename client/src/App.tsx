import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Teams from "@/pages/teams";
import Fundraisers from "@/pages/fundraisers";
import FundraiserProfile from "@/pages/fundraiser-profile";
import TeamProfile from "@/pages/team-profile";
import Guide from "@/pages/guide";
import Dashboard from "@/pages/dashboard";
import Incentives from "@/pages/incentives";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AboutPage from "@/pages/about";
import Register from "@/pages/register";
import Donate from "@/pages/donate";
import VolunteerPage from "@/pages/volunteer";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/teams" component={Teams} />
            <Route path="/teams/:id" component={TeamProfile} />
            <Route path="/fundraisers" component={Fundraisers} />
            <Route path="/fundraisers/:id" component={FundraiserProfile} />
            <Route path="/guide" component={Guide} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/incentives" component={Incentives} />
            <Route path="/about" component={AboutPage} />
            <Route path="/register" component={Register} />
            <Route path="/donate" component={Donate} />
            <Route path="/volunteer" component={VolunteerPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}