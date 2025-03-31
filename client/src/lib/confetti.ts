// Track if confetti is currently showing to prevent multiple instances
let confettiIsShowing = false;

/**
 * Utility function to create a gentle, short-lived celebratory confetti effect
 * @param duration Duration of the confetti animation in milliseconds (default: 2000ms)
 * @param count Number of confetti particles (default: 12)
 * @returns Boolean indicating if confetti was actually shown
 */
export function createConfetti(duration = 2000, count = 12): boolean {
  // Don't show confetti if it's already showing
  if (confettiIsShowing) {
    return false;
  }
  
  confettiIsShowing = true;
  
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-overlay';
  document.body.appendChild(confettiContainer);
  
  // Create confetti particles - fewer particles for gentler effect
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Space particles evenly across the width with more randomness
    confetti.style.left = `${Math.random() * 90 + 5}%`;
    
    // Smaller particles for subtlety
    const size = Math.random() * 4 + 2;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Light blue colors like snowflakes
    confetti.style.background = `hsl(${210 + Math.random() * 20}, ${50 + Math.random() * 20}%, ${85 + Math.random() * 10}%)`;
    
    // Faster fall speed for shorter duration
    confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
    
    // Minimal delay for quick appearance
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    
    // Add subtle rotation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Make some particles more transparent
    confetti.style.opacity = `${Math.random() * 0.5 + 0.3}`;
    
    confettiContainer.appendChild(confetti);
  }
  
  // Remove the confetti after animation completes
  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
    }
    confettiIsShowing = false;
  }, duration);
  
  return true;
}