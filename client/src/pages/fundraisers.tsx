import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, UserPlus, Award, TrendingUp, Users, Filter, Trophy
} from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import Thermometer from "@/components/fundraising/thermometer";
import { formatCurrency } from "@/lib/utils";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
  goalAmount: number;
  raisedAmount: number;
  bio: string;
  badges: string[];
}

export default function Fundraisers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data, isLoading } = useQuery<{ fundraisers: User[] }>({
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
  
  // Filter and sort based on active tab and search
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
        // Sort by most recent (assuming we'd have a createdAt field)
        return 0; // For now we'll keep it neutral
      }
      if (activeTab === "badges") {
        return (b.badges?.length || 0) - (a.badges?.length || 0);
      }
      return b.raisedAmount - a.raisedAmount; // Default sort by raised amount
    });
    
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Our Amazing Fundraisers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the incredible individuals who are making a difference. Support their efforts or join them by creating your own fundraiser.
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
          className="w-full md:w-auto gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          <UserPlus className="h-4 w-4" /> Become a Fundraiser
        </Button>
      </div>
      
      {filteredFundraisers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFundraisers.map(user => (
            <Card 
              key={user.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setLocation(`/fundraisers/${user.id}`)}
            >
              <div className="h-40 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                <div className="absolute bottom-4 left-4 z-20 flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                    <ImageWithFallback
                      src={user.profileImage}
                      fallback="/images/default-avatar.jpg"
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-2 text-white">
                    <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex items-center text-xs">
                        <Award className="h-3 w-3 mr-1 text-yellow-300" />
                        <span>{user.badges.length} badges</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500"></div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-4">
                  <Thermometer 
                    current={user.raisedAmount} 
                    goal={user.goalAmount}
                    height="60px"
                    animate={true}
                  />
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Raised</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(user.raisedAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="font-medium">
                      {formatCurrency(user.goalAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/donate?userId=${user.id}`);
                    }}
                  >
                    Support {user.firstName}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No fundraisers match your search.</p>
          <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}