import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, HeartHandshake, Users } from "lucide-react";

const EventInfoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Join us for our annual Walk for Friendship, where communities come together to support friendship and inclusion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-none">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Register</h3>
              <p className="text-gray-600 mb-4">
                Sign up as an individual or create a team. Set your fundraising goal and customize your page.
              </p>
              <Link href="/register">
                <span className="inline-block text-primary font-semibold hover:underline cursor-pointer">
                  Register Now →
                </span>
              </Link>
            </CardContent>
          </Card>
          
          {/* Step 2 */}
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-none">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Fundraise</h3>
              <p className="text-gray-600 mb-4">
                Share your page with friends and family. Raise funds to support Friendship Circle's programs.
              </p>
              <span className="inline-block text-secondary font-semibold hover:underline cursor-pointer">
                Fundraising Tips →
              </span>
            </CardContent>
          </Card>
          
          {/* Step 3 */}
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-none">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Walk & Celebrate</h3>
              <p className="text-gray-600 mb-4">
                Join us on August 30th for a day of walking, activities, and celebrating friendship.
              </p>
              <span className="inline-block text-accent font-semibold hover:underline cursor-pointer">
                Event Details →
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EventInfoSection;
