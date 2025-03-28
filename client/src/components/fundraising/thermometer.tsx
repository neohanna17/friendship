import { useEffect, useRef, useState } from "react";
import { calculateProgress } from "@/lib/utils";
import { Star } from "lucide-react";

interface ThermometerProps {
  current: number;
  goal: number;
  height?: string;
  animate?: boolean;
  delay?: number;
  showMilestones?: boolean;
}

const Thermometer = ({ 
  current, 
  goal, 
  height = "h-6", 
  animate = true,
  delay = 300,
  showMilestones = true
}: ThermometerProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const milestoneContainerRef = useRef<HTMLDivElement>(null);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);
  const progress = calculateProgress(current, goal);
  
  // Define milestones at 25%, 50%, 75%, and 100%
  const milestones = [25, 50, 75, 100];
  
  useEffect(() => {
    if (animate && progressRef.current) {
      progressRef.current.style.width = "0%";
      
      const timeoutId = setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`;
          
          // Determine which milestones have been completed
          const completed = milestones.filter(milestone => progress >= milestone);
          setCompletedMilestones(completed);
        }
      }, delay);
      
      return () => clearTimeout(timeoutId);
    } else {
      // If not animating, still calculate completed milestones
      const completed = milestones.filter(milestone => progress >= milestone);
      setCompletedMilestones(completed);
    }
  }, [progress, animate, delay, milestones]);
  
  // Generate a celebration confetti effect when a milestone is reached
  useEffect(() => {
    if (completedMilestones.length > 0 && milestoneContainerRef.current) {
      const createConfetti = () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-overlay';
        document.body.appendChild(confettiContainer);
        
        // Create 50 confetti particles
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.width = `${Math.random() * 10 + 5}px`;
          confetti.style.height = `${Math.random() * 10 + 5}px`;
          confetti.style.background = `hsl(${280 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 10}%)`;
          confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
          confettiContainer.appendChild(confetti);
        }
        
        // Remove the confetti after animation completes
        setTimeout(() => {
          document.body.removeChild(confettiContainer);
        }, 5000);
      };
      
      if (completedMilestones.includes(100)) {
        createConfetti();
      }
    }
  }, [completedMilestones]);
  
  return (
    <div className="relative">
      <div className={`bg-gray-200 rounded-full ${height} overflow-hidden shadow-inner`}>
        <div
          ref={progressRef}
          className="thermometer-progress h-full rounded-full"
          style={{ 
            width: animate ? "0%" : `${progress}%`,
            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))`
          }}
        ></div>
      </div>
      
      {/* Milestone markers */}
      {showMilestones && (
        <div ref={milestoneContainerRef} className="relative h-0">
          {milestones.map((milestone) => (
            <div 
              key={milestone} 
              className="absolute top-0 transform -translate-y-full"
              style={{ 
                left: `${milestone}%`, 
                marginTop: "-8px",
                transition: "all 0.3s ease"
              }}
            >
              <div 
                className={`flex items-center justify-center rounded-full p-0.5 transition-all duration-300 ${
                  completedMilestones.includes(milestone) 
                    ? 'text-secondary scale-125' 
                    : 'text-gray-400'
                }`}
              >
                <Star className="h-3 w-3 fill-current" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Thermometer;
