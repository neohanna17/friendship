import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationForm from "@/components/registration/registration-form";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Register = () => {
  const [location] = useLocation();
  const registrationType = new URLSearchParams(location.search).get("type") || "individual";
  const [activeTab, setActiveTab] = useState<string>(registrationType);

  // Check if user is already logged in
  const { data, isLoading } = useQuery<{ user: User | null }>({
    queryKey: ['/api/auth/user'],
    retry: false,
    onError: () => {}
  });

  // Update tab when URL parameter changes
  useEffect(() => {
    setActiveTab(registrationType);
  }, [registrationType]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.set("type", value);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Register for Walk for Friendship 2025
            </h1>
            <p className="text-gray-600 text-lg">
              Join us on Sunday, August 30, 2025 for a day of fun, friendship, and fundraising!
            </p>
          </div>

          {data?.user ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="font-heading font-bold text-xl mb-4">
                    Welcome back, {data.user.firstName}!
                  </h2>
                  <p className="mb-6">You're already registered. Would you like to:</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button className="rounded-full" variant="default" asChild>
                      <a href="/dashboard">View Your Dashboard</a>
                    </Button>
                    <Button className="rounded-full" variant="secondary" asChild>
                      <a href="/teams">Join a Team</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="individual" className="text-base py-3">
                  Individual Registration
                </TabsTrigger>
                <TabsTrigger value="team" className="text-base py-3">
                  Team Registration
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual">
                <RegistrationForm type="individual" />
              </TabsContent>
              
              <TabsContent value="team">
                <RegistrationForm type="team" />
              </TabsContent>
            </Tabs>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-heading font-bold text-lg mb-3 text-gray-900">
              Why Register?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Support Friendship Circle's programs for individuals with special needs</li>
              <li>Connect with a community of like-minded individuals</li>
              <li>Create lasting memories at our event on August 30, 2025</li>
              <li>Receive a Walk for Friendship t-shirt and swag bag</li>
              <li>Help us reach our fundraising goal of $250,000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
