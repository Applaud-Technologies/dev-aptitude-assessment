/**
 * Type Definitions for Performance Analysis
 *
 * This file contains TypeScript interfaces for analyzing assessment performance,
 * identifying strengths and weaknesses, and calculating consistency metrics.
 */

import { CategoryName, CategorySummary, TierLevel, PerformanceClassification } from './assessment.types';

// ============================================================================
// Classification Types
// ============================================================================

/**
 * Classification thresholds for performance levels
 */
export interface ClassificationThresholds {
  exceptional: { min: number; max: number };    // 85-100
  strength: { min: number; max: number };        // 75-84
  adequate: { min: number; max: number };        // 60-74
  weakness: { min: number; max: number };        // 45-59
  criticalWeakness: { min: number; max: number };// 0-44
}

/**
 * Default classification thresholds
 */
export const DEFAULT_CLASSIFICATION_THRESHOLDS: ClassificationThresholds = {
  exceptional: { min: 85, max: 100 },
  strength: { min: 75, max: 84 },
  adequate: { min: 60, max: 74 },
  weakness: { min: 45, max: 59 },
  criticalWeakness: { min: 0, max: 44 },
};

// ============================================================================
// Performance Analysis
// ============================================================================

/**
 * Detailed performance analysis across all categories
 */
export interface PerformanceAnalysis {
  /** Categories scoring 85-100% */
  exceptional: CategorySummary[];

  /** Categories scoring 75-84% */
  strengths: CategorySummary[];

  /** Categories scoring 60-74% */
  adequate: CategorySummary[];

  /** Categories scoring 45-59% */
  weaknesses: CategorySummary[];

  /** Categories scoring 0-44% */
  criticalWeaknesses: CategorySummary[];

  /** Consistency score (0-100) - measures variance across categories */
  consistencyScore: number;

  /** Improvement potential rating */
  improvementPotential: 'high' | 'medium' | 'low';

  /** Percentile ranking (optional - compared to other users) */
  percentile?: number;

  /** Average score across all test-takers (optional) */
  averageScore?: number;
}

/**
 * Extended category summary with additional analysis data
 */
export interface CategoryAnalysis extends CategorySummary {
  /** Performance classification */
  classification: PerformanceClassification;

  /** Distance from next tier (percentage points) */
  distanceToNextTier: number;

  /** Whether this is a standout category */
  isStandout: boolean;

  /** Variance from overall average */
  varianceFromAverage: number;
}

// ============================================================================
// Consistency Analysis
// ============================================================================

/**
 * Statistical measures of performance consistency
 */
export interface ConsistencyMetrics {
  /** Mean score across all categories */
  mean: number;

  /** Standard deviation of category scores */
  standardDeviation: number;

  /** Coefficient of variation (SD / mean) */
  coefficientOfVariation: number;

  /** Range (max - min) */
  range: number;

  /** Consistency score (0-100, higher = more consistent) */
  consistencyScore: number;
}

// ============================================================================
// Profile Types
// ============================================================================

/**
 * Performance profile type based on score patterns
 */
export type PerformanceProfile =
  | 'high-performer'      // 85%+ overall, most categories 75%+
  | 'balanced'            // 70-84% overall, even distribution
  | 'specialist'          // High variance - some 85%+, some <60%
  | 'developing'          // 55-69% overall
  | 'early-stage';        // <55% overall

/**
 * Profile analysis with characteristics
 */
export interface ProfileAnalysis {
  /** Profile type */
  profile: PerformanceProfile;

  /** Profile description */
  description: string;

  /** Key characteristics */
  characteristics: string[];

  /** Recommended approach */
  approach: string;
}

// ============================================================================
// Comparative Analysis
// ============================================================================

/**
 * Comparison to benchmark or other users
 */
export interface ComparativeAnalysis {
  /** User's overall score */
  userScore: number;

  /** Benchmark/average score */
  benchmarkScore: number;

  /** Difference from benchmark */
  difference: number;

  /** Percentile rank (0-100) */
  percentile: number;

  /** Performance relative to benchmark */
  relativePerformance: 'above-average' | 'average' | 'below-average';

  /** Category-by-category comparison */
  categoryComparisons: CategoryComparison[];
}

/**
 * Comparison for a single category
 */
export interface CategoryComparison {
  /** Category name */
  category: CategoryName;

  /** User's score */
  userScore: number;

  /** Benchmark score */
  benchmarkScore: number;

  /** Difference */
  difference: number;

  /** Relative performance */
  relativePerformance: 'above-average' | 'average' | 'below-average';
}

// ============================================================================
// Improvement Analysis
// ============================================================================

/**
 * Analysis of improvement potential
 */
export interface ImprovementAnalysis {
  /** Overall improvement potential */
  potential: 'high' | 'medium' | 'low';

  /** Categories with high improvement potential */
  highPotentialCategories: CategoryImprovement[];

  /** Categories with medium improvement potential */
  mediumPotentialCategories: CategoryImprovement[];

  /** Estimated score increase with targeted improvement */
  estimatedGain: number;

  /** Priority improvements for maximum impact */
  priorityImprovements: string[];
}

/**
 * Improvement potential for a category
 */
export interface CategoryImprovement {
  /** Category name */
  category: CategoryName;

  /** Current score */
  currentScore: number;

  /** Target score (next tier) */
  targetScore: number;

  /** Points needed to reach target */
  pointsNeeded: number;

  /** Impact on overall score if target reached */
  overallImpact: number;

  /** Estimated effort */
  effort: 'low' | 'medium' | 'high';
}
