import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TeamCard from "@/components/teams/team-card";

interface Team {
  id: number;
  name: string;
  captainId: number;
  goalAmount: number;
  raisedAmount: number;
  teamImage: string;
  description: string;
}

const TopTeamsSection = () => {
  const { data, isLoading } = useQuery<{ teams: Team[] }>({
    queryKey: ['/api/teams/top'],
  });
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Top Fundraising Teams
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            These amazing teams are leading the way! Join them or start your own team today.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.teams.map((team, index) => (
              <TeamCard 
                key={team.id}
                team={team}
                rank={index + 1}
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/teams">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full">
              View All Teams
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" className="ml-4 rounded-full">
              Create Your Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopTeamsSection;
