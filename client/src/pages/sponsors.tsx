import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Mail, Download } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logo: string;
  websiteUrl: string;
  description: string;
}

const Sponsors = () => {
  const { data, isLoading } = useQuery<{ sponsors: Sponsor[] }>({
    queryKey: ['/api/sponsors'],
  });
  
  // Group sponsors by tier
  const groupedSponsors = {
    gold: data?.sponsors.filter(sponsor => sponsor.tier === "gold") || [],
    silver: data?.sponsors.filter(sponsor => sponsor.tier === "silver") || [],
    bronze: data?.sponsors.filter(sponsor => sponsor.tier === "bronze") || []
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Our Sponsors
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Thank you to these amazing organizations for supporting the Walk for Friendship and Friendship Circle's mission.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-12">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="gold" className="text-amber-600">Gold</TabsTrigger>
            <TabsTrigger value="silver" className="text-gray-500">Silver</TabsTrigger>
            <TabsTrigger value="bronze" className="text-amber-800">Bronze</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            <SponsorsList 
              sponsors={data?.sponsors || []} 
              isLoading={isLoading}
              title="All Sponsors"
            />
          </TabsContent>
          
          <TabsContent value="gold" className="mt-8">
            <SponsorsList 
              sponsors={groupedSponsors.gold} 
              isLoading={isLoading}
              title="Gold Sponsors"
              emptyMessage="No gold sponsors yet."
            />
          </TabsContent>
          
          <TabsContent value="silver" className="mt-8">
            <SponsorsList 
              sponsors={groupedSponsors.silver} 
              isLoading={isLoading}
              title="Silver Sponsors"
              emptyMessage="No silver sponsors yet."
            />
          </TabsContent>
          
          <TabsContent value="bronze" className="mt-8">
            <SponsorsList 
              sponsors={groupedSponsors.bronze} 
              isLoading={isLoading}
              title="Bronze Sponsors"
              emptyMessage="No bronze sponsors yet."
            />
          </TabsContent>
        </Tabs>
        
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-white rounded-xl shadow-md overflow-hidden border-none">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-heading font-bold text-2xl mb-4 text-gray-900">Become a Sponsor</h2>
              <p className="text-gray-600 mb-6">
                Support our mission while gaining visibility for your organization. By becoming a sponsor, you'll help Friendship Circle provide programs and support to individuals with special needs and their families.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SponsorTierCard
                  tier="Gold"
                  amount="$5,000"
                  benefits={[
                    "Premium logo placement on all event materials",
                    "Social media recognition (5+ posts)",
                    "VIP event access for 10 people",
                    "Speaking opportunity at the event",
                    "Company banner displayed at event"
                  ]}
                  colorClass="border-amber-500 hover:bg-amber-50"
                  textClass="text-amber-600"
                />
                
                <SponsorTierCard
                  tier="Silver"
                  amount="$2,500"
                  benefits={[
                    "Logo on website and printed materials",
                    "Social media recognition (3 posts)",
                    "Event booth opportunity",
                    "Event access for 5 people",
                    "Recognition during event program"
                  ]}
                  colorClass="border-gray-400 hover:bg-gray-50"
                  textClass="text-gray-500"
                />
                
                <SponsorTierCard
                  tier="Bronze"
                  amount="$1,000"
                  benefits={[
                    "Name listing on website",
                    "Name on printed event materials",
                    "Social media mention (1 post)",
                    "Event access for 2 people",
                    "Certificate of appreciation"
                  ]}
                  colorClass="border-amber-700 hover:bg-amber-50/70"
                  textClass="text-amber-800"
                />
              </div>
              
              <div className="text-center">
                <Button className="bg-primary text-white rounded-full hover:bg-primary/90 inline-flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sponsor Packet
                </Button>
                <Button variant="outline" className="ml-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full inline-flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us About Sponsorship
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Friendship Circles Around the World Gallery */}
      <div className="max-w-7xl mx-auto mt-16 mb-12">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl text-gray-900 mb-4">
            Friendship Circles Around the World
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover the global impact of Friendship Circle communities bringing people together across the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          <div className="overflow-hidden rounded-lg bg-white shadow group">
            <div className="aspect-square relative">
              <img 
                src="/images/friendship-circles/michigan.jpg" 
                alt="Friendship Circle Michigan" 
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Michigan, United States</h3>
              <p className="text-gray-600 text-sm">Building friendships that last a lifetime</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow group">
            <div className="aspect-square relative">
              <img 
                src="/images/friendship-circles/florida.webp" 
                alt="Friendship Circle Florida" 
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Florida, United States</h3>
              <p className="text-gray-600 text-sm">Celebrating community and inclusion</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow group">
            <div className="aspect-square relative">
              <img 
                src="/images/friendship-circles/montreal.jpg" 
                alt="Friendship Circle Montreal" 
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Montreal, Canada</h3>
              <p className="text-gray-600 text-sm">Creating connections and support networks</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow group">
            <div className="aspect-square relative">
              <img 
                src="/images/friendship-circles/miami.webp" 
                alt="Friendship Circle Miami" 
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Miami, United States</h3>
              <p className="text-gray-600 text-sm">Walking together for friendship and community</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow group">
            <div className="aspect-square relative">
              <img 
                src="/images/friendship-circles/cleveland.jpg" 
                alt="Friendship Circle Cleveland" 
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Cleveland, United States</h3>
              <p className="text-gray-600 text-sm">Building a community of believers and supporters</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow group flex flex-col items-center justify-center">
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Join the Movement</h3>
              <p className="text-gray-600 mb-4">Bring Friendship Circle to your community</p>
              <a href="#" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SponsorsListProps {
  sponsors: Sponsor[];
  isLoading: boolean;
  title: string;
  emptyMessage?: string;
}

const SponsorsList = ({ sponsors, isLoading, title, emptyMessage = "No sponsors found." }: SponsorsListProps) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-sm h-24 flex items-center justify-center">
              <Skeleton className="h-16 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (sponsors.length === 0) {
    return (
      <div>
        <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900">{title}</h2>
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">{emptyMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center justify-center h-32 border border-gray-100"
          >
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-h-16 max-w-full mb-2"
              />
            ) : (
              <div className="font-heading font-bold text-xl text-center text-gray-800 mb-2">
                {sponsor.name}
              </div>
            )}
            <div className="flex items-center text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Visit website</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </div>
            <div className={`absolute top-2 right-2 text-xs uppercase font-bold ${
              sponsor.tier === 'gold' ? 'text-amber-600' : 
              sponsor.tier === 'silver' ? 'text-gray-500' : 
              'text-amber-800'
            }`}>
              {sponsor.tier}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

interface SponsorTierCardProps {
  tier: string;
  amount: string;
  benefits: string[];
  colorClass: string;
  textClass: string;
}

const SponsorTierCard = ({ tier, amount, benefits, colorClass, textClass }: SponsorTierCardProps) => {
  return (
    <div className={`border rounded-lg p-5 transition cursor-pointer ${colorClass}`}>
      <h3 className={`font-heading font-bold text-xl mb-2 ${textClass}`}>{tier} Sponsor</h3>
      <p className="font-bold text-gray-900 mb-3">{amount}</p>
      <ul className="text-sm text-gray-600 space-y-1 mb-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <span className={`mr-2 text-lg leading-none ${textClass}`}>•</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sponsors;
