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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string | null;
  bio: string | null;
  goalAmount: number;
  raisedAmount: number;
  progress: number;
  badges: string[];
  createdAt: string | Date;
}

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  message: string | null;
  isAnonymous: boolean;
  createdAt: string | Date;
}

interface Team {
  id: number;
  name: string;
  teamImage: string | null;
}

interface FundraiserData {
  user: User;
  donations: Donation[];
  teams: Team[];
}

export default function FundraiserProfile() {
  const [params] = useParams();
  const fundraiserId = params?.id ? parseInt(params.id) : null;
  
  const raisedAmountRef = useRef<HTMLSpanElement>(null);
  const goalAmountRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  
  // Fetch fundraiser data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/fundraisers', fundraiserId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!fundraiserId,
  });
  
  const fundraiser: FundraiserData | undefined = data?.data;
  
  // Handle animations when data loads
  useEffect(() => {
    if (fundraiser && raisedAmountRef.current && goalAmountRef.current && progressRef.current) {
      animateCounter(raisedAmountRef.current, fundraiser.user.raisedAmount, 2000, '$');
      animateCounter(goalAmountRef.current, fundraiser.user.goalAmount, 2000, '$');
      animateCounter(progressRef.current, fundraiser.user.progress, 2000, '', '%');
    }
  }, [fundraiser]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-primary"></div>
          <h2 className="text-2xl font-bold">Loading fundraiser information...</h2>
        </div>
      </div>
    );
  }
  
  if (error || !fundraiser) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold">Fundraiser not found</h2>
          <p className="text-muted-foreground">The fundraiser you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/fundraisers">View All Fundraisers</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const { user, donations, teams } = fundraiser;
  
  return (
    <div className="container mx-auto py-8">
      {/* Fundraiser Hero Section */}
      <div className="mb-8 rounded-lg bg-muted/50 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{user.firstName} {user.lastName}</h1>
            <p className="mb-4 text-muted-foreground">{user.bio || 'No bio available'}</p>
            
            <div className="mb-4 flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="capitalize">{badge}</Badge>
              ))}
            </div>
            
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <div><span ref={raisedAmountRef} className="text-xl font-bold">${user.raisedAmount}</span> raised of <span ref={goalAmountRef}>${user.goalAmount}</span> goal</div>
                <div><span ref={progressRef} className="font-medium">{user.progress}</span>%</div>
              </div>
              <Progress value={user.progress} className="h-2.5" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/donate?user=${user.id}`}>Donate to {user.firstName}</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Avatar className="h-40 w-40">
              <AvatarImage src={user.profileImage || undefined} />
              <AvatarFallback className="text-4xl">
                {user.firstName.charAt(0) + user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      {/* Fundraiser Content Tabs */}
      <Tabs defaultValue="teams" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
          <TabsTrigger value="donate">Donate</TabsTrigger>
        </TabsList>
        
        {/* Teams Tab */}
        <TabsContent value="teams">
          {teams.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded">
                        {team.teamImage ? (
                          <img src={team.teamImage} alt={team.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-xs font-medium text-muted-foreground">{team.name.substring(0, 3).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/teams/${team.id}`}>
                          <CardTitle className="text-base hover:underline">{team.name}</CardTitle>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold">Not a member of any team</h3>
              <p className="mb-4 text-muted-foreground">{user.firstName} hasn't joined any teams yet.</p>
              <Button asChild>
                <Link href="/teams">View Teams</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Donations Tab */}
        <TabsContent value="donations">
          {donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => (
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
              <p className="mb-4 text-muted-foreground">Be the first to support {user.firstName}!</p>
              <Button asChild>
                <Link href={`/donate?user=${user.id}`}>Donate Now</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Donate Tab */}
        <TabsContent value="donate">
          <div className="mx-auto max-w-xl rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-bold">Support {user.firstName} {user.lastName}</h2>
            <Separator className="mb-6" />
            <DonationForm entityType="user" entityId={user.id} defaultAmount={50} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Share Section */}
      <div className="mb-8 rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Share this fundraiser page</h3>
            <p className="text-muted-foreground">Help {user.firstName} reach their fundraising goal!</p>
          </div>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}