/**
 * Performance Analyzer
 *
 * This module analyzes assessment performance to identify:
 * - Strengths and weaknesses across categories
 * - Performance consistency
 * - Improvement potential
 * - Overall performance profile
 */

import {
  CategoryResult,
  CategorySummary,
  OverallResult,
  PerformanceClassification,
} from '../types/assessment.types';
import {
  PerformanceAnalysis,
  ConsistencyMetrics,
  PerformanceProfile,
  ProfileAnalysis,
} from '../types/analysis.types';
import { getPerformanceClassification, PERFORMANCE_THRESHOLDS } from '../constants/tiers';

/**
 * Analyze performance across all categories
 *
 * @param categoryResults - Category results to analyze
 * @param overall - Overall result
 * @returns Complete performance analysis
 */
export function analyzePerformance(
  categoryResults: CategoryResult[],
  overall: OverallResult
): PerformanceAnalysis {
  // Classify categories by performance level
  const classified = classifyCategories(categoryResults);

  // Calculate consistency metrics
  const consistency = calculateConsistency(categoryResults);

  // Determine improvement potential
  const improvementPotential = determineImprovementPotential(
    overall.percentage,
    consistency.consistencyScore
  );

  return {
    exceptional: classified.exceptional,
    strengths: classified.strengths,
    adequate: classified.adequate,
    weaknesses: classified.weaknesses,
    criticalWeaknesses: classified.criticalWeaknesses,
    consistencyScore: consistency.consistencyScore,
    improvementPotential,
  };
}

/**
 * Classify categories into performance levels
 */
function classifyCategories(categoryResults: CategoryResult[]): {
  exceptional: CategorySummary[];
  strengths: CategorySummary[];
  adequate: CategorySummary[];
  weaknesses: CategorySummary[];
  criticalWeaknesses: CategorySummary[];
} {
  const exceptional: CategorySummary[] = [];
  const strengths: CategorySummary[] = [];
  const adequate: CategorySummary[] = [];
  const weaknesses: CategorySummary[] = [];
  const criticalWeaknesses: CategorySummary[] = [];

  for (const category of categoryResults) {
    const summary: CategorySummary = {
      name: category.name,
      percentage: category.percentage,
      tier: category.tier,
      questionCount: category.questionCount,
    };

    const classification = getPerformanceClassification(category.percentage);

    switch (classification) {
      case 'exceptional':
        exceptional.push(summary);
        break;
      case 'strength':
        strengths.push(summary);
        break;
      case 'adequate':
        adequate.push(summary);
        break;
      case 'weakness':
        weaknesses.push(summary);
        break;
      case 'critical-weakness':
        criticalWeaknesses.push(summary);
        break;
    }
  }

  // Sort each group by percentage (descending)
  const sorter = (a: CategorySummary, b: CategorySummary) => b.percentage - a.percentage;
  exceptional.sort(sorter);
  strengths.sort(sorter);
  adequate.sort(sorter);
  weaknesses.sort(sorter);
  criticalWeaknesses.sort(sorter);

  return {
    exceptional,
    strengths,
    adequate,
    weaknesses,
    criticalWeaknesses,
  };
}

/**
 * Calculate consistency metrics
 */
export function calculateConsistency(categoryResults: CategoryResult[]): ConsistencyMetrics {
  if (categoryResults.length === 0) {
    return {
      mean: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      range: 0,
      consistencyScore: 0,
    };
  }

  const scores = categoryResults.map(cat => cat.percentage);

  // Calculate mean
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Calculate standard deviation
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate coefficient of variation
  const coefficientOfVariation = mean !== 0 ? (standardDeviation / mean) * 100 : 0;

  // Calculate range
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;

  // Calculate consistency score (0-100, higher = more consistent)
  // Lower coefficient of variation = higher consistency
  // Map CV of 0-50% to consistency score of 100-0
  const consistencyScore = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 2)));

  return {
    mean,
    standardDeviation,
    coefficientOfVariation,
    range,
    consistencyScore,
  };
}

/**
 * Determine improvement potential
 */
function determineImprovementPotential(
  overallScore: number,
  consistencyScore: number
): 'high' | 'medium' | 'low' {
  // High potential: Low score but high consistency (can improve across the board)
  // Medium potential: Mixed performance or medium score
  // Low potential: High score already, or very inconsistent

  if (overallScore >= 85) {
    return 'low'; // Already at expert level
  }

  if (overallScore < 60 && consistencyScore > 70) {
    return 'high'; // Low score but consistent - can improve all areas
  }

  if (overallScore < 70 || consistencyScore < 50) {
    return 'high'; // Either low score or very inconsistent
  }

  return 'medium';
}

/**
 * Identify performance profile
 */
export function identifyProfile(
  overall: OverallResult,
  analysis: PerformanceAnalysis
): ProfileAnalysis {
  const score = overall.percentage;
  const exceptional = analysis.exceptional.length;
  const weaknesses = analysis.weaknesses.length + analysis.criticalWeaknesses.length;
  const variance = exceptional + weaknesses;

  let profile: PerformanceProfile;
  let description: string;
  let characteristics: string[];
  let approach: string;

  if (score >= 85 && exceptional >= 5) {
    profile = 'high-performer';
    description = 'Exceptional overall performance with strong skills across most areas';
    characteristics = [
      'Consistently high scores',
      'Demonstrates mastery in multiple categories',
      'Ready for advanced challenges',
    ];
    approach = 'Focus on technology-specific skills and practical application';
  } else if (score >= 70 && score < 85 && variance <= 2) {
    profile = 'balanced';
    description = 'Well-rounded performance with solid capabilities across all areas';
    characteristics = [
      'Even performance distribution',
      'No major weaknesses',
      'Steady, reliable skills',
    ];
    approach = 'Build on existing foundation with structured learning';
  } else if (variance >= 4) {
    profile = 'specialist';
    description = 'High variance with clear strengths and areas needing development';
    characteristics = [
      'Exceptional in some areas',
      'Struggles in others',
      'Uneven skill distribution',
    ];
    approach = 'Focus on strengthening weak areas while leveraging strengths';
  } else if (score >= 55 && score < 70) {
    profile = 'developing';
    description = 'Solid foundation with room for significant growth';
    characteristics = [
      'Moderate performance',
      'Clear improvement potential',
      'Needs structured development',
    ];
    approach = 'Systematic training program targeting weak areas';
  } else {
    profile = 'early-stage';
    description = 'Foundational skills need development';
    characteristics = [
      'Below threshold in most areas',
      'Requires intensive training',
      'Consider alternative paths',
    ];
    approach = 'Comprehensive foundational training or explore alternative roles';
  }

  return {
    profile,
    description,
    characteristics,
    approach,
  };
}

/**
 * Get detailed insights for each category
 */
export interface CategoryInsight {
  category: string;
  percentage: number;
  classification: PerformanceClassification;
  insight: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Generate insights for each category
 */
export function generateCategoryInsights(
  categoryResults: CategoryResult[]
): CategoryInsight[] {
  return categoryResults.map(category => {
    const classification = getPerformanceClassification(category.percentage);
    let insight: string;
    let recommendation: string;
    let priority: 'critical' | 'high' | 'medium' | 'low';

    if (classification === 'exceptional') {
      insight = `Outstanding performance in ${category.name}`;
      recommendation = 'Leverage this strength in career planning';
      priority = 'low';
    } else if (classification === 'strength') {
      insight = `Strong capability in ${category.name}`;
      recommendation = 'Continue practicing to reach exceptional level';
      priority = 'medium';
    } else if (classification === 'adequate') {
      insight = `Adequate performance in ${category.name}`;
      recommendation = 'Focus on improvement to reach strength level';
      priority = 'medium';
    } else if (classification === 'weakness') {
      insight = `Needs improvement in ${category.name}`;
      recommendation = 'Dedicate study time to strengthen this area';
      priority = 'high';
    } else {
      insight = `Critical weakness in ${category.name}`;
      recommendation = 'Urgent: This requires intensive focused practice';
      priority = 'critical';
    }

    return {
      category: category.name,
      percentage: category.percentage,
      classification,
      insight,
      recommendation,
      priority,
    };
  });
}

/**
 * Calculate score needed to reach next tier
 */
export interface TierGoal {
  currentTier: number;
  currentScore: number;
  nextTier: number;
  nextTierThreshold: number;
  pointsNeeded: number;
  categoriesNeedingImprovement: Array<{
    category: string;
    currentScore: number;
    targetScore: number;
    impact: number;
  }>;
}

/**
 * Calculate what's needed to reach the next tier
 */
export function calculateTierGoal(
  overall: OverallResult,
  categoryResults: CategoryResult[]
): TierGoal | null {
  if (overall.tier === 5) {
    return null; // Already at max tier
  }

  const currentTier = overall.tier;
  const currentScore = overall.percentage;
  const nextTier = (currentTier + 1) as 1 | 2 | 3 | 4 | 5;

  // Determine next tier threshold
  const thresholds: Record<number, number> = {
    2: 40,
    3: 55,
    4: 70,
    5: 85,
  };

  const nextTierThreshold = thresholds[nextTier];
  const pointsNeeded = nextTierThreshold - currentScore;

  // Find categories that would have biggest impact if improved
  const categoriesNeedingImprovement = categoryResults
    .filter(cat => cat.percentage < 75) // Focus on non-strength categories
    .map(cat => {
      const targetScore = Math.min(cat.percentage + 15, 85); // Aim for +15 or 85%
      const improvement = targetScore - cat.percentage;
      const impact = (improvement * cat.totalWeight) / categoryResults.reduce((sum, c) => sum + c.totalWeight, 0);

      return {
        category: cat.name,
        currentScore: cat.percentage,
        targetScore,
        impact,
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3); // Top 3 highest impact

  return {
    currentTier,
    currentScore,
    nextTier,
    nextTierThreshold,
    pointsNeeded,
    categoriesNeedingImprovement,
  };
}

/**
 * Get summary statistics
 */
export interface PerformanceSummary {
  overallScore: number;
  tier: number;
  rank: string;
  topCategory: { name: string; score: number };
  bottomCategory: { name: string; score: number };
  averageCategoryScore: number;
  consistencyScore: number;
  improvementPotential: string;
}

/**
 * Generate performance summary
 */
export function generatePerformanceSummary(
  overall: OverallResult,
  categoryResults: CategoryResult[],
  analysis: PerformanceAnalysis
): PerformanceSummary {
  const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
  const averageCategoryScore = categoryResults.reduce((sum, cat) => sum + cat.percentage, 0) / categoryResults.length;

  return {
    overallScore: overall.percentage,
    tier: overall.tier,
    rank: overall.rank,
    topCategory: {
      name: sorted[0].name,
      score: sorted[0].percentage,
    },
    bottomCategory: {
      name: sorted[sorted.length - 1].name,
      score: sorted[sorted.length - 1].percentage,
    },
    averageCategoryScore,
    consistencyScore: analysis.consistencyScore,
    improvementPotential: analysis.improvementPotential,
  };
}
