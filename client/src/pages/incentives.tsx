import { motion } from "framer-motion";
import { BadgeCheck, Gift, Car, Coffee, Umbrella, Ticket, MapPin } from "lucide-react";

const tiers = [
  {
    level: "$1,800",
    name: "Bronze Power Walker",
    color: "bg-sky-100",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    rewards: [
      { icon: Umbrella, name: "Specialty FC Umbrella" },
      { icon: Coffee, name: "Power Walker Breakfast" },
      { icon: BadgeCheck, name: "Program Discounts" }
    ]
  },
  {
    level: "$3,600",
    name: "Silver Power Walker",
    color: "bg-lime-100",
    textColor: "text-lime-700",
    borderColor: "border-lime-200",
    rewards: [
      { icon: Umbrella, name: "Specialty FC Umbrella" },
      { icon: Coffee, name: "Power Walker Breakfast" },
      { icon: BadgeCheck, name: "Program Discounts" },
      { icon: MapPin, name: "VIP Parking" },
      { icon: Gift, name: "FC Sweatshirt" }
    ]
  },
  {
    level: "$5,400",
    name: "Gold Power Walker",
    color: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    rewards: [
      { icon: Umbrella, name: "Specialty FC Umbrella" },
      { icon: Coffee, name: "Power Walker Breakfast" },
      { icon: BadgeCheck, name: "Program Discounts" },
      { icon: MapPin, name: "VIP Parking" },
      { icon: Gift, name: "FC Sweatshirt" },
      { icon: Ticket, name: "FC Sponsored Event" }
    ]
  },
  {
    level: "$10,000",
    name: "Diamond Power Walker",
    color: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    rewards: [
      { icon: Umbrella, name: "Specialty FC Umbrella" },
      { icon: Coffee, name: "Power Walker Breakfast" },
      { icon: BadgeCheck, name: "Program Discounts" },
      { icon: MapPin, name: "VIP Parking" },
      { icon: Gift, name: "FC Sweatshirt" },
      { icon: Ticket, name: "FC Sponsored Event" },
      { icon: Gift, name: "Seasonal Dakota Gift Basket" },
      { icon: Ticket, name: "2025 Gala Invitation" },
      { icon: Car, name: "Year of Free Car Washes" }
    ]
  }
];

export default function IncentivesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">
            Power Walker Rewards
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Your fundraising help is crucial to the success of Friendship Circle as well as the maintenance 
            and development of our programs. We would like to show our appreciation for your support for 
            Walk4Friendship 2024.
          </p>
        </div>

        <div className="grid gap-8 mt-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${tier.color} rounded-xl p-6 border ${tier.borderColor} shadow-lg`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className={`text-3xl font-bold ${tier.textColor} mb-2`}>
                    {tier.level} {tier.name}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  {tier.rewards.map((reward, rewardIndex) => (
                    <motion.div
                      key={reward.name}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + rewardIndex * 0.1 }}
                      className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm"
                    >
                      <reward.icon className={`h-6 w-6 ${tier.textColor} mb-2`} />
                      <span className="text-sm text-gray-600 text-center">
                        {reward.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Start fundraising today and unlock these amazing rewards!
          </p>
        </div>
      </div>
    </div>
  );
}