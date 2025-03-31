import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { createConfetti } from "@/lib/confetti";
import { Award } from "lucide-react";

interface Team {
  id: number;
  name: string;
  captainId: number;
  goalAmount: number;
  raisedAmount: number;
  teamImage: string;
  description: string;
}

interface TeamCardProps {
  team: Team;
  rank?: number;
}

const TeamCard = ({ team, rank }: TeamCardProps) => {
  const progress = calculateProgress(team.raisedAmount, team.goalAmount);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  
  // Show confetti for teams with high progress when they first appear
  useEffect(() => {
    if (!hasShownConfetti && cardRef.current && progress >= 80) {
      // Use a small timeout to ensure the element is fully rendered
      const timer = setTimeout(() => {
        // Get the position of the card
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
          // Create confetti starting from the card's position
          createConfetti(3000, 15);
          setHasShownConfetti(true);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progress, hasShownConfetti]);
  
  return (
    <Card ref={cardRef} className="team-card overflow-hidden border border-gray-100 shadow-md">
      <div className="relative">
        {team.teamImage ? (
          <img
            src={team.teamImage}
            alt={team.name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-primary/10 flex items-center justify-center">
            <span className="font-heading font-bold text-xl text-primary">{team.name.charAt(0)}</span>
          </div>
        )}
        {progress >= 80 && (
          <div className="absolute top-3 left-3 bg-amber-100 text-amber-700 font-medium rounded-full px-3 py-1 flex items-center gap-1 animate-pulse-once">
            <Award size={14} className="fill-amber-500" />
            <span>Star Team</span>
          </div>
        )}
        {rank && (
          <div className="absolute top-3 right-3 bg-secondary text-white font-bold rounded-full h-10 w-10 flex items-center justify-center">
            {rank}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-heading font-bold text-lg text-gray-900 truncate">{team.name}</h3>
        <div className="flex justify-between items-center my-2">
          <span className="text-gray-600 text-sm">Captain: {/* This would be retrieved from team data */}</span>
          <span className="text-gray-900 font-bold">{formatCurrency(team.raisedAmount)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full thermometer-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatCurrency(team.raisedAmount)} raised</span>
          <span>{formatCurrency(team.goalAmount)} goal</span>
        </div>
        <Link href={`/teams/${team.id}`}>
          <Button className="w-full mt-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90">
            View Team
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
