/**
 * Category Scorer
 *
 * This module aggregates question results by category and calculates
 * category-level scores, including weighted contributions.
 */

import {
  CategoryResult,
  QuestionResult,
  CategoryName,
  PerformanceClassification,
} from '../types/assessment.types';
import { getCategoryCode } from '../constants/categories';
import { getTierFromPercentage, getTierRank, getPerformanceClassification } from '../constants/tiers';

/**
 * Group question results by category
 */
export function groupByCategory(
  questionResults: QuestionResult[]
): Map<CategoryName, QuestionResult[]> {
  const categoryMap = new Map<CategoryName, QuestionResult[]>();

  for (const result of questionResults) {
    const existing = categoryMap.get(result.category) || [];
    existing.push(result);
    categoryMap.set(result.category, existing);
  }

  return categoryMap;
}

/**
 * Calculate category score from question results
 *
 * @param category - Category name
 * @param questionResults - Results for questions in this category
 * @returns CategoryResult with all scoring details
 */
export function scoreCategoryFromResults(
  category: CategoryName,
  questionResults: QuestionResult[]
): CategoryResult {
  // Calculate totals
  const earnedPoints = questionResults.reduce((sum, r) => sum + r.earnedPoints, 0);
  const maxPoints = questionResults.reduce((sum, r) => sum + r.maxPoints, 0);
  const totalWeight = questionResults.reduce((sum, r) => sum + r.weight, 0);

  // Calculate percentage
  const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;

  // Get tier and classification
  const tier = getTierFromPercentage(percentage);
  const rank = getTierRank(tier);
  const classification = getPerformanceClassification(percentage);

  // Count question types
  let correctCount = 0;
  let partialCreditCount = 0;
  let incorrectCount = 0;

  for (const result of questionResults) {
    if (result.isCorrect) {
      correctCount++;
    } else if (result.isPartialCredit) {
      partialCreditCount++;
    } else {
      incorrectCount++;
    }
  }

  // Get question IDs
  const questions = questionResults.map(r => r.questionId);

  return {
    name: category,
    code: getCategoryCode(category),
    earnedPoints,
    maxPoints,
    percentage,
    totalWeight,
    weightedContribution: 0, // Will be calculated later in overall scoring
    tier,
    rank,
    classification,
    questionCount: questionResults.length,
    correctCount,
    partialCreditCount,
    incorrectCount,
    questions,
  };
}

/**
 * Score all categories from question results
 *
 * @param questionResults - All question results
 * @returns Array of CategoryResults
 */
export function scoreCategories(questionResults: QuestionResult[]): CategoryResult[] {
  const categoryMap = groupByCategory(questionResults);
  const categoryResults: CategoryResult[] = [];

  for (const [category, results] of categoryMap.entries()) {
    categoryResults.push(scoreCategoryFromResults(category, results));
  }

  // Sort by category name for consistent ordering
  categoryResults.sort((a, b) => a.name.localeCompare(b.name));

  return categoryResults;
}

/**
 * Calculate weighted contributions for categories
 *
 * This updates the weightedContribution field for each category,
 * showing how much each category contributes to the overall score.
 *
 * Formula:
 * Weighted Score = Category % × Category Weight
 * Total Weight = Sum of all category weights
 * Contribution = Weighted Score / Total Weight
 *
 * @param categoryResults - Array of category results
 * @returns Updated array with weighted contributions calculated
 */
export function calculateWeightedContributions(
  categoryResults: CategoryResult[]
): CategoryResult[] {
  // Calculate total weight across all categories
  const totalWeight = categoryResults.reduce((sum, cat) => sum + cat.totalWeight, 0);

  if (totalWeight === 0) {
    return categoryResults;
  }

  // Calculate weighted contribution for each category
  return categoryResults.map(category => {
    const weightedScore = category.percentage * category.totalWeight;
    const weightedContribution = weightedScore / totalWeight;

    return {
      ...category,
      weightedContribution,
    };
  });
}

/**
 * Get category statistics
 */
export function getCategoryStats(categoryResults: CategoryResult[]): {
  totalCategories: number;
  averageScore: number;
  highestScore: { category: CategoryName; score: number };
  lowestScore: { category: CategoryName; score: number };
  totalQuestions: number;
  totalWeight: number;
} {
  if (categoryResults.length === 0) {
    return {
      totalCategories: 0,
      averageScore: 0,
      highestScore: { category: 'Pattern Recognition & Sequences', score: 0 },
      lowestScore: { category: 'Pattern Recognition & Sequences', score: 0 },
      totalQuestions: 0,
      totalWeight: 0,
    };
  }

  const totalCategories = categoryResults.length;
  const averageScore = categoryResults.reduce((sum, cat) => sum + cat.percentage, 0) / totalCategories;

  const sortedByScore = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
  const highestScore = {
    category: sortedByScore[0].name,
    score: sortedByScore[0].percentage,
  };
  const lowestScore = {
    category: sortedByScore[sortedByScore.length - 1].name,
    score: sortedByScore[sortedByScore.length - 1].percentage,
  };

  const totalQuestions = categoryResults.reduce((sum, cat) => sum + cat.questionCount, 0);
  const totalWeight = categoryResults.reduce((sum, cat) => sum + cat.totalWeight, 0);

  return {
    totalCategories,
    averageScore,
    highestScore,
    lowestScore,
    totalQuestions,
    totalWeight,
  };
}

/**
 * Filter categories by performance classification
 */
export function filterByClassification(
  categoryResults: CategoryResult[],
  classification: PerformanceClassification
): CategoryResult[] {
  return categoryResults.filter(cat => cat.classification === classification);
}

/**
 * Get categories sorted by score (descending)
 */
export function sortByScore(
  categoryResults: CategoryResult[],
  ascending: boolean = false
): CategoryResult[] {
  const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
  return ascending ? sorted.reverse() : sorted;
}

/**
 * Get top N performing categories
 */
export function getTopCategories(
  categoryResults: CategoryResult[],
  n: number
): CategoryResult[] {
  return sortByScore(categoryResults).slice(0, n);
}

/**
 * Get bottom N performing categories
 */
export function getBottomCategories(
  categoryResults: CategoryResult[],
  n: number
): CategoryResult[] {
  return sortByScore(categoryResults, true).slice(0, n);
}

/**
 * Find category by name
 */
export function findCategory(
  categoryResults: CategoryResult[],
  categoryName: CategoryName
): CategoryResult | undefined {
  return categoryResults.find(cat => cat.name === categoryName);
}

/**
 * Calculate variance across categories
 *
 * Useful for measuring consistency of performance
 */
export function calculateCategoryVariance(categoryResults: CategoryResult[]): {
  mean: number;
  variance: number;
  standardDeviation: number;
  coefficientOfVariation: number;
} {
  if (categoryResults.length === 0) {
    return { mean: 0, variance: 0, standardDeviation: 0, coefficientOfVariation: 0 };
  }

  // Calculate mean
  const mean = categoryResults.reduce((sum, cat) => sum + cat.percentage, 0) / categoryResults.length;

  // Calculate variance
  const squaredDifferences = categoryResults.map(cat => Math.pow(cat.percentage - mean, 2));
  const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / categoryResults.length;

  // Calculate standard deviation
  const standardDeviation = Math.sqrt(variance);

  // Calculate coefficient of variation (relative variability)
  const coefficientOfVariation = mean !== 0 ? (standardDeviation / mean) * 100 : 0;

  return {
    mean,
    variance,
    standardDeviation,
    coefficientOfVariation,
  };
}
