import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logo: string;
  websiteUrl: string;
}

const SponsorshipSection = () => {
  const { data, isLoading } = useQuery<{ sponsors: Sponsor[] }>({
    queryKey: ['/api/sponsors'],
  });
  
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier === selectedTier ? null : tier);
  };
  
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Our Sponsors</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Thank you to these amazing organizations for supporting our mission.
          </p>
        </div>
        
        {/* Top sponsors bar - always visible */}
        <div className="bg-white py-6 rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="flex justify-around items-center flex-wrap gap-4 px-4">
            <img src="/attached_assets/02f6b9f1-1444-41e3-bd53-4b2e8b18c04b.png" alt="Encore Real Estate" className="h-12 object-contain" />
            <img src="/attached_assets/4a1a4b07-24f2-40f9-b824-fe28b2119202.jpg" alt="Pappas Financial" className="h-10 object-contain" />
            <img src="/attached_assets/4e1494d8-75aa-4cb1-b374-d2bcdcd95770.png" alt="Kroger" className="h-10 object-contain" />
            <img src="/attached_assets/4e4161a1-ae27-4c72-9e03-8fab5895d7f4.jpg" alt="Busch's Fresh Food Market" className="h-12 object-contain" />
            <img src="/attached_assets/5dbdcefc-29e8-417f-9b0a-8c64f11348a8.png" alt="Mind Health Group" className="h-12 object-contain" />
            <img src="/attached_assets/6ae78a6e-f5ec-4a9b-9912-8a2af31d107e.png" alt="Mind" className="h-12 object-contain" />
            <img src="/attached_assets/6e85ebf1-e6c6-4a55-a662-c9490a0f8df6.jpg" alt="Glassman Automotive Group" className="h-10 object-contain" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm h-24 flex items-center justify-center">
                <Skeleton className="h-16 w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center mb-12">
            {data?.sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition flex items-center justify-center h-24"
              >
                {sponsor.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-16 max-w-full"
                  />
                ) : (
                  <div className="text-center font-medium text-gray-700">
                    {sponsor.name}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
        
        <div>
          <Card className="bg-white rounded-xl shadow-md overflow-hidden border-none">
            <CardContent className="p-6 md:p-8">
              <h3 className="font-heading font-bold text-2xl mb-4 text-gray-900">Become a Sponsor</h3>
              <p className="text-gray-600 mb-6">
                Support our mission while gaining visibility for your organization. Multiple sponsorship levels available.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  className={cn(
                    "border rounded-lg p-4 hover:bg-primary/5 transition cursor-pointer",
                    selectedTier === "gold" 
                      ? "border-primary bg-primary/5" 
                      : "border-primary/30"
                  )}
                  onClick={() => handleSelectTier("gold")}
                >
                  <h4 className="font-heading font-bold text-lg text-primary mb-2">Gold Sponsor</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Premium logo placement, social media recognition, and VIP event access.
                  </p>
                  <p className="font-bold text-gray-900">$5,000</p>
                </div>
                <div
                  className={cn(
                    "border rounded-lg p-4 hover:bg-secondary/5 transition cursor-pointer",
                    selectedTier === "silver" 
                      ? "border-secondary bg-secondary/5" 
                      : "border-secondary/30"
                  )}
                  onClick={() => handleSelectTier("silver")}
                >
                  <h4 className="font-heading font-bold text-lg text-secondary mb-2">Silver Sponsor</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Logo on website and materials, social media mention, and event booth.
                  </p>
                  <p className="font-bold text-gray-900">$2,500</p>
                </div>
                <div
                  className={cn(
                    "border rounded-lg p-4 hover:bg-accent/5 transition cursor-pointer",
                    selectedTier === "bronze" 
                      ? "border-accent bg-accent/5" 
                      : "border-accent/30"
                  )}
                  onClick={() => handleSelectTier("bronze")}
                >
                  <h4 className="font-heading font-bold text-lg text-accent mb-2">Bronze Sponsor</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Name listing on website and event materials.
                  </p>
                  <p className="font-bold text-gray-900">$1,000</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="bg-primary text-white rounded-full hover:bg-primary/90">
                  Download Sponsor Packet
                </Button>
                <Button variant="outline" className="ml-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipSection;
