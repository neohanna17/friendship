import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DonationForm from "@/components/fundraising/donation-form";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import Thermometer from "@/components/fundraising/thermometer";
import { Heart } from "lucide-react";

// Load Stripe outside of component to avoid recreating Stripe object on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_default");

interface Team {
  id: number;
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  teamImage: string;
  captainName: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string;
  goalAmount: number;
  raisedAmount: number;
}

interface EventSettings {
  eventName: string;
  goalAmount: number;
  raisedAmount: number;
}

const Donate = () => {
  const [location] = useLocation();
  const [donationType, setDonationType] = useState<"event" | "team" | "individual">("event");
  
  const params = new URLSearchParams(location.search);
  const teamId = params.get("team") ? parseInt(params.get("team") as string) : null;
  const userId = params.get("user") ? parseInt(params.get("user") as string) : null;
  
  // Set donation type based on URL parameters
  useEffect(() => {
    if (teamId) {
      setDonationType("team");
    } else if (userId) {
      setDonationType("individual");
    } else {
      setDonationType("event");
    }
  }, [teamId, userId]);
  
  // Fetch event settings
  const { data: eventData, isLoading: eventLoading } = useQuery<{ settings: EventSettings }>({
    queryKey: ['/api/event'],
    enabled: donationType === "event"
  });
  
  // Fetch team data if a team ID is provided
  const { data: teamData, isLoading: teamLoading } = useQuery<{ team: Team }>({
    queryKey: ['/api/teams', teamId],
    enabled: teamId !== null && donationType === "team"
  });
  
  // Fetch user data if a user ID is provided
  const { data: userData, isLoading: userLoading } = useQuery<{ user: User }>({
    queryKey: ['/api/users', userId],
    enabled: userId !== null && donationType === "individual"
  });
  
  const isLoading = (donationType === "event" && eventLoading) || 
                    (donationType === "team" && teamLoading) || 
                    (donationType === "individual" && userLoading);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setDonationType(value as "event" | "team" | "individual");
    
    // Update URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.delete("team");
    url.searchParams.delete("user");
    window.history.pushState({}, "", url.toString());
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Make a Donation
            </h1>
            <p className="text-gray-600 text-lg">
              Your generosity helps support Friendship Circle's programs for individuals with special needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 lg:col-span-4">
              {/* Donation information */}
              <Card className="mb-6 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-4 text-gray-900">
                    {donationType === "event" ? "Walk for Friendship" :
                     donationType === "team" ? teamData?.team.name || "Team" :
                     userData?.user ? `${userData.user.firstName} ${userData.user.lastName}` : "Individual"}
                  </h3>
                  
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full rounded mb-4" />
                      <Skeleton className="h-6 w-full rounded" />
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">
                        {donationType === "event" ? "Help us reach our goal!" : 
                         donationType === "team" ? teamData?.team.description : 
                         userData?.user.bio || "Thank you for your support!"}
                      </p>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center mb-1">
                          <Heart className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium text-gray-900">Fundraising Progress</span>
                        </div>
                        
                        <div className="text-2xl font-bold text-primary mb-1">
                          {donationType === "event" && eventData?.settings 
                            ? formatCurrency(eventData.settings.raisedAmount)
                            : donationType === "team" && teamData?.team
                            ? formatCurrency(teamData.team.raisedAmount)
                            : donationType === "individual" && userData?.user
                            ? formatCurrency(userData.user.raisedAmount)
                            : "$0"}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          of {donationType === "event" && eventData?.settings 
                              ? formatCurrency(eventData.settings.goalAmount)
                              : donationType === "team" && teamData?.team
                              ? formatCurrency(teamData.team.goalAmount)
                              : donationType === "individual" && userData?.user
                              ? formatCurrency(userData.user.goalAmount)
                              : "$0"} goal
                        </div>
                        
                        <Thermometer
                          current={
                            donationType === "event" && eventData?.settings 
                              ? eventData.settings.raisedAmount
                              : donationType === "team" && teamData?.team
                              ? teamData.team.raisedAmount
                              : donationType === "individual" && userData?.user
                              ? userData.user.raisedAmount
                              : 0
                          }
                          goal={
                            donationType === "event" && eventData?.settings 
                              ? eventData.settings.goalAmount
                              : donationType === "team" && teamData?.team
                              ? teamData.team.goalAmount
                              : donationType === "individual" && userData?.user
                              ? userData.user.goalAmount
                              : 100
                          }
                          height="h-3"
                          animate={false}
                        />
                      </div>
                      
                      {(donationType === "team" || donationType === "event") && (
                        <Button variant="outline" className="w-full" disabled>
                          View {donationType === "team" ? "Team" : "Event"} Page
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-7 lg:col-span-8">
              {/* Only show tabs when no specific team or user is in the URL */}
              {!teamId && !userId && (
                <Tabs value={donationType} onValueChange={handleTabChange} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="event">Donate to Event</TabsTrigger>
                    <TabsTrigger value="team">Donate to a Team</TabsTrigger>
                    <TabsTrigger value="individual">Donate to an Individual</TabsTrigger>
                  </TabsList>
                  
                  {/* Search bar for teams and individuals */}
                  {(donationType === "team" || donationType === "individual") && (
                    <div className="mt-4 relative">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          placeholder={`Search for a ${donationType === "team" ? "team" : "fundraiser"}...`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                      </div>
                      
                      {donationType === "team" && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center gap-3">
                            <img src="/images/team-image.jpeg" alt="Team Sunshine" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">Team Sunshine</div>
                              <div className="text-xs text-gray-500">$12,450 raised</div>
                            </div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center gap-3">
                            <img src="/images/team-image.jpeg" alt="Friendship Force" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">Friendship Force</div>
                              <div className="text-xs text-gray-500">$8,975 raised</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {donationType === "individual" && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center gap-3">
                            <img src="/images/default-avatar.png" alt="Rachel Stevens" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">Rachel Stevens</div>
                              <div className="text-xs text-gray-500">$3,245 raised</div>
                            </div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center gap-3">
                            <img src="/images/default-avatar.png" alt="Michael Johnson" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="font-medium">Michael Johnson</div>
                              <div className="text-xs text-gray-500">$2,750 raised</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Tabs>
              )}
              
              <Elements stripe={stripePromise}>
                <DonationForm 
                  teamId={donationType === "team" ? teamId || undefined : undefined}
                  userId={donationType === "individual" ? userId || undefined : undefined}
                />
              </Elements>
              
              <div className="mt-8 text-center text-sm text-gray-600">
                <p>Your donation is tax-deductible to the extent allowed by law.</p>
                <p>Friendship Circle of Michigan is a 501(c)(3) nonprofit organization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
