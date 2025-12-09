/**
 * Overall Scorer
 *
 * This module orchestrates the complete assessment scoring process:
 * 1. Score individual questions
 * 2. Aggregate by category
 * 3. Calculate weighted overall score
 * 4. Generate complete assessment result
 */

import {
  AssessmentInput,
  AssessmentResult,
  OverallResult,
  CategoryResult,
  QuestionResult,
  ScoringOptions,
  AssessmentMetadata,
} from '../types/assessment.types';
import { scoreQuestions, calculateTotalPoints } from './question-scorer';
import {
  scoreCategories,
  calculateWeightedContributions,
} from './category-scorer';
import { getTierFromPercentage, getTierRank } from '../constants/tiers';

/**
 * Calculate overall score from category results
 *
 * Formula:
 * Overall Score = Σ(Category % × Category Weight) / Σ(All Weights)
 *
 * @param categoryResults - Array of category results with weights
 * @returns Overall score percentage (0-100)
 */
export function calculateOverallScore(categoryResults: CategoryResult[]): number {
  if (categoryResults.length === 0) {
    return 0;
  }

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categoryResults) {
    // Category percentage × category weight
    const weightedScore = category.percentage * category.totalWeight;
    weightedSum += weightedScore;
    totalWeight += category.totalWeight;
  }

  // Avoid division by zero
  if (totalWeight === 0) {
    return 0;
  }

  return weightedSum / totalWeight;
}

/**
 * Calculate overall result including tier and rank
 */
export function calculateOverallResult(
  categoryResults: CategoryResult[],
  questionResults: QuestionResult[]
): OverallResult {
  const { earnedPoints, maxPoints } = calculateTotalPoints(questionResults);
  const score = calculateOverallScore(categoryResults);
  const tier = getTierFromPercentage(score);
  const rank = getTierRank(tier);

  return {
    score,
    maxPossible: maxPoints,
    earnedPoints,
    percentage: score,
    tier,
    rank,
  };
}

/**
 * Score a complete assessment
 *
 * This is the main entry point for scoring an assessment.
 *
 * @param input - Assessment input with questions and user answers
 * @param options - Scoring options
 * @returns Complete AssessmentResult
 */
export async function scoreAssessment(
  input: AssessmentInput,
  options: ScoringOptions = {}
): Promise<AssessmentResult> {
  const {
    includeAnalysis = true,
    includeRecommendations = true,
    version = '1.0',
  } = options;

  // Step 1: Score individual questions
  const questionResults = scoreQuestions(
    input.questions,
    input.userAnswers,
    input.timeSpent
  );

  // Step 2: Aggregate by category
  let categoryResults = scoreCategories(questionResults);

  // Step 3: Calculate weighted contributions
  categoryResults = calculateWeightedContributions(categoryResults);

  // Step 4: Calculate overall score
  const overall = calculateOverallResult(categoryResults, questionResults);

  // Step 5: Calculate metadata
  const metadata = calculateMetadata(input, questionResults, version);

  // Step 6: Initialize analysis (placeholder for now)
  const analysis = includeAnalysis
    ? await generateAnalysis(categoryResults, overall)
    : createEmptyAnalysis();

  // Step 7: Initialize recommendations (placeholder for now)
  const recommendations = includeRecommendations
    ? await generateRecommendations(categoryResults, overall, analysis)
    : createEmptyRecommendations();

  // Build complete result
  const result: AssessmentResult = {
    assessmentId: input.assessmentId,
    userId: input.userId,
    completedAt: new Date().toISOString(),
    overall,
    categories: categoryResults,
    questions: questionResults,
    analysis,
    recommendations,
    metadata,
  };

  return result;
}

/**
 * Calculate assessment metadata
 */
function calculateMetadata(
  input: AssessmentInput,
  questionResults: QuestionResult[],
  version: string
): AssessmentMetadata {
  const totalQuestions = input.questions.length;
  const questionsAnswered = Object.keys(input.userAnswers).length;

  // Calculate total time spent
  let timeSpent = 0;
  if (input.timeSpent) {
    timeSpent = Object.values(input.timeSpent).reduce((sum, time) => sum + time, 0);
  }

  return {
    totalQuestions,
    questionsAnswered,
    timeSpent,
    version,
  };
}

/**
 * Generate performance analysis
 * (Full implementation will be in performance-analyzer.ts)
 */
async function generateAnalysis(
  categoryResults: CategoryResult[],
  overall: OverallResult
): Promise<any> {
  // Import analyzer dynamically to avoid circular dependencies
  try {
    const { analyzePerformance } = await import('../analysis/performance-analyzer');
    return analyzePerformance(categoryResults, overall);
  } catch (error) {
    // Fallback to empty analysis if analyzer not yet implemented
    return createEmptyAnalysis();
  }
}

/**
 * Generate recommendations
 * (Full implementation will be in career-recommender.ts)
 */
async function generateRecommendations(
  categoryResults: CategoryResult[],
  overall: OverallResult,
  analysis: any
): Promise<any> {
  // Import recommender dynamically to avoid circular dependencies
  try {
    const { generateRecommendations } = await import('../recommendations/career-recommender');
    return generateRecommendations(categoryResults, overall, analysis);
  } catch (error) {
    // Fallback to empty recommendations if recommender not yet implemented
    return createEmptyRecommendations();
  }
}

/**
 * Create empty analysis structure
 */
function createEmptyAnalysis(): any {
  return {
    exceptional: [],
    strengths: [],
    adequate: [],
    weaknesses: [],
    criticalWeaknesses: [],
    consistencyScore: 0,
    improvementPotential: 'medium' as const,
  };
}

/**
 * Create empty recommendations structure
 */
function createEmptyRecommendations(): any {
  return {
    careerPaths: [],
    focusAreas: [],
    learningResources: [],
    nextSteps: [],
    roleSuitability: {
      assessment: '',
      timeline: '',
      readinessLevel: 'medium' as const,
    },
  };
}

/**
 * Quick score calculation (just the percentage, no full result)
 *
 * Useful for preview or quick checks
 */
export function quickScore(
  categoryResults: CategoryResult[]
): { overallScore: number; tier: number; rank: string } {
  const overallScore = calculateOverallScore(categoryResults);
  const tier = getTierFromPercentage(overallScore);
  const rank = getTierRank(tier);

  return { overallScore, tier, rank };
}

/**
 * Validate assessment input before scoring
 */
export function validateAssessmentInput(input: AssessmentInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.assessmentId) {
    errors.push('Assessment ID is required');
  }

  if (!input.userId) {
    errors.push('User ID is required');
  }

  if (!input.questions || input.questions.length === 0) {
    errors.push('At least one question is required');
  }

  if (!input.userAnswers) {
    errors.push('User answers are required');
  }

  // Check for missing answers
  if (input.questions && input.userAnswers) {
    const questionIds = new Set(input.questions.map(q => q.id));
    const answeredIds = new Set(Object.keys(input.userAnswers));

    for (const questionId of questionIds) {
      if (!answeredIds.has(questionId)) {
        errors.push(`Missing answer for question: ${questionId}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Score assessment with validation
 *
 * Validates input before scoring and throws if invalid
 */
export async function scoreAssessmentWithValidation(
  input: AssessmentInput,
  options: ScoringOptions = {}
): Promise<AssessmentResult> {
  const validation = validateAssessmentInput(input);

  if (!validation.valid) {
    throw new Error(
      `Invalid assessment input:\n${validation.errors.join('\n')}`
    );
  }

  return scoreAssessment(input, options);
}
