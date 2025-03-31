import { useEffect, useRef, useState } from "react";
import { calculateProgress } from "@/lib/utils";
import { Star } from "lucide-react";
import { createConfetti } from "@/lib/confetti";

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
  animate = false, // Default to no animation to prevent glitching
  delay = 300,
  showMilestones = true
}: ThermometerProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const milestoneContainerRef = useRef<HTMLDivElement>(null);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevProgressRef = useRef<number>(0);
  
  // Define milestones at 25%, 50%, 75%, and 100%
  const milestones = [25, 50, 75, 100];
  
  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      const initialProgress = calculateProgress(current, goal);
      setProgressValue(initialProgress);
      prevProgressRef.current = initialProgress;
      
      // Determine which milestones have been completed
      const completed = milestones.filter(milestone => initialProgress >= milestone);
      setCompletedMilestones(completed);
      
      // Apply animation only on initial load if animate is true
      if (animate && progressRef.current) {
        progressRef.current.style.width = "0%";
        
        const timeoutId = setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.style.width = `${initialProgress}%`;
          }
        }, delay);
        
        return () => clearTimeout(timeoutId);
      } else if (progressRef.current) {
        progressRef.current.style.width = `${initialProgress}%`;
      }
      
      setIsInitialized(true);
    }
  }, []);
  
  // Update progress value when props change, but don't animate
  useEffect(() => {
    if (isInitialized) {
      const newProgress = calculateProgress(current, goal);
      
      // Update completed milestones
      const completed = milestones.filter(milestone => newProgress >= milestone);
      
      // Check if we just reached 100%
      const reached100 = !completedMilestones.includes(100) && completed.includes(100);
      
      setProgressValue(newProgress);
      setCompletedMilestones(completed);
      
      // Directly set the width without animation to prevent glitching
      if (progressRef.current) {
        progressRef.current.style.width = `${newProgress}%`;
      }
      
      // Show confetti if we just reached 100%
      if (reached100) {
        createConfetti(5000, 20);
      }
      
      prevProgressRef.current = newProgress;
    }
  }, [current, goal, isInitialized]);
  
  return (
    <div className="relative">
      <div className={`bg-gray-200 rounded-full ${height} overflow-hidden shadow-inner`}>
        <div
          ref={progressRef}
          className="thermometer-progress h-full rounded-full"
          style={{ 
            width: `${progressValue}%`,
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
