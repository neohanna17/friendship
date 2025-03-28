import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Thermometer from "@/components/fundraising/thermometer";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Edit, Plus, UserPlus, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  bio: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  captainId: number;
  goalAmount: number;
  raisedAmount: number;
  teamImage: string;
}

interface TeamWithRole extends Team {
  isCaption: boolean;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message: string;
  isAnonymous: boolean;
  teamId: number | null;
  userId: number | null;
  createdAt: string;
}

interface DashboardData {
  user: User;
  userTeams: {
    team: Team;
  }[];
  captainTeams: Team[];
  donations: Donation[];
  fundraisingStats: {
    individualRaised: number;
    individualGoal: number;
    totalDonations: number;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/auth/dashboard'],
    retry: 1,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-6">
                Please sign in to access your dashboard.
              </p>
              <Link href="/register">
                <Button className="rounded-full">Sign In or Register</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const { user, userTeams, captainTeams, donations, fundraisingStats } = data;
  
  // Combine teams where user is a member and where user is a captain
  const allTeams: TeamWithRole[] = [
    ...captainTeams.map(team => ({ ...team, isCaption: true })),
    ...userTeams.map(({ team }) => ({ ...team, isCaption: false }))
  ];
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle copy fundraising URL to clipboard
  const handleCopyLink = (id: number, type: 'user' | 'team') => {
    const baseUrl = window.location.origin;
    const url = type === 'user' 
      ? `${baseUrl}/donate?user=${id}`
      : `${baseUrl}/donate?team=${id}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(`${type}-${id}`);
      setTimeout(() => setCopiedLink(null), 2000);
      toast({
        title: "Link Copied!",
        description: "Share this link with friends and family to raise funds."
      });
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              Track your fundraising progress, manage your teams, and share your campaign with others.
            </p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Your Fundraising</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatCurrency(fundraisingStats.individualRaised)}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  of {formatCurrency(fundraisingStats.individualGoal)} personal goal
                </div>
                <Thermometer
                  current={fundraisingStats.individualRaised}
                  goal={fundraisingStats.individualGoal}
                  height="h-3"
                  animate={false}
                />
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs gap-1"
                    onClick={() => handleCopyLink(user.id, 'user')}
                  >
                    {copiedLink === `user-${user.id}` ? (
                      <><Check className="h-3 w-3" /> Copied</>
                    ) : (
                      <><Share2 className="h-3 w-3" /> Share</>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">
                  {allTeams.length}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {captainTeams.length > 0 
                    ? `Captain of ${captainTeams.length} team${captainTeams.length > 1 ? 's' : ''}` 
                    : 'Not a captain of any team'}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTeams.slice(0, 3).map(team => (
                    <Link key={team.id} href={`/teams/${team.id}`}>
                      <div className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition rounded-full px-3 py-1 text-sm text-gray-800 cursor-pointer">
                        {team.name}
                        {team.isCaption && (
                          <span className="bg-secondary/20 text-secondary text-xs px-1 rounded">
                            Captain
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                  {allTeams.length > 3 && (
                    <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
                      +{allTeams.length - 3} more
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Link href="/teams">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <UserPlus className="h-3 w-3" /> Join Team
                    </Button>
                  </Link>
                  <Link href="/register?type=team">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Plus className="h-3 w-3" /> Create Team
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">
                  {donations.length}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {fundraisingStats.totalDonations > 0 
                    ? `Total ${formatCurrency(fundraisingStats.totalDonations)} donated` 
                    : 'No donations received yet'}
                </div>
                
                <div className="mt-3">
                  {donations.length > 0 ? (
                    <div className="text-sm text-gray-700">
                      Latest: {donations[0].isAnonymous 
                        ? 'Anonymous' 
                        : donations[0].donorName} ({formatCurrency(donations[0].amount)})
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Share your fundraising page to get donations
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link href="/donate">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      View All Donations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main dashboard content */}
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="teams">My Teams</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teams">
              {allTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allTeams.map((team) => (
                    <Card key={team.id} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary/80 h-24 relative">
                        {team.teamImage && (
                          <img
                            src={team.teamImage}
                            alt={team.name}
                            className="w-full h-full object-cover opacity-30"
                          />
                        )}
                        <div className="absolute inset-0 p-4 flex flex-col justify-center">
                          <h3 className="font-heading font-bold text-white text-xl">
                            {team.name}
                          </h3>
                          {team.isCaption && (
                            <span className="inline-block bg-white/20 text-white text-xs rounded px-2 py-0.5 mt-1 w-fit">
                              Team Captain
                            </span>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 text-sm">Team Progress:</span>
                          <span className="text-gray-900 font-bold">
                            {formatCurrency(team.raisedAmount)} of {formatCurrency(team.goalAmount)}
                          </span>
                        </div>
                        <Thermometer
                          current={team.raisedAmount}
                          goal={team.goalAmount}
                          height="h-2"
                          animate={false}
                        />
                        <div className="flex justify-between mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs gap-1"
                            onClick={() => handleCopyLink(team.id, 'team')}
                          >
                            {copiedLink === `team-${team.id}` ? (
                              <><Check className="h-3 w-3" /> Copied</>
                            ) : (
                              <><Copy className="h-3 w-3" /> Copy Link</>
                            )}
                          </Button>
                          <Link href={`/teams/${team.id}`}>
                            <Button size="sm" className="text-xs">View Team</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-8 text-center">
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                      You haven't joined any teams yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Join an existing team or create your own to start fundraising together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/teams">
                        <Button variant="outline" className="gap-2 rounded-full">
                          <UserPlus className="h-4 w-4" /> Join a Team
                        </Button>
                      </Link>
                      <Link href="/register?type=team">
                        <Button className="gap-2 rounded-full">
                          <Plus className="h-4 w-4" /> Create a Team
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="donations">
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <Card key={donation.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {donation.isAnonymous ? "Anonymous Donor" : donation.donorName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(donation.createdAt)}
                            </p>
                            {donation.message && (
                              <p className="mt-2 text-gray-700 italic">"{donation.message}"</p>
                            )}
                          </div>
                          <div className="text-xl font-bold text-primary">
                            {formatCurrency(donation.amount)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-8 text-center">
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                      No donations yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Share your fundraising page with friends and family to start receiving donations.
                    </p>
                    <Button 
                      onClick={() => handleCopyLink(user.id, 'user')}
                      className="gap-2 rounded-full"
                    >
                      <Share2 className="h-4 w-4" /> Share Your Page
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-4xl">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="font-heading font-bold text-xl text-center text-gray-900 mb-1">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600 text-center mb-4">{user.email}</p>
                      <Button variant="outline" size="sm" className="gap-1 w-full">
                        <Edit className="h-4 w-4" /> Edit Profile
                      </Button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Your Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Username</h4>
                          <p className="text-gray-900">{user.username}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                          <p className="text-gray-900">{user.bio || "No bio provided yet."}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Fundraising Goal</h4>
                          <p className="text-gray-900">{formatCurrency(fundraisingStats.individualGoal)}</p>
                        </div>
                        
                        <div className="pt-4">
                          <Button>Edit Fundraising Page</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
