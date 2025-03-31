// Track if confetti is currently showing to prevent multiple instances
let confettiIsShowing = false;

/**
 * Utility function to create an extremely gentle, short-lived snowfall-like celebratory effect
 * @param duration Duration of the animation in milliseconds (default: 1500ms)
 * @param count Number of particles (default: 8)
 * @returns Boolean indicating if the effect was actually shown
 */
export function createConfetti(duration = 1500, count = 8): boolean {
  // Don't show confetti if it's already showing
  if (confettiIsShowing) {
    return false;
  }
  
  confettiIsShowing = true;
  
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-overlay';
  document.body.appendChild(confettiContainer);
  
  // Create fewer particles for even gentler effect
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Spread particles across top third of the screen width for a more focused effect
    confetti.style.left = `${30 + Math.random() * 40}%`;
    
    // Very small particles for extreme subtlety
    const size = Math.random() * 3 + 2;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Very light blue/white colors like subtle snowflakes
    confetti.style.background = `hsl(${210 + Math.random() * 10}, ${30 + Math.random() * 20}%, ${90 + Math.random() * 10}%)`;
    
    // Quicker fall speed for even shorter duration
    confetti.style.animationDuration = `${Math.random() * 1.5 + 0.8}s`;
    
    // Minimally staggered appearance
    confetti.style.animationDelay = `${Math.random() * 0.3}s`;
    
    // Very minimal rotation
    confetti.style.transform = `rotate(${Math.random() * 180}deg)`;
    
    // Very transparent particles
    confetti.style.opacity = `${Math.random() * 0.3 + 0.2}`;
    
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