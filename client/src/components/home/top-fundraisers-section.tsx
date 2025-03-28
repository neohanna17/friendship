import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Heart, Medal, Star, ChevronRight, Trophy } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ImageWithFallback from "@/components/ui/image-with-fallback";

interface Fundraiser {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  raisedAmount: number;
  goalAmount: number;
}

interface TopDonor {
  id: number;
  name: string;
  amount: number;
  profileImage?: string;
  isAnonymous?: boolean;
}

const TopFundraisersSection = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("fundraisers");
  
  const { data: fundraisersData, isLoading: fundraisersLoading } = useQuery<{ fundraisers: Fundraiser[] }>({
    queryKey: ['/api/top-fundraisers'],
  });
  
  const { data: donorsData, isLoading: donorsLoading } = useQuery<{ donors: TopDonor[] }>({
    queryKey: ['/api/top-donors'],
  });
  
  const topFundraisers = fundraisersData?.fundraisers?.slice(0, 5) || [];
  const topDonors = donorsData?.donors?.slice(0, 5) || [];
  
  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
          </div>
          <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
        </div>
      ))}
    </div>
  );

  // Custom medal icon components
  const MedalIcon = ({ position }: { position: number }) => {
    if (position === 0) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    } else if (position === 1) {
      return <Medal className="h-5 w-5 text-slate-400" />;
    } else if (position === 2) {
      return <Medal className="h-5 w-5 text-amber-700" />;
    }
    return <Star className="h-5 w-5 text-primary" />;
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Our Top Supporters
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These incredible individuals are leading the way in our mission to bring friendship and support to those who need it most.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="fundraisers" className="flex-1">Top Fundraisers</TabsTrigger>
              <TabsTrigger value="donors" className="flex-1">Top Donors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fundraisers" className="mt-6">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  {fundraisersLoading ? (
                    renderSkeleton()
                  ) : topFundraisers.length > 0 ? (
                    <div className="space-y-5">
                      {topFundraisers.map((fundraiser, index) => (
                        <div 
                          key={fundraiser.id}
                          className="flex items-center gap-4 cursor-pointer hover:bg-muted/20 p-2 rounded-lg transition-colors"
                          onClick={() => setLocation(`/fundraisers/${fundraiser.id}`)}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-primary">
                            <MedalIcon position={index} />
                          </div>
                          
                          <div className="w-14 h-14 rounded-full overflow-hidden">
                            <ImageWithFallback
                              src={fundraiser.profileImage}
                              fallback="/images/default-avatar.png"
                              alt={`${fundraiser.firstName} ${fundraiser.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {fundraiser.firstName} {fundraiser.lastName}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100)}% of goal reached
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {formatCurrency(fundraiser.raisedAmount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              raised
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 text-primary/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No fundraisers yet. Be the first to start fundraising!
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full group"
                      onClick={() => setLocation("/fundraisers")}
                    >
                      View All Fundraisers
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="donors" className="mt-6">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  {donorsLoading ? (
                    renderSkeleton()
                  ) : topDonors.length > 0 ? (
                    <div className="space-y-5">
                      {topDonors.map((donor, index) => (
                        <div key={donor.id} className="flex items-center gap-4 p-2 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-500">
                            <MedalIcon position={index} />
                          </div>
                          
                          {donor.isAnonymous ? (
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                              <Heart className="h-6 w-6 text-muted-foreground" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full overflow-hidden">
                              <ImageWithFallback
                                src={donor.profileImage || ""}
                                fallback="/images/default-avatar.png"
                                alt={donor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {donor.isAnonymous ? "Anonymous Donor" : donor.name}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              <Heart className="h-3 w-3 inline mr-1 text-pink-500" /> 
                              Generous Supporter
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-pink-500">
                              {formatCurrency(donor.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              donated
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-pink-500/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No donations yet. Be the first to donate!
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full group"
                      onClick={() => setLocation("/donate")}
                    >
                      Make a Donation
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TopFundraisersSection;