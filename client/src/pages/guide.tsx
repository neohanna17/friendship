
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const guides = [
  {
    title: "RULE #1 OF FUNDRAISING",
    description: "Start with your story - it's your superpower! Share why Friendship Circle means so much to you.",
    color: "bg-primary",
    textColor: "text-white",
    icon: "🌟"
  },
  {
    title: "GETTING STARTED",
    description: "Set up your fundraising page, personalize it, and make it shine with photos and your mission.",
    color: "bg-secondary",
    textColor: "text-white",
    icon: "🚀"
  },
  {
    title: "CREATIVE IDEAS",
    description: "From virtual challenges to local events, discover unique ways to reach your fundraising goals.",
    color: "bg-purple-500",
    textColor: "text-white",
    icon: "💡"
  },
  {
    title: "MATCHING GIFTS",
    description: "Double your impact! Learn how to leverage workplace matching programs.",
    color: "bg-accent",
    textColor: "text-white",
    icon: "🎁"
  },
  {
    title: "PROVEN METHODS",
    description: "Time-tested strategies that work, from email campaigns to social media outreach.",
    color: "bg-primary",
    textColor: "text-white",
    icon: "📈"
  },
  {
    title: "FUNDRAISING INCENTIVES",
    description: "Exciting rewards and recognition for reaching your fundraising milestones!",
    color: "bg-secondary",
    textColor: "text-white",
    icon: "🏆"
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-5xl text-gray-900 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            WALK4FRIENDSHIP
          </h1>
          <h2 className="font-heading text-3xl text-secondary mb-4">
            FUNDRAISING TOOLKIT
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Your complete guide to making a bigger impact with your Walk for Friendship fundraising campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${guide.color} border-none p-8 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="text-5xl mb-4">{guide.icon}</div>
                <h3 className={`font-heading font-bold text-2xl mb-3 ${guide.textColor}`}>
                  {guide.title}
                </h3>
                <p className={`${guide.textColor} opacity-90`}>
                  {guide.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-xl p-8 shadow-md border border-purple-100">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Thirty Years, One Million Goals
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Thirty years of Friendship Circle, nineteen years of walks, and now, one monumental goal: $1 million. This summer, be part of something massive. We're rallying 30 families to step up, aiming to raise $10,000 each and bring a crowd of 50+ to walk. Your mission? Ignite the spark, fuel the goal, make an impact.
            </p>
          </div>

          <div className="bg-secondary/10 rounded-xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Brighter Together - A Kaleidoscope of Fun
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              This year, we unite under the theme "Brighter Together". Experience a day where every color, every laugh, and every step brings out the divine spark in us all. From brain-teasing scavenger hunts to the vibrant Color Run, culminating in a carnival finale with Nissim Black. All free, all fun, all ages - where individual sparks unite to create our biggest celebration yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
