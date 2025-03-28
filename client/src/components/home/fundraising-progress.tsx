import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, calculateProgress, animateCounter } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EventSettings {
  eventName: string;
  goalAmount: number;
  raisedAmount: number;
}

const FundraisingProgress = () => {
  const { data, isLoading } = useQuery<{ settings: EventSettings }>({
    queryKey: ['/api/event'],
  });
  
  const raisedAmountRef = useRef<HTMLSpanElement>(null);
  const thermometerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (data && raisedAmountRef.current) {
      // Animate the counter
      animateCounter(
        raisedAmountRef.current, 
        data.settings.raisedAmount, 
        2000, 
        "$"
      );
      
      // Animate thermometer
      if (thermometerRef.current) {
        thermometerRef.current.style.width = "0%";
        setTimeout(() => {
          thermometerRef.current!.style.width = `${calculateProgress(
            data.settings.raisedAmount,
            data.settings.goalAmount
          )}%`;
        }, 300);
      }
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-12 w-1/2 mb-3" />
        <Skeleton className="h-6 w-full rounded-full" />
      </div>
    );
  }
  
  const { raisedAmount, goalAmount } = data?.settings || { raisedAmount: 0, goalAmount: 250000 };
  const progress = calculateProgress(raisedAmount, goalAmount);
  
  return (
    <div className="w-full">
      <h3 className="text-primary font-heading font-bold text-2xl mb-2">Together we've raised in 2024:</h3>
      <div className="flex items-end">
        <span
          ref={raisedAmountRef}
          className="text-4xl md:text-5xl font-heading font-extrabold text-dark mr-2 counter-animate"
        >
          {formatCurrency(raisedAmount)}
        </span>
        <span className="text-gray-600 text-lg mb-1">
          of {formatCurrency(goalAmount)} goal
        </span>
      </div>
      <div className="mt-3 bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          ref={thermometerRef}
          className="thermometer-progress bg-gradient-to-r from-primary to-secondary h-full rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-muted-foreground mt-2 text-sm italic">
        Transforming lives and building a more inclusive community, together
      </p>
    </div>
  );
};

export default FundraisingProgress;
