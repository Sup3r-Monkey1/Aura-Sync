import type { ReadinessScore } from '../types';

/**
 * Neural Readiness Engine
 * Calculates a 0-100% "Neural Latency" score from:
 *   - HRV (Heart Rate Variability, ms) — 40% weight
 *   - Sleep hours (0-10+) — 30% weight
 *   - Weekly cumulative strain (arbitrary volume units) — 30% weight
 */

const HRV_MIN = 20;   // worst-case HRV (ms)
const HRV_MAX = 100;   // elite HRV
const SLEEP_OPTIMAL = 8;
const STRAIN_EASY = 5000;   // weekly volume below this = fully recovered
const STRAIN_HARD = 40000;  // weekly volume above this = crushed

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function normalize(v: number, min: number, max: number) {
  return clamp((v - min) / (max - min), 0, 1);
}

export function calculateReadiness(
  hrv: number,
  sleepHours: number,
  weeklyStrain: number
): ReadinessScore {
  // Individual sub-scores (0-1)
  const hrvScore = normalize(hrv, HRV_MIN, HRV_MAX);

  // Sleep: peaks at SLEEP_OPTIMAL, drops off for under- and oversleep
  const sleepDelta = Math.abs(sleepHours - SLEEP_OPTIMAL);
  const sleepScore = clamp(1 - sleepDelta / SLEEP_OPTIMAL, 0, 1);

  // Strain: inverse — more strain = lower score
  const strainScore = 1 - normalize(weeklyStrain, STRAIN_EASY, STRAIN_HARD);

  // Weighted blend
  const raw = hrvScore * 0.40 + sleepScore * 0.30 + strainScore * 0.30;
  const score = Math.round(raw * 100);

  // Zone thresholds
  let zone: ReadinessScore['zone'];
  if (score >= 85) zone = 'PEAK';
  else if (score >= 70) zone = 'PRIMED';
  else if (score >= 50) zone = 'MODERATE';
  else if (score >= 30) zone = 'FATIGUED';
  else zone = 'CRITICAL';

  return { score, zone, hrv, sleepHours, weeklyStrain };
}

export function getZoneColor(zone: ReadinessScore['zone']): string {
  switch (zone) {
    case 'PEAK': return '#00ff88';
    case 'PRIMED': return '#3b82f6';
    case 'MODERATE': return '#f59e0b';
    case 'FATIGUED': return '#f97316';
    case 'CRITICAL': return '#ef4444';
  }
}

export function getZoneLabel(zone: ReadinessScore['zone']): string {
  switch (zone) {
    case 'PEAK': return 'Neural Peak — Push hard today';
    case 'PRIMED': return 'Primed — Solid session ahead';
    case 'MODERATE': return 'Moderate — Stick to volume';
    case 'FATIGUED': return 'Fatigued — Consider deload';
    case 'CRITICAL': return 'Critical — Active recovery only';
  }
}

/** Simulate daily HRV with some variance */
export function simulateHRV(): number {
  const base = 55 + Math.random() * 30; // 55-85 range
  return Math.round(base);
}

/** Simulate sleep based on time of day */
export function simulateSleep(): number {
  return parseFloat((5.5 + Math.random() * 3.5).toFixed(1)); // 5.5-9.0
}
