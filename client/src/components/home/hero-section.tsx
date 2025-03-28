import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, calculateProgress, animateCounter } from "@/lib/utils";

interface EventData {
  settings: {
    eventName: string;
    eventDate: string;
    goalAmount: number;
    raisedAmount: number;
  };
  stats: {
    teams: number;
    participants: number;
    donations: number;
  };
}

const HeroSection = () => {
  const { data, isLoading } = useQuery<EventData>({
    queryKey: ['/api/event'],
  });
  
  const raisedAmountRef = useRef<HTMLSpanElement>(null);
  const teamsCountRef = useRef<HTMLDivElement>(null);
  const participantsCountRef = useRef<HTMLDivElement>(null);
  const donationsCountRef = useRef<HTMLDivElement>(null);
  const thermometerRef = useRef<HTMLDivElement>(null);
  
  // Format the event date
  const eventDate = data?.settings?.eventDate 
    ? new Date(data.settings.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) 
    : 'Sunday, August 30, 2025';
  
  // Track if this is the first render
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (data && raisedAmountRef.current) {
      // Animate the raised amount counter
      animateCounter(
        raisedAmountRef.current, 
        data.settings.raisedAmount, 
        2000, 
        "$"
      );
      
      // Animate other counters
      if (teamsCountRef.current) {
        animateCounter(teamsCountRef.current, data.stats.teams);
      }
      
      if (participantsCountRef.current) {
        animateCounter(participantsCountRef.current, data.stats.participants);
      }
      
      if (donationsCountRef.current) {
        animateCounter(donationsCountRef.current, data.stats.donations);
      }
      
      // Only animate thermometer on first render to prevent glitching
      if (thermometerRef.current) {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          thermometerRef.current.style.width = "0%";
          setTimeout(() => {
            if (thermometerRef.current) {
              thermometerRef.current.style.width = `${calculateProgress(
                data.settings.raisedAmount,
                data.settings.goalAmount
              )}%`;
            }
          }, 300);
        } else {
          // Simply update the width without animation on subsequent renders
          thermometerRef.current.style.width = `${calculateProgress(
            data.settings.raisedAmount,
            data.settings.goalAmount
          )}%`;
        }
      }
    }
  }, [data]);
  
  return (
    <section className="bg-gradient-to-br from-white via-[#f8f0ff] to-primary/10 text-gray-800">
      <div className="container mx-auto px-4 py-14 md:py-28">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-4 text-primary">
              Walk for Friendship <span className="text-secondary">2025</span>
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-light">
              Join us {eventDate} for a day of fun, friendship, and fundraising!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="bg-accent hover:bg-opacity-80 text-white font-bold rounded-full text-lg">
                  Register Now
                </Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10 text-primary font-bold rounded-full text-lg">
                  Donate
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <img 
                  src="/images/brighter-together.png" 
                  alt="Brighter Together" 
                  className="w-full h-auto animate-float"
                />
              </div>
              <img
                src="/images/hero-image.jpeg"
                alt="Friends walking together"
                className="rounded-xl shadow-2xl border-4 border-white opacity-90"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-4 rounded-lg shadow-lg transform rotate-3">
                <p className="font-heading font-bold text-xl">{eventDate.split(',')[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg -mt-12 p-6 flex flex-col md:flex-row justify-between items-center">
            {/* Fundraising Progress */}
            <div className="mb-6 md:mb-0 w-full md:w-1/2">
              <h3 className="text-primary font-heading font-bold text-2xl mb-2">Together we've raised:</h3>
              <div className="flex items-end">
                <span
                  ref={raisedAmountRef}
                  className="text-4xl md:text-5xl font-heading font-extrabold text-dark mr-2 counter-animate"
                >
                  {isLoading ? "$0" : formatCurrency(data?.settings.raisedAmount || 0)}
                </span>
                <span className="text-gray-600 text-lg mb-1">
                  of {isLoading ? "$250,000" : formatCurrency(data?.settings.goalAmount || 250000)} goal
                </span>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  ref={thermometerRef}
                  className="thermometer-progress bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                  style={{ 
                    width: isLoading 
                      ? "0%" 
                      : `${calculateProgress(
                          data?.settings.raisedAmount || 0, 
                          data?.settings.goalAmount || 250000
                        )}%` 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-1/2 md:justify-end">
              <div className="text-center px-4">
                <div
                  ref={teamsCountRef}
                  className="text-3xl font-heading font-bold text-primary counter-animate"
                >
                  {isLoading ? "0" : data?.stats.teams}
                </div>
                <div className="text-gray-600">Teams</div>
              </div>
              <div className="text-center px-4">
                <div
                  ref={participantsCountRef}
                  className="text-3xl font-heading font-bold text-primary counter-animate"
                >
                  {isLoading ? "0" : data?.stats.participants}
                </div>
                <div className="text-gray-600">Participants</div>
              </div>
              <div className="text-center px-4">
                <div
                  ref={donationsCountRef}
                  className="text-3xl font-heading font-bold text-primary counter-animate"
                >
                  {isLoading ? "0" : data?.stats.donations}
                </div>
                <div className="text-gray-600">Donations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
