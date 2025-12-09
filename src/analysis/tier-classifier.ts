/**
 * Tier Classifier
 *
 * This module provides utilities for classifying scores into tiers
 * and performance levels.
 */

import {
  TierLevel,
  TierRank,
  TierDefinition,
  PerformanceClassification,
  CategoryResult,
} from '../types/assessment.types';
import {
  TIER_DEFINITIONS,
  getTierFromPercentage,
  getTierRank,
  getTierDefinition,
  getPerformanceClassification,
  getTierProgression,
  TierProgression,
} from '../constants/tiers';

/**
 * Classify a single score
 */
export interface ScoreClassification {
  percentage: number;
  tier: TierLevel;
  rank: TierRank;
  classification: PerformanceClassification;
  tierDefinition: TierDefinition;
  progression: TierProgression;
}

/**
 * Classify a score into tier and performance level
 *
 * @param percentage - Score percentage (0-100)
 * @returns Complete classification with tier and performance details
 */
export function classifyScore(percentage: number): ScoreClassification {
  const tier = getTierFromPercentage(percentage);
  const rank = getTierRank(tier);
  const classification = getPerformanceClassification(percentage);
  const tierDefinition = getTierDefinition(tier);
  const progression = getTierProgression(percentage);

  return {
    percentage,
    tier,
    rank,
    classification,
    tierDefinition,
    progression,
  };
}

/**
 * Classify multiple scores at once
 */
export function classifyScores(percentages: number[]): ScoreClassification[] {
  return percentages.map(classifyScore);
}

/**
 * Get tier distribution for a set of scores
 */
export interface TierDistribution {
  [key: number]: {
    tier: TierLevel;
    rank: TierRank;
    count: number;
    percentage: number;
  };
}

/**
 * Calculate tier distribution across multiple scores
 *
 * @param percentages - Array of score percentages
 * @returns Distribution showing count and percentage in each tier
 */
export function getTierDistribution(percentages: number[]): TierDistribution {
  const distribution: TierDistribution = {
    1: { tier: 1, rank: 'Novice', count: 0, percentage: 0 },
    2: { tier: 2, rank: 'Beginner', count: 0, percentage: 0 },
    3: { tier: 3, rank: 'Intermediate', count: 0, percentage: 0 },
    4: { tier: 4, rank: 'Advanced', count: 0, percentage: 0 },
    5: { tier: 5, rank: 'Expert', count: 0, percentage: 0 },
  };

  // Count scores in each tier
  for (const score of percentages) {
    const tier = getTierFromPercentage(score);
    distribution[tier].count++;
  }

  // Calculate percentages
  const total = percentages.length;
  if (total > 0) {
    for (const tier of [1, 2, 3, 4, 5] as TierLevel[]) {
      distribution[tier].percentage = (distribution[tier].count / total) * 100;
    }
  }

  return distribution;
}

/**
 * Get performance classification distribution
 */
export interface ClassificationDistribution {
  exceptional: { count: number; percentage: number };
  strength: { count: number; percentage: number };
  adequate: { count: number; percentage: number };
  weakness: { count: number; percentage: number };
  criticalWeakness: { count: number; percentage: number };
}

/**
 * Calculate performance classification distribution
 *
 * @param percentages - Array of score percentages
 * @returns Distribution showing count and percentage in each classification
 */
export function getClassificationDistribution(
  percentages: number[]
): ClassificationDistribution {
  const distribution: ClassificationDistribution = {
    exceptional: { count: 0, percentage: 0 },
    strength: { count: 0, percentage: 0 },
    adequate: { count: 0, percentage: 0 },
    weakness: { count: 0, percentage: 0 },
    criticalWeakness: { count: 0, percentage: 0 },
  };

  // Count scores in each classification
  for (const score of percentages) {
    const classification = getPerformanceClassification(score);
    distribution[classification].count++;
  }

  // Calculate percentages
  const total = percentages.length;
  if (total > 0) {
    for (const key of Object.keys(distribution) as PerformanceClassification[]) {
      distribution[key].percentage = (distribution[key].count / total) * 100;
    }
  }

  return distribution;
}

/**
 * Compare two scores
 */
export interface ScoreComparison {
  score1: number;
  score2: number;
  difference: number;
  percentChange: number;
  tier1: TierLevel;
  tier2: TierLevel;
  tierChange: number;
  improved: boolean;
  tierUpgrade: boolean;
}

/**
 * Compare two scores
 *
 * Useful for tracking progress over time
 *
 * @param score1 - First score (e.g., previous attempt)
 * @param score2 - Second score (e.g., current attempt)
 * @returns Comparison details
 */
export function compareScores(score1: number, score2: number): ScoreComparison {
  const difference = score2 - score1;
  const percentChange = score1 !== 0 ? (difference / score1) * 100 : 0;
  const tier1 = getTierFromPercentage(score1);
  const tier2 = getTierFromPercentage(score2);
  const tierChange = tier2 - tier1;

  return {
    score1,
    score2,
    difference,
    percentChange,
    tier1,
    tier2,
    tierChange,
    improved: difference > 0,
    tierUpgrade: tierChange > 0,
  };
}

/**
 * Get recommendations based on tier
 */
export interface TierRecommendations {
  tier: TierLevel;
  rank: TierRank;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  timeline: string;
}

/**
 * Get recommended actions based on tier
 *
 * @param tier - Current tier level
 * @returns Recommendations for this tier
 */
export function getTierRecommendations(tier: TierLevel): TierRecommendations {
  const recommendations: Record<TierLevel, TierRecommendations> = {
    5: {
      tier: 5,
      rank: 'Expert',
      strengths: [
        'Exceptional problem-solving abilities',
        'Ready for complex technical challenges',
        'Strong potential for leadership roles',
      ],
      improvements: [
        'Maintain skills through continuous practice',
        'Consider mentoring others',
      ],
      nextSteps: [
        'Begin practical coding training immediately',
        'Consider accelerated learning track',
        'Focus on technology-specific skills',
        'Pair with senior mentor for rapid growth',
      ],
      timeline: 'Ready to start within 3-6 months with intensive training',
    },
    4: {
      tier: 4,
      rank: 'Advanced',
      strengths: [
        'Strong cognitive foundation',
        'Capable of independent work',
        'Good problem-solving skills',
      ],
      improvements: [
        'Focus on areas scoring below 75%',
        'Practice complex problem-solving',
      ],
      nextSteps: [
        'Start structured development training',
        'Focus on practical application',
        'Build portfolio projects',
        'Join peer learning groups',
      ],
      timeline: 'Ready for entry-level role in 6-12 months',
    },
    3: {
      tier: 3,
      rank: 'Intermediate',
      strengths: [
        'Solid foundational skills',
        'Demonstrates learning potential',
      ],
      improvements: [
        'Strengthen weak categories (< 60%)',
        'Build consistency across all areas',
        'Increase practice time',
      ],
      nextSteps: [
        'Complete structured training program',
        'Focus on foundational concepts',
        'Practice regularly with guided exercises',
        'Seek mentorship',
      ],
      timeline: 'Ready for junior role in 12-18 months with dedicated learning',
    },
    2: {
      tier: 2,
      rank: 'Beginner',
      strengths: [
        'Shows basic understanding',
        'Has potential for growth',
      ],
      improvements: [
        'Build strong foundations in all categories',
        'Dedicate significant study time',
        'Consider prerequisite courses',
      ],
      nextSteps: [
        'Complete intensive foundational training',
        'Work with mentor or instructor',
        'Practice daily with structured curriculum',
        'Consider bootcamp or intensive program',
      ],
      timeline: '18+ months with intensive training and mentorship',
    },
    1: {
      tier: 1,
      rank: 'Novice',
      strengths: [
        'Has taken first step in assessment',
      ],
      improvements: [
        'Develop fundamental problem-solving skills',
        'Consider if development is the right path',
        'Explore alternative IT roles',
      ],
      nextSteps: [
        'Complete comprehensive prerequisite training',
        'Assess fit for development career',
        'Consider alternative paths (PM, BA, Support)',
        'Re-assess after 6 months of training',
      ],
      timeline: '24+ months, or consider alternative career paths',
    },
  };

  return recommendations[tier];
}

/**
 * Batch classify categories
 */
export function classifyCategories(
  categories: CategoryResult[]
): Map<PerformanceClassification, CategoryResult[]> {
  const classified = new Map<PerformanceClassification, CategoryResult[]>();

  for (const category of categories) {
    const classification = category.classification;
    const existing = classified.get(classification) || [];
    existing.push(category);
    classified.set(classification, existing);
  }

  return classified;
}
