import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { animateCounter, formatCurrency } from '@/lib/utils';
import DonationForm from '@/components/fundraising/donation-form';
import { getQueryFn } from '@/lib/queryClient';

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  raisedAmount: number;
  joinedAt: string | Date;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message: string | null;
  isAnonymous: boolean;
  createdAt: string | Date;
}

interface TeamData {
  id: number;
  name: string;
  description: string | null;
  goalAmount: number;
  raisedAmount: number;
  progress: number;
  teamImage: string | null;
  captainId: number | null;
  captainName: string;
  membersCount: number;
  members: TeamMember[];
  donations: Donation[];
  createdAt: string | Date;
}

export default function TeamProfile() {
  const [params] = useParams();
  const teamId = params?.id ? parseInt(params.id) : null;
  const raisedAmountRef = useRef<HTMLSpanElement>(null);
  const goalAmountRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  
  // Fetch team data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/teams', teamId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!teamId,
  });
  
  const team: TeamData | undefined = data?.team;
  
  // Handle animations when data loads
  useEffect(() => {
    if (team && raisedAmountRef.current && goalAmountRef.current && progressRef.current) {
      animateCounter(raisedAmountRef.current, team.raisedAmount, 2000, '$');
      animateCounter(goalAmountRef.current, team.goalAmount, 2000, '$');
      animateCounter(progressRef.current, team.progress, 2000, '', '%');
    }
  }, [team]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-primary"></div>
          <h2 className="text-2xl font-bold">Loading team information...</h2>
        </div>
      </div>
    );
  }
  
  if (error || !team) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold">Team not found</h2>
          <p className="text-muted-foreground">The team you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/teams">View All Teams</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      {/* Team Hero Section */}
      <div className="mb-8 rounded-lg bg-amber-50 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{team.name}</h1>
            <p className="mb-4 text-gray-600">{team.description || 'No description available'}</p>
            <p className="mb-2 text-gray-700">Captain: <span className="font-medium text-gray-900">{team.captainName}</span></p>
            <p className="mb-4 text-gray-700">Team Members: <span className="font-medium text-gray-900">{team.membersCount}</span></p>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <div><span ref={raisedAmountRef} className="text-xl font-bold">${team.raisedAmount}</span> raised of <span ref={goalAmountRef}>${team.goalAmount}</span> goal</div>
                <div><span ref={progressRef} className="font-medium">{team.progress}</span>%</div>
              </div>
              <Progress value={team.progress} className="h-2.5" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/donate?team=${team.id}`}>Donate to Team</Link>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
                <Link href={`/register?join=${team.id}`}>Join Team</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="overflow-hidden rounded-xl border-4 border-white shadow-md">
              {team.teamImage ? (
                <img 
                  src={team.teamImage} 
                  alt={team.name} 
                  className="h-48 w-48 object-cover" 
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center bg-primary/10">
                  <span className="text-lg font-bold text-primary">{team.name.substring(0, 3).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Content Tabs */}
      <Tabs defaultValue="members" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
          <TabsTrigger value="donate">Donate</TabsTrigger>
        </TabsList>
        
        {/* Members Tab */}
        <TabsContent value="members">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {team.members.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member.profileImage || undefined} />
                      <AvatarFallback>
                        {member.firstName.charAt(0) + member.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/fundraisers/${member.id}`}>
                        <CardTitle className="text-base hover:underline">
                          {member.firstName} {member.lastName}
                        </CardTitle>
                      </Link>
                      <CardDescription className="text-xs">
                        Member since {new Date(member.joinedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">
                    <span className="font-medium">{formatCurrency(member.raisedAmount)}</span> raised
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Donations Tab */}
        <TabsContent value="donations">
          {team.donations.length > 0 ? (
            <div className="space-y-4">
              {team.donations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">
                        {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                      </CardTitle>
                      <span className="text-lg font-bold">{formatCurrency(donation.amount)}</span>
                    </div>
                    <CardDescription>
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  {donation.message && (
                    <CardContent className="p-4 pt-0">
                      <p className="italic text-muted-foreground">"{donation.message}"</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold">No donations yet</h3>
              <p className="mb-4 text-muted-foreground">Be the first to support this team!</p>
              <Button asChild>
                <Link href={`/donate?team=${team.id}`}>Donate Now</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Donate Tab */}
        <TabsContent value="donate">
          <div className="mx-auto max-w-xl rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-bold">Support {team.name}</h2>
            <Separator className="mb-6" />
            <DonationForm entityType="team" entityId={team.id} defaultAmount={50} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Share and Join Team */}
      <div className="mb-8 rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Share this team page</h3>
            <p className="text-muted-foreground">Help {team.name} reach their fundraising goal!</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Copy Link
            </Button>
            <Button asChild>
              <Link href={`/register?join=${team.id}`}>Join Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}