import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamCard from "@/components/teams/team-card";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: number;
  name: string;
  captainId: number;
  goalAmount: number;
  raisedAmount: number;
  teamImage: string;
  description: string;
}

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"raised" | "alphabetical">("raised");
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery<{ teams: Team[] }>({
    queryKey: ['/api/teams'],
  });
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  useEffect(() => {
    console.log("Teams data:", data);
  }, [data]);
  
  // Filter and sort teams based on search query and sort option
  const filteredTeams = data?.teams?.filter(team => 
    team?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === "raised") {
      return b.raisedAmount - a.raisedAmount;
    }
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Walk for Friendship Teams
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Browse all teams, search for a specific team, or create your own to start fundraising for Friendship Circle.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search teams..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Tabs defaultValue="raised" className="w-full md:w-auto" onValueChange={(value) => setSortBy(value as "raised" | "alphabetical")}>
              <TabsList>
                <TabsTrigger value="raised">Sort by Amount Raised</TabsTrigger>
                <TabsTrigger value="alphabetical">Sort Alphabetically</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Link href="/register?type=team">
              <Button variant="secondary" className="rounded-full whitespace-nowrap">
                Create Team
              </Button>
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-full mb-4" />
                  <Skeleton className="h-10 w-full rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedTeams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <Card className="w-full py-12">
            <CardContent className="flex flex-col items-center justify-center">
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">
                No teams found
              </h3>
              {searchQuery ? (
                <p className="text-gray-600 mb-4 text-center">
                  We couldn't find any teams matching "{searchQuery}".
                  <br />Try a different search or create your own team.
                </p>
              ) : (
                <p className="text-gray-600 mb-4 text-center">
                  Be the first to create a team for Walk for Friendship 2025!
                </p>
              )}
              <Link href="/register?type=team">
                <Button variant="secondary" className="rounded-full">
                  Create a Team
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Teams;
