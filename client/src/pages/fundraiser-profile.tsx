import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, Users, Calendar, Award, ArrowLeft, Edit 
} from "lucide-react";
import DonationForm from "@/components/fundraising/donation-form";
import Thermometer from "@/components/fundraising/thermometer";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import GalleryCarousel from "@/components/ui/gallery-carousel";
import { formatCurrency } from "@/lib/utils";
import BadgeDisplay from "@/components/fundraising/badge-display";
import DonationList from "@/components/fundraising/donation-list";

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface FundraiserProfileData {
  user: User & {
    goalAmount: number;
    raisedAmount: number;
    badges: string[];
    createdAt: string;
  };
  donations: Donation[];
  teams: {
    id: number;
    name: string;
    teamImage: string;
  }[];
}

export default function FundraiserProfile() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  
  // Check if user is logged in
  const { data: authData } = useQuery({ 
    queryKey: ['/api/auth/user'],
    retry: false,
    gcTime: 0
  });
  
  // Fetch fundraiser data
  const { data, isLoading, isError } = useQuery<{ data: FundraiserProfileData }>({
    queryKey: [`/api/fundraisers/${id}`],
    enabled: !!id,
  });

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-2xl font-bold mb-4">Fundraiser Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the fundraiser you're looking for.</p>
          <Button onClick={() => setLocation("/fundraisers")}>
            View All Fundraisers
          </Button>
        </div>
      </div>
    );
  }

  const { user, donations, teams } = data.data;
  const isOwner = authData?.user?.id === user.id;
  
  // Calculate days fundraising
  const daysFundraising = Math.ceil(
    (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => setLocation("/fundraisers")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fundraisers
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Fundraiser info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-white">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-32 flex items-center px-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {user.firstName} {user.lastName}'s Fundraiser
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row p-6 gap-6">
              <div className="sm:w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary">
                  <ImageWithFallback 
                    src={user.profileImage} 
                    alt={`${user.firstName} ${user.lastName}`} 
                    fallback="/images/default-avatar.png"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 w-full">
                  <Thermometer 
                    current={user.raisedAmount} 
                    goal={user.goalAmount}
                    height="160px"
                    animate={true}
                    delay={500}
                  />
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(user.raisedAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      raised of {formatCurrency(user.goalAmount)} goal
                    </div>
                  </div>
                </div>
                
                {isOwner && (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Fundraiser
                  </Button>
                )}
              </div>

              <div className="sm:w-2/3">
                <h2 className="text-xl font-semibold mb-3">{user.firstName}'s Story</h2>
                <p className="text-muted-foreground mb-4">
                  {user.bio || "Help me support Walk for Friendship! Your donation makes a meaningful difference in our community, bringing joy and friendship to the lives of children with special needs."}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="bg-purple-50 border-none">
                    <CardContent className="p-4 flex items-center">
                      <Heart className="h-6 w-6 text-primary mr-2" />
                      <div>
                        <div className="text-lg font-bold">{donations.length}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-pink-50 border-none">
                    <CardContent className="p-4 flex items-center">
                      <Users className="h-6 w-6 text-pink-500 mr-2" />
                      <div>
                        <div className="text-lg font-bold">{teams.length}</div>
                        <div className="text-xs text-muted-foreground">Teams</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-none">
                    <CardContent className="p-4 flex items-center">
                      <Calendar className="h-6 w-6 text-primary mr-2" />
                      <div>
                        <div className="text-lg font-bold">{daysFundraising}</div>
                        <div className="text-xs text-muted-foreground">Days Fundraising</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-pink-50 border-none">
                    <CardContent className="p-4 flex items-center">
                      <Award className="h-6 w-6 text-pink-500 mr-2" />
                      <div>
                        <div className="text-lg font-bold">{user.badges?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Badges Earned</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="donations" className="flex-1">Donations</TabsTrigger>
              <TabsTrigger value="teams" className="flex-1">Teams</TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {user.firstName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {user.bio || `${user.firstName} is raising funds to support Walk for Friendship, helping to create meaningful connections for children with special needs.`}
                  </p>
                  
                  <h3 className="font-semibold text-lg mb-3">Fundraising Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-muted-foreground text-sm">Total Raised</div>
                      <div className="text-xl font-bold text-primary">{formatCurrency(user.raisedAmount)}</div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <div className="text-muted-foreground text-sm">Goal</div>
                      <div className="text-xl font-bold text-pink-500">{formatCurrency(user.goalAmount)}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-muted-foreground text-sm">Days Fundraising</div>
                      <div className="text-xl font-bold text-primary">{daysFundraising}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="donations" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonationList donations={donations} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teams" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{user.firstName}'s Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  {teams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {teams.map(team => (
                        <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="h-40 overflow-hidden">
                            <ImageWithFallback 
                              src={team.teamImage}
                              fallback="/images/team-default.jpg"
                              alt={team.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold truncate">{team.name}</h3>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => setLocation(`/teams/${team.id}`)}
                            >
                              View Team
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-4">{user.firstName} hasn't joined any teams yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                  <CardDescription>Badges earned through fundraising milestones and participation</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.badges && user.badges.length > 0 ? (
                    <BadgeDisplay badges={user.badges} />
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-4">No badges earned yet.</p>
                      <p className="text-sm">Badges are earned by reaching fundraising milestones and participating in the event.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Donation form and recent activity */}
        <div className="space-y-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-2">
              <CardTitle>Support {user.firstName}</CardTitle>
              <CardDescription>Your donation makes a difference!</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationForm userId={user.id} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Latest Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.slice(0, 5).map(donation => (
                  <div key={donation.id} className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {donation.isAnonymous ? "Anonymous" : donation.donorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Donated {formatCurrency(donation.amount)}
                      </p>
                      {donation.message && (
                        <p className="text-sm italic mt-1">"{donation.message}"</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {donations.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}