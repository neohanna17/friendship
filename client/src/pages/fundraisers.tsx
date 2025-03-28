
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy, TrendingUp, Users, Award, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { formatCurrency } from "@/lib/utils";

export default function Fundraisers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data, isLoading } = useQuery<{ fundraisers: any[] }>({
    queryKey: ['/api/fundraisers'],
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }
  
  const fundraisers = data?.fundraisers || [];
  
  const filteredFundraisers = fundraisers
    .filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || 
             user.username.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (activeTab === "top") {
        return b.raisedAmount - a.raisedAmount;
      }
      if (activeTab === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (activeTab === "badges") {
        return (b.badges?.length || 0) - (a.badges?.length || 0);
      }
      return b.raisedAmount - a.raisedAmount;
    });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Our Amazing Fundraisers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the incredible individuals who are making a difference in our community. Join them by creating your own fundraising page.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fundraisers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Users className="h-4 w-4" /> All
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" /> Top
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Recent
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-1">
                <Award className="h-4 w-4" /> Badges
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            onClick={() => setLocation("/register")}
            className="hidden md:flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Become a Fundraiser
          </Button>
        </div>
      </div>
      
      {filteredFundraisers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFundraisers.map(fundraiser => (
            <Card 
              key={fundraiser.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setLocation(`/fundraisers/${fundraiser.id}`)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                <ImageWithFallback
                  src={fundraiser.profileImage}
                  fallback="/images/default-avatar.png"
                  alt={`${fundraiser.firstName} ${fundraiser.lastName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {fundraiser.firstName} {fundraiser.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Trophy className="h-4 w-4" />
                    {formatCurrency(fundraiser.raisedAmount)} raised
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    Goal: {formatCurrency(fundraiser.goalAmount)}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100)}%
                  </div>
                </div>
                
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ 
                      width: `${Math.min(100, Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100))}%` 
                    }}
                  />
                </div>
                
                {fundraiser.badges && fundraiser.badges.length > 0 && (
                  <div className="flex gap-1 mt-3">
                    {fundraiser.badges.slice(0, 3).map((badge: string, index: number) => (
                      <div 
                        key={index}
                        className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                        title={badge}
                      >
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                    ))}
                    {fundraiser.badges.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        +{fundraiser.badges.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-primary/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No fundraisers found. {searchTerm ? "Try a different search term." : "Be the first to start fundraising!"}
          </p>
        </div>
      )}
      
      <Button 
        onClick={() => setLocation("/register")}
        className="w-full mt-8 md:hidden"
      >
        <UserPlus className="h-4 w-4 mr-2" /> Become a Fundraiser
      </Button>
    </div>
  );
}
