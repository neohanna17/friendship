import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ImpactSection = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Your Impact</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Every dollar you raise helps Friendship Circle support individuals with special needs and their families.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden shadow-md border-none">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="/images/community-support.jpeg" 
                alt="Community support" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Community Support</h3>
              <p className="text-gray-600 mb-4">
                Donations help create a vibrant community where everyone belongs, providing resources for families and caregivers.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-sm font-semibold">
                  Family Support
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1 rounded-full text-sm font-semibold">
                  Resource Center
                </Badge>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1 rounded-full text-sm font-semibold">
                  Volunteer Training
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-md border-none">
            <div className="relative h-64 overflow-hidden">
              <img 
                src="/images/jump.jpg" 
                alt="Child jumping with confidence" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Programs & Activities</h3>
              <p className="text-gray-600 mb-4">
                Your support helps fund inclusive programs, social activities, and educational resources for individuals with special needs.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-sm font-semibold">
                  After-School Programs
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1 rounded-full text-sm font-semibold">
                  Summer Camps
                </Badge>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1 rounded-full text-sm font-semibold">
                  Social Events
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
