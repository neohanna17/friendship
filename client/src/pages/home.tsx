import HeroSection from "@/components/home/hero-section";
import EventInfoSection from "@/components/home/event-info-section";
import ImpactSection from "@/components/home/impact-section";
import TopTeamsSection from "@/components/home/top-teams-section";
import SponsorshipSection from "@/components/home/sponsorship-section";
import RegisterCTA from "@/components/home/register-cta";
import { useEffect } from "react";

const Home = () => {
  // Add intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          animateOnScroll.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Add animation to all the sections
    document.querySelectorAll('section').forEach(section => {
      if (section !== document.querySelector('section:first-of-type')) {
        animateOnScroll.observe(section);
      }
    });

    return () => {
      animateOnScroll.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <EventInfoSection />
      <ImpactSection />
      <TopTeamsSection />
      <SponsorshipSection />
      <RegisterCTA />
    </div>
  );
};

export default Home;
