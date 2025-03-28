import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Thermometer from "@/components/fundraising/thermometer";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UsersRound, Award, CalendarDays, Heart } from "lucide-react";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
}

interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  isActive: boolean;
  joinedAt: string;
  user: User;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
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

interface TeamProfileData {
  team: Team;
  members: TeamMember[];
  donations: Donation[];
}

const TeamProfile = () => {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id);
  const { toast } = useToast();
  
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  
  const { data: authData } = useQuery<{ user: User | null }>({
    queryKey: ['/api/auth/user'],
    retry: false,
    onError: () => {}
  });
  
  const { data, isLoading, error } = useQuery<TeamProfileData>({
    queryKey: ['/api/teams', teamId],
    enabled: !isNaN(teamId)
  });
  
  const handleJoinTeam = async () => {
    if (!authData?.user) {
      toast({
        title: "Login Required",
        description: "Please sign in or register to join this team.",
        variant: "destructive"
      });
      return;
    }
    
    setIsJoiningTeam(true);
    
    try {
      await apiRequest("POST", `/api/teams/${teamId}/join`, {});
      
      toast({
        title: "Team Joined",
        description: `You've successfully joined ${data?.team.name}!`,
      });
      
      // Refresh team data
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId] });
    } catch (error) {
      toast({
        title: "Error Joining Team",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsJoiningTeam(false);
    }
  };
  
  // Check if current user is already a member of this team
  const isUserMember = data?.members.some(member => 
    member.userId === authData?.user?.id
  );
  
  // Check if current user is the captain
  const isUserCaptain = data?.team.captainId === authData?.user?.id;
  
  if (isLoading) {
    return (
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-40 w-full mb-8 rounded-lg" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-24 w-full mb-8" />
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h1>
              <p className="text-gray-600 mb-6">
                The team you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/teams">
                <Button className="rounded-full">Browse All Teams</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const { team, members, donations } = data;
  const captain = members.find(member => member.userId === team.captainId)?.user;
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Team Hero Section */}
          <Card className="mb-8 overflow-hidden border-none shadow-md">
            <div className="relative h-40 bg-gradient-to-r from-primary to-primary/80">
              {team.teamImage && (
                <img
                  src={team.teamImage}
                  alt={team.name}
                  className="w-full h-full object-cover opacity-20"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
                  {team.name}
                </h1>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600 text-sm">Created: {formatDate(team.createdAt)}</span>
                  </div>
                  
                  {captain && (
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={captain.profileImage} alt={`${captain.firstName} ${captain.lastName}`} />
                        <AvatarFallback>{captain.firstName.charAt(0)}{captain.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-gray-600 text-sm">Team Captain:</span>
                        <span className="ml-1 font-medium">{captain.firstName} {captain.lastName}</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-6">{team.description || "Join our team as we walk to raise funds for Friendship Circle's programs supporting individuals with special needs."}</p>
                  
                  {!isUserMember && !isUserCaptain && (
                    <Button
                      onClick={handleJoinTeam}
                      disabled={isJoiningTeam}
                      className="rounded-full"
                    >
                      {isJoiningTeam ? "Joining..." : "Join This Team"}
                    </Button>
                  )}
                  
                  {isUserMember && !isUserCaptain && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">
                      You're a member of this team! Visit your dashboard to manage your fundraising.
                    </div>
                  )}
                  
                  {isUserCaptain && (
                    <Link href="/dashboard">
                      <Button variant="secondary" className="rounded-full">
                        Manage Your Team
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="w-full md:w-1/3 bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="font-heading font-bold text-xl mb-2 text-gray-900">Team Progress</h3>
                  <div className="text-3xl font-bold text-primary mb-1">{formatCurrency(team.raisedAmount)}</div>
                  <div className="text-gray-600 text-sm mb-3">raised of {formatCurrency(team.goalAmount)} goal</div>
                  
                  <Thermometer
                    current={team.raisedAmount}
                    goal={team.goalAmount}
                    height="h-4"
                    animate={false}
                  />
                  
                  <div className="mt-4">
                    <Link href={`/donate?team=${team.id}`}>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 rounded-full">
                        Donate to Team
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Team Details Tabs */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                <span>Team Members ({members.length})</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Donations ({donations.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.profileImage} alt={`${member.user.firstName} ${member.user.lastName}`} />
                          <AvatarFallback>{member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {member.user.firstName} {member.user.lastName}
                            {member.userId === team.captainId && (
                              <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                                Captain
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Joined {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {members.length === 0 && (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">No members have joined this team yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="donations" className="mt-6">
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
                
                {donations.length === 0 && (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-600">No donations have been made to this team yet.</p>
                      <Link href={`/donate?team=${team.id}`}>
                        <Button variant="secondary" className="mt-4 rounded-full">
                          Be the First to Donate
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
