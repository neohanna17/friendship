import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateProgress(current: number, goal: number): number {
  const percentage = (current / goal) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
}

export function animateCounter(element: HTMLElement, target: number, duration: number = 2000, prefix: string = ""): void {
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime > duration) {
      element.textContent = `${prefix}${target.toLocaleString()}`;
      return;
    }
    
    const progress = elapsedTime / duration;
    const currentValue = Math.floor(startValue + progress * (target - startValue));
    element.textContent = `${prefix}${currentValue.toLocaleString()}`;
    
    requestAnimationFrame(updateCounter);
  }
  
  requestAnimationFrame(updateCounter);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
