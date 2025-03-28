import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Clock, Heart, Star, Trophy, Zap } from "lucide-react";

interface BadgeDisplayProps {
  badges: string[];
}

// Badge definitions with their icons and descriptions
const badgeConfig: Record<string, { 
  icon: React.ReactNode; 
  color: string; 
  title: string;
  description: string;
}> = {
  "community_hero": {
    icon: <Heart className="h-6 w-6" />,
    color: "text-pink-500",
    title: "Community Hero",
    description: "Raised over $1,000 to support the cause"
  },
  "early_bird": {
    icon: <Clock className="h-6 w-6" />,
    color: "text-purple-500",
    title: "Early Bird",
    description: "One of the first to register for the Walk"
  },
  "legend": {
    icon: <Trophy className="h-6 w-6" />,
    color: "text-amber-500",
    title: "Legend",
    description: "Participated in Walk for Friendship for 3+ years"
  },
  "walking_wonder": {
    icon: <Zap className="h-6 w-6" />,
    color: "text-cyan-500",
    title: "Walking Wonder",
    description: "Completed the full walk route"
  },
  "top_fundraiser": {
    icon: <Star className="h-6 w-6" />,
    color: "text-yellow-500",
    title: "Top Fundraiser",
    description: "Among the top 10 fundraisers"
  },
  "team_captain": {
    icon: <Award className="h-6 w-6" />,
    color: "text-indigo-500",
    title: "Team Captain",
    description: "Successfully led a fundraising team"
  }
};

const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => {
        const badgeInfo = badgeConfig[badge] || {
          icon: <Award className="h-6 w-6" />,
          color: "text-primary",
          title: badge.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: "Achievement unlocked!"
        };
        
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="border-2 hover:border-primary transition-colors">
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <div className={`rounded-full bg-purple-100 p-3 mb-2 ${badgeInfo.color}`}>
                      {badgeInfo.icon}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm truncate max-w-full">
                        {badgeInfo.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-bold">{badgeInfo.title}</p>
                  <p className="text-sm">{badgeInfo.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;