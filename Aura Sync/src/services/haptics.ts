/**
 * Haptic Feedback Controller
 *
 * Triggers specific vibration patterns via the Web Vibration API
 * or Capacitor Haptics when available.
 */

function vibrate(pattern: number | number[]): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail on unsupported platforms
  }
}

/** Set completed — short double pulse */
export function hapticSetComplete(): void {
  vibrate([50, 30, 50]);
}

/** Personal Record — triumphant long buzz */
export function hapticPR(): void {
  vibrate([100, 50, 100, 50, 200]);
}

/** Rest timer finished — short-short-long pattern */
export function hapticRestDone(): void {
  vibrate([60, 40, 60, 40, 150]);
}

/** Error / warning — single long buzz */
export function hapticError(): void {
  vibrate([300]);
}

/** Light tap for button interactions */
export function hapticTap(): void {
  vibrate(10);
}
