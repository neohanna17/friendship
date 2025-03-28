import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Register from "@/pages/register";

      <Route path="/incentives" component={Incentives} />
import Teams from "@/pages/teams";
import TeamProfile from "@/pages/team-profile";
import Fundraisers from "@/pages/fundraisers";
import FundraiserProfile from "@/pages/fundraiser-profile";
import Sponsors from "@/pages/sponsors";
import About from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import Donate from "@/pages/donate";
import Incentives from "@/pages/incentives";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/teams" component={Teams} />
      <Route path="/teams/:id" component={TeamProfile} />
      <Route path="/fundraisers" component={Fundraisers} />
      <Route path="/fundraisers/:id" component={FundraiserProfile} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/about" component={About} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/donate" component={Donate} />
      <Route path="/event-info" component={NotFound} />
      <Route path="/fundraising-toolkit" component={NotFound} />
      <Route path="/incentives" component={NotFound} />
      <Route path="/volunteer" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
