import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Images for the gallery
const teamImage1 = "/images/friendship-circles/team1.jpg";
const teamImage2 = "/images/friendship-circles/team2.jpg";
const walkImage1 = "/images/friendship-circles/walk1.jpg";
const walkImage2 = "/images/friendship-circles/walk2.jpg";
const walkImage3 = "/images/friendship-circles/walk3.jpg";
const eventImage1 = "/images/friendship-circles/event1.jpg";
const montrealImage = "/images/friendship-circles/montreal.jpg";
const mascotImage = "/images/friendship-circles/mascot.webp";
const familyImage = "/images/friendship-circles/family.webp";

const FriendshipCirclesGallery = () => {
  const [loaded, setLoaded] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Gallery images with their details
  // Added additional image to make it 10 total for a clean 5x2 grid
  const eventImage2 = "/images/friendship-circles/event2.jpg";
  
  const galleryImages = [
    {
      image: teamImage1,
      location: "Michigan, United States",
      description: "Building friendships that last a lifetime",
    },
    {
      image: walkImage1,
      location: "Annual Walk4Friendship",
      description: "Walking together for friendship and inclusion",
    },
    {
      image: teamImage2,
      location: "Florida, United States",
      description: "Creating connections and support networks",
    },
    {
      image: walkImage2,
      location: "Michigan Walk Event",
      description: "Coming together to make a difference",
    },
    {
      image: montrealImage,
      location: "Montreal, Canada",
      description: "The Friendship Circle community in Montreal",
    },
    {
      image: eventImage1,
      location: "Event Kickoff",
      description: "Celebrating the start of our annual walk",
    },
    {
      image: walkImage3,
      location: "Walk Day 2023",
      description: "Participants enjoy the beautiful walk route",
    },
    {
      image: mascotImage,
      location: "Special Guests",
      description: "Celebrating with our community mascot",
    },
    {
      image: familyImage,
      location: "Family Participants",
      description: "Families coming together for friendship",
    },
    {
      image: eventImage2,
      location: "Community Spirit",
      description: "Sharing moments of joy and connection",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Friendship Circles Making an Impact
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            See the joy and connection happening at Friendship Circle events around the world. 
            Every smile tells a story of friendship and belonging.
          </p>
        </div>
        
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-8 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
          {galleryImages.map((item, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-lg bg-white shadow-md group"
            >
              <div className="aspect-square relative">
                <img 
                  src={item.image} 
                  alt={item.location} 
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-semibold text-lg text-white">{item.location}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button 
            onClick={() => setLocation("/about")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Learn More About Friendship Circle
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FriendshipCirclesGallery;