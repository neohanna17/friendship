import { useState, useEffect } from "react";

const FriendshipCirclesGallery = () => {
  // Add animation effect on image hover
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl text-gray-900 mb-4">
            Friendship Circles Around the World
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover the global impact of Friendship Circle communities bringing people together across the world.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 ${loaded ? 'animate-fade-in' : 'opacity-0'}`}>
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
    </section>
  );
};

export default FriendshipCirclesGallery;