import { Card } from "@/components/ui/card";

const guides = [
  {
    title: "Getting Started",
    description: "Essential tips and first steps for your fundraising journey.",
    color: "bg-blue-50"
  },
  {
    title: "Social Media Tips",
    description: "Leverage your social networks to amplify your impact.",
    color: "bg-green-50"
  },
  {
    title: "Team Building",
    description: "Strategies for building and motivating your fundraising team.",
    color: "bg-purple-50"
  },
  {
    title: "Corporate Matching",
    description: "How to double your impact through workplace giving programs.",
    color: "bg-yellow-50"
  },
  {
    title: "Event Planning",
    description: "Ideas for hosting successful fundraising events.",
    color: "bg-pink-50"
  },
  {
    title: "Donor Recognition",
    description: "Best practices for thanking and engaging your supporters.",
    color: "bg-orange-50"
  }
];

export default function GuidePage() {
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

        <div className="max-w-4xl mx-auto">
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