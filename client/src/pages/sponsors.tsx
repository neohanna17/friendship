import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon, CheckCircle2, AlertTriangle } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logo: string;
  websiteUrl: string;
  description?: string;
}

const SponsorsPage = () => {
  const { data, isLoading } = useQuery<{ sponsors: Sponsor[] }>({
    queryKey: ['/api/sponsors'],
  });
  
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier === selectedTier ? null : tier);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Our Sponsors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Thank you to these amazing organizations for supporting Walk4Friendship. 
            Their generous contributions help make our program possible.
          </p>
        </div>
        
        {/* Featured Sponsors Banner */}
        <div className="bg-white rounded-xl shadow-md py-8 px-6 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Sponsors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-8 items-center">
            <div className="flex items-center justify-center">
              <img src="/attached_assets/8d89f0be-7c9d-403d-8505-52a146defd2f.png" alt="Amistee Air Duct Cleaning & Insulation" className="h-16 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/9c1ff09e-a0c7-43b1-a210-1b0d357adc8e.png" alt="Sponsor Logo" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/9d5effa4-c686-4544-9915-2a76dbcca0b9.jpg" alt="River's Bend PC & Feinberg Consulting" className="h-16 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/9e9f0235-7a69-4c65-b680-b5d108207dc0.png" alt="Maserati of Troy" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/9f65d18f-0e31-4331-ab42-2f47a8ec6a54.jpg" alt="Absopure" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/02f6b9f1-1444-41e3-bd53-4b2e8b18c04b.png" alt="Encore Real Estate" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/4a1a4b07-24f2-40f9-b824-fe28b2119202.jpg" alt="Pappas Financial" className="h-12 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/4e1494d8-75aa-4cb1-b374-d2bcdcd95770.png" alt="Kroger" className="h-13 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/4e4161a1-ae27-4c72-9e03-8fab5895d7f4.jpg" alt="Busch's Fresh Food Market" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/5dbdcefc-29e8-417f-9b0a-8c64f11348a8.png" alt="Mind Health Group" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/6ae78a6e-f5ec-4a9b-9912-8a2af31d107e.png" alt="Mind" className="h-14 object-contain mx-auto" />
            </div>
            <div className="flex items-center justify-center">
              <img src="/attached_assets/6e85ebf1-e6c6-4a55-a662-c9490a0f8df6.jpg" alt="Glassman Automotive Group" className="h-14 object-contain mx-auto" />
            </div>
          </div>
        </div>
        
        {/* All Sponsors */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">All Sponsors</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-lg shadow-sm flex flex-col">
                  <Skeleton className="h-20 w-3/4 rounded mb-4 mx-auto" />
                  <Skeleton className="h-4 w-full rounded mb-2" />
                  <Skeleton className="h-4 w-2/3 rounded mb-4" />
                  <Skeleton className="h-8 w-1/3 rounded mt-auto mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
              {data?.sponsors.map((sponsor) => (
                <Card key={sponsor.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4 h-24 flex items-center justify-center">
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-20 max-w-full"
                        />
                      ) : (
                        <div className="text-2xl font-bold text-primary text-center">
                          {sponsor.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        sponsor.tier === 'gold' ? 'bg-amber-100 text-amber-800' :
                        sponsor.tier === 'silver' ? 'bg-gray-100 text-gray-600' :
                        sponsor.tier === 'bronze' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Sponsor
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{sponsor.name}</h3>
                    
                    {sponsor.description && (
                      <p className="text-gray-600 text-sm mb-4">{sponsor.description}</p>
                    )}
                    
                    <div className="mt-auto">
                      <a 
                        href={sponsor.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-medium text-sm hover:underline flex items-center"
                      >
                        Visit Website <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Become a Sponsor Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-none">
          <div className="bg-primary/10 py-8 px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Become a Sponsor</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
              Support our mission while gaining visibility for your organization. 
              Your sponsorship makes a difference in the lives of people with special needs.
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className={cn(
                "relative overflow-visible border-2 transition-all duration-300",
                selectedTier === "gold" 
                  ? "border-primary shadow-lg transform -translate-y-2" 
                  : "border-primary/30 hover:border-primary/60"
              )}
              onClick={() => handleSelectTier("gold")}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-amber-200 text-amber-900 py-1 px-3 rounded-full text-sm font-bold">Premium</span>
                </div>
                <CardContent className="p-6 cursor-pointer">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-primary">Gold Sponsor</h3>
                    <p className="text-3xl font-bold my-4">$5,000</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Premium logo placement on all event materials</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Featured recognition on social media platforms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>VIP access to all event activities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Logo on Walk4Friendship t-shirts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Premium booth placement at the event</span>
                    </li>
                  </ul>
                  
                  <Link href="/sponsor-checkout?tier=gold" className="block text-center">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Select Gold Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "relative overflow-visible border-2 transition-all duration-300",
                selectedTier === "silver" 
                  ? "border-secondary shadow-lg transform -translate-y-2" 
                  : "border-secondary/30 hover:border-secondary/60"
              )}
              onClick={() => handleSelectTier("silver")}
              >
                <CardContent className="p-6 cursor-pointer">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-secondary">Silver Sponsor</h3>
                    <p className="text-3xl font-bold my-4">$2,500</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Logo on event website and printed materials</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Social media acknowledgment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Event booth</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Name recognition during event</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">Premium booth placement</span>
                    </li>
                  </ul>
                  
                  <Link href="/sponsor-checkout?tier=silver" className="block text-center">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Select Silver Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "relative overflow-visible border-2 transition-all duration-300",
                selectedTier === "bronze" 
                  ? "border-accent shadow-lg transform -translate-y-2" 
                  : "border-accent/30 hover:border-accent/60"
              )}
              onClick={() => handleSelectTier("bronze")}
              >
                <CardContent className="p-6 cursor-pointer">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-accent">Bronze Sponsor</h3>
                    <p className="text-3xl font-bold my-4">$1,000</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Name listing on event website</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Name listing in event program</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Event acknowledgment</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">Social media promotion</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">Event booth</span>
                    </li>
                  </ul>
                  
                  <Link href="/sponsor-checkout?tier=bronze" className="block text-center">
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      Select Bronze Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <p className="mb-6 text-gray-600">
                For custom sponsorship packages or more information about sponsorship opportunities, 
                please download our complete sponsorship packet or contact our team directly.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-primary text-white rounded-full hover:bg-primary/90">
                  Download Sponsor Packet
                </Button>
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                  Contact Our Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;