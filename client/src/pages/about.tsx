import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Calendar, MapPin, Phone, Mail, Users, Clock, Star } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              About Walk for Friendship
            </h1>
            <p className="text-gray-600 text-lg">
              Learn about our annual fundraising event and the impact it makes on the Friendship Circle community.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="relative h-64 rounded-xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=500&q=80"
                alt="Friends walking together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <h2 className="font-heading font-bold text-3xl mb-2">Sunday, August 30, 2025</h2>
                  <p className="text-white/90 text-xl">Join us for a day of friendship and fundraising</p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Walk for Friendship is Friendship Circle of Michigan's annual fundraising event where
                communities come together to support friendship and inclusion for individuals with special needs.
                This Walk brings together people of all ages and backgrounds to celebrate friendship, raise funds,
                and increase awareness about the importance of inclusion.
              </p>
              
              <p>
                Since its inception, the Walk for Friendship has grown to become a cornerstone event in our
                community, raising vital funds that support Friendship Circle's programs throughout the year.
                With your help, we aim to reach our goal of $250,000 this year!
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">Date & Time</h3>
                      <p className="text-gray-700">Sunday, August 30, 2025</p>
                      <p className="text-gray-700">9:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-700">Friendship Circle Headquarters</p>
                      <p className="text-gray-700">6892 W Maple Rd, West Bloomfield, MI 48322</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">Schedule</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>9:00 AM - Registration & Check-in</li>
                        <li>10:00 AM - Opening Ceremony</li>
                        <li>10:30 AM - Walk Begins</li>
                        <li>11:30 AM - Celebration & Activities</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Star className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">What to Expect</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>Family-friendly 1-mile walk</li>
                        <li>Entertainment and activities</li>
                        <li>Food and refreshments</li>
                        <li>Walk for Friendship t-shirt</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">About Friendship Circle</h2>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>
                    Friendship Circle is a non-profit organization that provides programs and support to individuals with special needs and their families.
                    Through recreational, social, educational and vocational programming, Friendship Circle aims to create a more inclusive community.
                  </p>
                  
                  <p>
                    Our mission is to provide every individual with special needs the support and friendship they deserve. We believe that all people
                    are valuable and deserving of friendship, regardless of the challenges they face.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">2,500+</h3>
                    <p className="text-gray-600">Individuals Served</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">1,000+</h3>
                    <p className="text-gray-600">Volunteers</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">25+</h3>
                    <p className="text-gray-600">Programs Annually</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Contact Information</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-700">(248) 788-7878</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700">info@friendshipcircle.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-700">6892 W Maple Rd, West Bloomfield, MI 48322</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1">Office Hours</h3>
                      <p className="text-gray-700">Monday - Thursday: 9 AM - 5 PM</p>
                      <p className="text-gray-700">Friday: 9 AM - 3 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/register">
              <Button className="rounded-full" size="lg">
                Register for Walk for Friendship
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" className="ml-4 rounded-full" size="lg">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
