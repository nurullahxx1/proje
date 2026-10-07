import confetti from 'canvas-confetti';

/**
 * Trigger standard confetti burst
 */
export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e11d48', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
    });
  } catch {
    // fallback if canvas not available
  }
};

/**
 * Trigger celebratory milestone cannons from both sides
 */
export const triggerSuperCelebration = () => {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#e11d48', '#f59e0b', '#10b981', '#6366f1', '#ec4899']
      });
    }, 300);
  } catch {
    // ignore
  }
};
