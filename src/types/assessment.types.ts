/**
 * Core Type Definitions for Developer Aptitude Assessment
 *
 * This file contains all TypeScript interfaces and types for the assessment system,
 * including questions, results, categories, and scoring structures.
 */

// ============================================================================
// Question Types
// ============================================================================

/**
 * Valid question types in the assessment
 */
export type QuestionType = 'multipleChoice' | 'trueFalse' | 'multipleSelect';

/**
 * Valid assessment categories (8 cognitive skill areas)
 */
export type CategoryName =
  | 'Pattern Recognition & Sequences'
  | 'Logical Reasoning'
  | 'Abstract Thinking'
  | 'Systematic Problem-Solving'
  | 'Attention to Detail'
  | 'Spatial & Visual Reasoning'
  | 'Mathematical Reasoning'
  | 'Rule Application';

/**
 * Answer option within a question
 */
export interface Answer {
  /** Index/ID of this answer option (0-based) */
  id: number;
  /** Answer text displayed to user */
  text: string;
}

/**
 * Base question structure
 */
export interface Question {
  /** Unique identifier for the question */
  id: string;
  /** Question text presented to the user */
  text: string;
  /** Type of question */
  type: QuestionType;
  /** Assessment category this question belongs to */
  category: CategoryName;
  /** Array of possible answers */
  answers: Answer[];
  /** Array of indices pointing to correct answer(s) */
  correctAnswers: number[];
  /** Base points awarded for answering correctly */
  score: number;
  /** Category weight/importance (typically 1-5) */
  weight: number;
}

// ============================================================================
// Tier System Types
// ============================================================================

/**
 * Tier levels from 1 (Novice) to 5 (Expert)
 */
export type TierLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Tier rank labels
 */
export type TierRank = 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/**
 * Performance classification
 */
export type PerformanceClassification =
  | 'exceptional'       // 85-100%
  | 'strength'          // 75-84%
  | 'adequate'          // 60-74%
  | 'weakness'          // 45-59%
  | 'critical-weakness'; // 0-44%

/**
 * Tier definition with thresholds and metadata
 */
export interface TierDefinition {
  level: TierLevel;
  rank: TierRank;
  minPercentage: number;
  maxPercentage: number;
  description: string;
  color: string;
}

// ============================================================================
// Question Result Types
// ============================================================================

/**
 * Partial credit details for multiple select questions
 */
export interface PartialCreditDetails {
  /** Number of correctly selected answers */
  correctSelections: number;
  /** Number of incorrectly selected answers */
  incorrectSelections: number;
  /** Number of correct answers that were not selected */
  missedSelections: number;
  /** Ratio of correct selections to total correct answers (0-1) */
  correctRatio: number;
  /** Penalty factor for incorrect selections (0-1) */
  penaltyFactor: number;
}

/**
 * Result for a single question
 */
export interface QuestionResult {
  /** Question ID */
  questionId: string;
  /** Category this question belongs to */
  category: CategoryName;
  /** Question type */
  type: QuestionType;

  // User response
  /** Indices selected by user */
  userAnswers: number[];
  /** Correct answer indices */
  correctAnswers: number[];

  // Scoring
  /** Points earned for this question */
  earnedPoints: number;
  /** Maximum possible points */
  maxPoints: number;
  /** Percentage score (0-100) */
  percentage: number;

  // Status
  /** Whether the answer is fully correct */
  isCorrect: boolean;
  /** Whether partial credit was awarded */
  isPartialCredit: boolean;

  // Partial credit details (for multipleSelect only)
  partialCreditDetails?: PartialCreditDetails;

  // Metadata
  /** Weight of this question */
  weight: number;
  /** Time spent on question in seconds (optional) */
  timeSpent?: number;
}

// ============================================================================
// Category Result Types
// ============================================================================

/**
 * Result for a single category
 */
export interface CategoryResult {
  /** Category name */
  name: CategoryName;
  /** Category code (slugified name) */
  code: string;

  // Scoring
  /** Points earned in this category */
  earnedPoints: number;
  /** Maximum possible points */
  maxPoints: number;
  /** Percentage score (0-100) */
  percentage: number;

  // Weight information
  /** Sum of weights from all questions in this category */
  totalWeight: number;
  /** How much this category contributes to overall score */
  weightedContribution: number;

  // Performance
  /** Tier level for this category */
  tier: TierLevel;
  /** Tier rank label */
  rank: TierRank;
  /** Performance classification */
  classification: PerformanceClassification;

  // Questions
  /** Number of questions in this category */
  questionCount: number;
  /** Number of fully correct answers */
  correctCount: number;
  /** Number of partial credit answers */
  partialCreditCount: number;
  /** Number of incorrect answers */
  incorrectCount: number;

  /** Array of question IDs in this category */
  questions: string[];
}

/**
 * Summary of a category (used in analysis)
 */
export interface CategorySummary {
  /** Category name */
  name: CategoryName;
  /** Category percentage score */
  percentage: number;
  /** Category tier */
  tier: TierLevel;
  /** Number of questions */
  questionCount: number;
}

// ============================================================================
// Overall Result Types
// ============================================================================

/**
 * Overall assessment performance
 */
export interface OverallResult {
  /** Overall aptitude score (0-100) */
  score: number;
  /** Total possible points across all questions */
  maxPossible: number;
  /** Total earned points */
  earnedPoints: number;
  /** Overall percentage (0-100) */
  percentage: number;
  /** Overall tier level */
  tier: TierLevel;
  /** Overall tier rank */
  rank: TierRank;
}

// ============================================================================
// Complete Assessment Result
// ============================================================================

/**
 * Metadata about the assessment
 */
export interface AssessmentMetadata {
  /** Total number of questions in assessment */
  totalQuestions: number;
  /** Number of questions answered */
  questionsAnswered: number;
  /** Total time spent in seconds */
  timeSpent: number;
  /** Assessment version */
  version: string;
}

/**
 * Complete assessment result with all scoring, analysis, and recommendations
 */
export interface AssessmentResult {
  /** Unique assessment ID */
  assessmentId: string;
  /** User ID */
  userId: string;
  /** Completion timestamp (ISO 8601) */
  completedAt: string;

  /** Overall performance */
  overall: OverallResult;

  /** Category breakdown */
  categories: CategoryResult[];

  /** Question-by-question results */
  questions: QuestionResult[];

  /** Performance analysis */
  analysis: PerformanceAnalysis;

  /** Recommendations */
  recommendations: RecommendationSet;

  /** Assessment metadata */
  metadata: AssessmentMetadata;
}

// ============================================================================
// Analysis Types (imported from analysis.types.ts)
// ============================================================================

/**
 * Performance analysis interface (to be fully defined in analysis.types.ts)
 */
export interface PerformanceAnalysis {
  exceptional: CategorySummary[];
  strengths: CategorySummary[];
  adequate: CategorySummary[];
  weaknesses: CategorySummary[];
  criticalWeaknesses: CategorySummary[];
  consistencyScore: number;
  improvementPotential: 'high' | 'medium' | 'low';
  percentile?: number;
  averageScore?: number;
}

// ============================================================================
// Recommendation Types (imported from recommendation.types.ts)
// ============================================================================

/**
 * Recommendation set interface (to be fully defined in recommendation.types.ts)
 */
export interface RecommendationSet {
  careerPaths: CareerRecommendation[];
  focusAreas: FocusArea[];
  learningResources: LearningResource[];
  nextSteps: string[];
  roleSuitability: RoleSuitability;
}

export interface CareerRecommendation {
  path: string;
  matchReason: string;
  relevantStrengths: string[];
  requiredSkills: string[];
  priority: 'primary' | 'secondary' | 'alternative';
}

export interface FocusArea {
  category: CategoryName;
  priority: 'critical' | 'high' | 'medium' | 'low';
  currentScore: number;
  targetScore: number;
  reason: string;
  estimatedEffort: string;
}

export interface LearningResource {
  category: CategoryName;
  type: 'course' | 'practice' | 'reading' | 'exercise' | 'project';
  title: string;
  description: string;
  url?: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface RoleSuitability {
  assessment: string;
  timeline: string;
  readinessLevel: 'high' | 'medium' | 'low';
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Input for scoring an assessment
 */
export interface AssessmentInput {
  /** Assessment ID */
  assessmentId: string;
  /** User ID */
  userId: string;
  /** Array of questions */
  questions: Question[];
  /** User's answers (map of question ID to selected answer indices) */
  userAnswers: Record<string, number[]>;
  /** Time spent on each question (optional) */
  timeSpent?: Record<string, number>;
}

/**
 * Scoring options
 */
export interface ScoringOptions {
  /** Whether to include detailed analysis */
  includeAnalysis?: boolean;
  /** Whether to generate recommendations */
  includeRecommendations?: boolean;
  /** Assessment version */
  version?: string;
}
