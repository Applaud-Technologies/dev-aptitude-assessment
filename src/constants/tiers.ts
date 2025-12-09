/**
 * Tier System Constants
 *
 * This file contains tier definitions, thresholds, and classification rules
 * for the 5-tier ranking system (Novice to Expert).
 */

import { TierLevel, TierRank, TierDefinition, PerformanceClassification } from '../types/assessment.types';

/**
 * Tier definitions with thresholds and metadata
 */
export const TIER_DEFINITIONS: Record<TierLevel, TierDefinition> = {
  5: {
    level: 5,
    rank: 'Expert',
    minPercentage: 85,
    maxPercentage: 100,
    description: 'Exceptional aptitude, ready for complex challenges',
    color: '#FFD700', // Gold
  },
  4: {
    level: 4,
    rank: 'Advanced',
    minPercentage: 70,
    maxPercentage: 84,
    description: 'Strong aptitude, capable of independent work',
    color: '#C0C0C0', // Silver
  },
  3: {
    level: 3,
    rank: 'Intermediate',
    minPercentage: 55,
    maxPercentage: 69,
    description: 'Solid foundation, needs guidance on complex tasks',
    color: '#CD7F32', // Bronze
  },
  2: {
    level: 2,
    rank: 'Beginner',
    minPercentage: 40,
    maxPercentage: 54,
    description: 'Basic understanding, requires significant training',
    color: '#4169E1', // Blue
  },
  1: {
    level: 1,
    rank: 'Novice',
    minPercentage: 0,
    maxPercentage: 39,
    description: 'Foundational development needed',
    color: '#808080', // Gray
  },
};

/**
 * Performance classification thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  EXCEPTIONAL: { min: 85, max: 100 },
  STRENGTH: { min: 75, max: 84 },
  ADEQUATE: { min: 60, max: 74 },
  WEAKNESS: { min: 45, max: 59 },
  CRITICAL_WEAKNESS: { min: 0, max: 44 },
} as const;

/**
 * Get tier level from percentage score
 */
export function getTierFromPercentage(percentage: number): TierLevel {
  if (percentage >= 85) return 5;
  if (percentage >= 70) return 4;
  if (percentage >= 55) return 3;
  if (percentage >= 40) return 2;
  return 1;
}

/**
 * Get tier rank label from tier level
 */
export function getTierRank(tier: TierLevel): TierRank {
  return TIER_DEFINITIONS[tier].rank;
}

/**
 * Get tier definition
 */
export function getTierDefinition(tier: TierLevel): TierDefinition {
  return TIER_DEFINITIONS[tier];
}

/**
 * Get performance classification from percentage
 */
export function getPerformanceClassification(percentage: number): PerformanceClassification {
  if (percentage >= PERFORMANCE_THRESHOLDS.EXCEPTIONAL.min) return 'exceptional';
  if (percentage >= PERFORMANCE_THRESHOLDS.STRENGTH.min) return 'strength';
  if (percentage >= PERFORMANCE_THRESHOLDS.ADEQUATE.min) return 'adequate';
  if (percentage >= PERFORMANCE_THRESHOLDS.WEAKNESS.min) return 'weakness';
  return 'critical-weakness';
}

/**
 * Get next tier threshold
 */
export function getNextTierThreshold(currentTier: TierLevel): number | null {
  if (currentTier === 5) return null; // Already at max tier
  const nextTier = (currentTier + 1) as TierLevel;
  return TIER_DEFINITIONS[nextTier].minPercentage;
}

/**
 * Calculate distance to next tier
 */
export function getDistanceToNextTier(percentage: number, currentTier: TierLevel): number {
  const nextThreshold = getNextTierThreshold(currentTier);
  if (nextThreshold === null) return 0; // Already at max
  return Math.max(0, nextThreshold - percentage);
}

/**
 * Get tier color
 */
export function getTierColor(tier: TierLevel): string {
  return TIER_DEFINITIONS[tier].color;
}

/**
 * Get classification color
 */
export function getClassificationColor(classification: PerformanceClassification): string {
  const colors: Record<PerformanceClassification, string> = {
    'exceptional': '#22C55E',        // Green
    'strength': '#86EFAC',            // Light Green
    'adequate': '#FCD34D',            // Yellow
    'weakness': '#FB923C',            // Orange
    'critical-weakness': '#EF4444',  // Red
  };
  return colors[classification];
}

/**
 * Get classification icon
 */
export function getClassificationIcon(classification: PerformanceClassification): string {
  const icons: Record<PerformanceClassification, string> = {
    'exceptional': '⭐⭐⭐',
    'strength': '⭐⭐',
    'adequate': '⭐',
    'weakness': '⚠️',
    'critical-weakness': '🔴',
  };
  return icons[classification];
}

/**
 * Tier progression details
 */
export interface TierProgression {
  currentTier: TierLevel;
  currentRank: TierRank;
  currentPercentage: number;
  nextTier: TierLevel | null;
  nextRank: TierRank | null;
  nextThreshold: number | null;
  distanceToNext: number;
  progressPercentage: number; // Progress within current tier (0-100)
}

/**
 * Get detailed tier progression information
 */
export function getTierProgression(percentage: number): TierProgression {
  const currentTier = getTierFromPercentage(percentage);
  const currentDef = TIER_DEFINITIONS[currentTier];
  const nextTier = currentTier === 5 ? null : ((currentTier + 1) as TierLevel);
  const nextDef = nextTier ? TIER_DEFINITIONS[nextTier] : null;

  // Calculate progress within current tier
  const tierRange = currentDef.maxPercentage - currentDef.minPercentage;
  const progressInTier = percentage - currentDef.minPercentage;
  const progressPercentage = tierRange > 0 ? (progressInTier / tierRange) * 100 : 100;

  return {
    currentTier,
    currentRank: currentDef.rank,
    currentPercentage: percentage,
    nextTier,
    nextRank: nextDef?.rank || null,
    nextThreshold: nextDef?.minPercentage || null,
    distanceToNext: nextDef ? Math.max(0, nextDef.minPercentage - percentage) : 0,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
}

/**
 * Readiness level thresholds (for role suitability)
 */
export const READINESS_THRESHOLDS = {
  HIGH: 85,      // 85%+ = High readiness
  MEDIUM: 70,    // 70-84% = Medium readiness
  LOW: 0,        // <70% = Low readiness
} as const;

/**
 * Get readiness level from percentage
 */
export function getReadinessLevel(percentage: number): 'high' | 'medium' | 'low' {
  if (percentage >= READINESS_THRESHOLDS.HIGH) return 'high';
  if (percentage >= READINESS_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}
