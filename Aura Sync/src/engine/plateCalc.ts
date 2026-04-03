/**
 * Plate Calculator for EOS Gym
 *
 * Converts a total barbell weight into exact plates per side.
 * Standard Olympic barbell = 45 lbs.
 * Available plates: 45, 35, 25, 10, 5, 2.5 lbs
 *
 * Example: 225 lbs → Bar (45) + 2×45 per side = "Two 45s each side"
 */

const BAR_WEIGHT = 45;
const PLATES = [45, 35, 25, 10, 5, 2.5];

export interface PlateBreakdown {
  barWeight: number;
  totalWeight: number;
  perSide: { plate: number; count: number }[];
  isValid: boolean;
  remainder: number;
}

export function calculatePlates(totalWeight: number): PlateBreakdown {
  if (totalWeight <= BAR_WEIGHT) {
    return {
      barWeight: BAR_WEIGHT,
      totalWeight: Math.max(totalWeight, BAR_WEIGHT),
      perSide: [],
      isValid: totalWeight >= BAR_WEIGHT,
      remainder: 0,
    };
  }

  let weightPerSide = (totalWeight - BAR_WEIGHT) / 2;
  const perSide: { plate: number; count: number }[] = [];

  for (const plate of PLATES) {
    if (weightPerSide >= plate) {
      const count = Math.floor(weightPerSide / plate);
      perSide.push({ plate, count });
      weightPerSide -= count * plate;
    }
  }

  // Round to handle floating point
  const remainder = Math.round(weightPerSide * 10) / 10;

  return {
    barWeight: BAR_WEIGHT,
    totalWeight,
    perSide,
    isValid: remainder === 0,
    remainder,
  };
}

/** Format plate breakdown as readable text */
export function formatPlates(breakdown: PlateBreakdown): string {
  if (breakdown.perSide.length === 0) return 'Empty bar (45 lbs)';

  return breakdown.perSide
    .map(p => `${p.count}×${p.plate}`)
    .join(' + ')
    + ' per side';
}

/** Get plate color for visual display */
export function getPlateColor(weight: number): string {
  switch (weight) {
    case 45: return '#2563eb';   // cobalt blue
    case 35: return '#eab308';   // yellow
    case 25: return '#22c55e';   // green
    case 10: return '#f97316';   // orange
    case 5: return '#a855f7';    // purple
    case 2.5: return '#6b7280';  // gray
    default: return '#ffffff';
  }
}
