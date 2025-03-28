import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Download, 
  Gift, 
  Goal,
  Lightbulb, 
  Share2, 
  Star, 
  Users 
} from "lucide-react";

// Import some images for the page
import walkImage from "@assets/483510807_621796797337733_5403735587077694628_n.jpg";
import teamImage from "@assets/27ddf5ee-7a52-4ac4-8238-f430f891f9cce568a64e-816e-446b-b2ea-2c619c2c0964.jpg";

const FundraisingToolkit = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const fundraisingTips = [
    {
      title: "Start with a compelling story",
      content: "Share why the Friendship Circle mission matters to you personally. Authentic stories resonate with potential donors.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Set meaningful goals",
      content: "Break your fundraising into achievable milestones. Celebrate and share each milestone you reach!",
      icon: <Goal className="h-5 w-5" />
    },
    {
      title: "Leverage social media",
      content: "Share your fundraising page across all your social platforms. Use images and videos to make your posts more engaging.",
      icon: <Share2 className="h-5 w-5" />
    },
    {
      title: "Send personal emails",
      content: "Direct email outreach to friends and family has one of the highest conversion rates. Make it personal!",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Host a mini-event",
      content: "Consider a small gathering, virtual event, or challenge to boost your fundraising and spread awareness.",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Say thank you",
      content: "Always acknowledge your donors promptly. A personalized thank you goes a long way in building lasting relationships.",
      icon: <Gift className="h-5 w-5" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Fundraising Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to make your Walk for Friendship fundraising campaign a success.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="tips">Fundraising Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Thirty Years, One Million Goals</h2>
                <p className="text-muted-foreground mb-4">
                  Thirty years of Friendship Circle, nineteen years of walks, and now, one monumental goal: $1 million. This summer, be part of something massive. We're rallying 30 families to step up, aiming to raise $10,000 each and bring a crowd of 50+ to walk. Your mission? Ignite the spark, fuel the goal, make an impact.
                </p>
                
                <h2 className="text-2xl font-bold mb-4 mt-8">Brighter Together - A Kaleidoscope of Fun</h2>
                <p className="text-muted-foreground mb-4">
                  This year, we unite under the theme "Brighter Together". Dive into a day where every color, every laugh, and every step brings out the divine spark in us all. Begin with a brain-teasing scavenger hunt, race through the vibrant Color Run, and revel in a carnival finale with Nissim Black setting the stage alight. All free, all fun, all ages. This is where your individual sparks join to light up our biggest celebration yet.
                </p>
                
                <div className="mt-8">
                  <Button className="mr-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                    <Download className="mr-2 h-4 w-4" /> Download Full Toolkit
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> Event Calendar
                  </Button>
                </div>
              </div>
              
              <div>
                <img 
                  src={walkImage} 
                  alt="Walk for Friendship" 
                  className="rounded-lg shadow-lg w-full h-auto mb-6 object-cover"
                />
                
                <Card className="border-none bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="text-xl">Your Toolkit for Success</CardTitle>
                    <CardDescription>Inside your packet, find the fuel for your fundraising fire.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Ideas, strategies, and real stories of what works best. Plus, incentives that are as exciting as our goal. It's not just about reaching a target; it's about making the journey memorable.
                    </p>
                    <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <Star className="h-5 w-5 text-purple-600 mr-2" /> 
                        This is Your Call
                      </h3>
                      <p>
                        Make history with us. Bring your spirit, your energy, and your community. Every step, every dollar, every shared smile adds up to something bigger than us all. This is Walk4Friendship 2024 - where we walk, we raise, we celebrate, together. Ready to make waves? Let's walk!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Email Templates</CardTitle>
                  <CardDescription>Pre-written emails to send to your network</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A collection of professionally written email templates to help you reach out to friends, family, and colleagues.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Templates
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Social Media Kit</CardTitle>
                  <CardDescription>Graphics and copy for your social channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your fundraising journey with eye-catching graphics and compelling captions for Instagram, Facebook, and more.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Social Kit
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fundraising Ideas</CardTitle>
                  <CardDescription>Creative ways to reach your goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    From virtual challenges to workplace matching, explore proven fundraising strategies to help you meet and exceed your goals.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Guide
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Team Captain Guide</CardTitle>
                  <CardDescription>Leading your team to success</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A comprehensive guide for team captains with tips on recruiting, motivating, and coordinating your team members.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Guide
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Event Day Information</CardTitle>
                  <CardDescription>Everything you need for the big day</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Details about the walk route, schedule, parking, what to bring, and all the exciting activities planned for the day.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Info Pack
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Impact Stories</CardTitle>
                  <CardDescription>Real stories of difference made</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Powerful testimonials and stories that demonstrate the impact of Friendship Circle on the lives of participants and families.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Stories
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2">
                <img 
                  src={teamImage} 
                  alt="Fundraising team" 
                  className="rounded-lg shadow-md w-full h-auto object-cover mb-6"
                />
                
                <Card className="bg-gradient-to-br from-purple-600 to-pink-500 text-white border-none">
                  <CardHeader>
                    <CardTitle>Success Story</CardTitle>
                    <CardDescription className="text-white/80">Team Sunshine raised $15,000 in 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      "We started early and focused on personal outreach. Each team member committed to contacting at least 10 people directly. We shared stories about why Friendship Circle matters to us, and the response was incredible!"
                    </p>
                    <p className="text-white/80 text-sm">
                      - Sarah M., Team Captain
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold mb-6">Expert Fundraising Tips</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {fundraisingTips.map((tip, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center text-left">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            {tip.icon}
                          </div>
                          <span>{tip.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-12">
                        {tip.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Lightbulb className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                      <p className="text-muted-foreground">
                        The average successful fundraiser sends at least 7 emails during their campaign. Start with an announcement, follow up with progress updates, and send reminders as you approach your event date. Persistence with a personal touch is key!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-16 py-8 px-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join us for Walk for Friendship 2024 and be part of something truly special. Together, we can reach our $1 million goal and create lasting impact in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              Register Now
            </Button>
            <Button size="lg" variant="outline">
              Start Fundraising
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundraisingToolkit;