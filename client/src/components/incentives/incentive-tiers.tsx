
import { Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface IncentiveItem {
  name: string;
}

interface IncentiveTier {
  amount: number;
  items: IncentiveItem[];
  description: string;
}

const tiers: IncentiveTier[] = [
  {
    amount: 1800,
    items: [
      { name: "Specialty FC Umbrella" },
      { name: "Power Walker Breakfast" },
      { name: "Program Discounts" },
    ],
    description: "By raising $1,800 or more you qualify for our first appreciation prize (a Specialty FC Umbrella), an invite to attend our Power Walker Breakfast at Soul Cafe, as well as discounts for our amazing programs!"
  },
  {
    amount: 3600,
    items: [
      { name: "FC Sweatshirt" },
      { name: "Specialty FC Umbrella" },
      { name: "Power Walker Breakfast" },
      { name: "VIP Parking" },
      { name: "Program Discounts" },
    ],
    description: "Individuals who raise $3,600 reach the level of Power Walker and qualify for our $1800 prizes, a Specialty FC Sweatshirt, and VIP Parking for our Power Walker Breakfast included!"
  },
  {
    amount: 5400,
    items: [
      { name: "FC Sponsored Event" },
      { name: "FC Sweatshirt" },
      { name: "Specialty FC Umbrella" },
      { name: "Power Walker Breakfast" },
      { name: "VIP Parking" },
      { name: "Program Discounts" },
    ],
    description: "Individuals who raise $5,400 or more will receive tickets to our FC Sponsored Event as well as all the perks of the $1,800 and $3,600 levels!"
  },
  {
    amount: 10000,
    items: [
      { name: "Seasonal Dakota Gift Basket" },
      { name: "2025 Gala Invitation" },
      { name: "Year of Free Car Washes" },
      { name: "FC Sponsored Event" },
      { name: "FC Sweatshirt" },
      { name: "Specialty FC Umbrella" },
      { name: "Power Walker Breakfast" },
      { name: "VIP Parking" },
      { name: "Program Discounts" },
    ],
    description: "Our highest tier of recognition! Receive all previous rewards plus exclusive access to our 2025 Gala and a year of free car washes!"
  }
];

export function IncentiveTiers() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier, index) => (
        <Card key={tier.amount} className="p-6 border-2 hover:border-primary transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 bg-primary/10 w-32 h-32 rounded-full" />
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h3 className="font-heading font-bold text-2xl text-primary">
              ${tier.amount.toLocaleString()}
            </h3>
          </div>
          <h4 className="font-medium text-lg mb-2">Power Walker Level {index + 1}</h4>
          <ul className="space-y-2 mb-6">
            {tier.items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
          <Link to="/register">
            <Button className="w-full bg-primary hover:bg-primary/90">Register Now</Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}
