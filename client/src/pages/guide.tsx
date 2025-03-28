import { Card } from "@/components/ui/card";

export default function GuidePage() {
  const guides = [
    {
      title: "Rule nr 1 of fundraising",
      description: "Start early and share your personal connection to the cause. Authenticity is your strongest asset.",
      color: "bg-blue-100"
    },
    {
      title: "Getting started in fundraising",
      description: "Set your goal, customize your page, and make your first donation to lead by example.",
      color: "bg-green-100"
    },
    {
      title: "Creative ideas that work",
      description: "Host mini-events, leverage social media challenges, and create themed fundraising campaigns.",
      color: "bg-purple-100"
    },
    {
      title: "Matching gifts",
      description: "Double your impact by checking if your donors' employers offer matching gift programs.",
      color: "bg-pink-100"
    },
    {
      title: "Proven methods of fundraising",
      description: "Personal emails, social media sharing, and direct asks remain the most effective strategies.",
      color: "bg-yellow-100"
    },
    {
      title: "Fundraising incentives",
      description: "Unlock exclusive rewards and recognition as you reach fundraising milestones.",
      color: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">
            Fundraising Guide
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Everything you need to know to make your Walk for Friendship fundraising campaign a success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guides.map((guide, index) => (
            <Card key={index} className={`${guide.color} border-none p-6 rounded-xl hover:shadow-lg transition-shadow`}>
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">
                {guide.title}
              </h3>
              <p className="text-gray-700">
                {guide.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="prose prose-lg mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thirty Years, One Million Goals
            </h2>
            <p className="text-gray-700 mb-6">
              Thirty years of Friendship Circle, nineteen years of walks, and now, one monumental goal: $1 million. This summer, be part of something massive. We're rallying 30 families to step up, aiming to raise $10,000 each and bring a crowd of 50+ to walk. Your mission? Ignite the spark, fuel the goal, make an impact.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Brighter Together - A Kaleidoscope of Fun
            </h2>
            <p className="text-gray-700 mb-6">
              This year, we unite under the theme "Brighter Together". Dive into a day where every color, every laugh, and every step brings out the divine spark in us all. Begin with a brain-teasing scavenger hunt, race through the vibrant Color Run, and revel in a carnival finale with Nissim Black setting the stage alight. All free, all fun, all ages. This is where your individual sparks join to light up our biggest celebration yet.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Toolkit for Success
            </h2>
            <p className="text-gray-700 mb-6">
              Inside your packet, find the fuel for your fundraising fire. Ideas, strategies, and real stories of what works best. Plus, incentives that are as exciting as our goal. It's not just about reaching a target; it's about making the journey memorable.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              This is Your Call
            </h2>
            <p className="text-gray-700 mb-6">
              Make history with us. Bring your spirit, your energy, and your community. Every step, every dollar, every shared smile adds up to something bigger than us all. This is Walk4Friendship 2024 - where we walk, we raise, we celebrate, together. Ready to make waves? Let's walk!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;