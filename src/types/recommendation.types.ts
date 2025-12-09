/**
 * Type Definitions for Recommendations
 *
 * This file contains TypeScript interfaces for career recommendations,
 * learning resources, focus areas, and role suitability assessments.
 */

import { CategoryName } from './assessment.types';

// ============================================================================
// Career Recommendation Types
// ============================================================================

/**
 * Career path recommendation based on strengths
 */
export interface CareerRecommendation {
  /** Career path name (e.g., "Backend Development") */
  path: string;

  /** Reason this path matches the user's profile */
  matchReason: string;

  /** User's relevant strengths for this path */
  relevantStrengths: string[];

  /** Skills required for this path */
  requiredSkills: string[];

  /** Priority level */
  priority: 'primary' | 'secondary' | 'alternative';

  /** Match score (0-100) */
  matchScore?: number;

  /** Description of the career path */
  description?: string;
}

/**
 * Career path definition (used in data files)
 */
export interface CareerPathDefinition {
  /** Unique ID */
  id: string;

  /** Career path name */
  name: string;

  /** Required strength categories */
  requiredStrengths: CategoryName[];

  /** Category weight mapping for match score calculation */
  matchScore: Partial<Record<CategoryName, number>>;

  /** Description */
  description: string;

  /** Required skills */
  skills: string[];

  /** Typical roles in this path */
  roles?: string[];

  /** Salary range (optional) */
  salaryRange?: string;
}

// ============================================================================
// Focus Area Types
// ============================================================================

/**
 * Area requiring improvement/focus
 */
export interface FocusArea {
  /** Category needing improvement */
  category: CategoryName;

  /** Priority level */
  priority: 'critical' | 'high' | 'medium' | 'low';

  /** Current score percentage */
  currentScore: number;

  /** Target score percentage */
  targetScore: number;

  /** Reason for focusing on this area */
  reason: string;

  /** Estimated time/effort to improve */
  estimatedEffort: string;

  /** Specific action items */
  actionItems?: string[];

  /** Expected impact on overall score */
  impact?: number;
}

// ============================================================================
// Learning Resource Types
// ============================================================================

/**
 * Learning resource type
 */
export type ResourceType = 'course' | 'practice' | 'reading' | 'exercise' | 'project' | 'video' | 'tutorial';

/**
 * Difficulty level
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Learning resource recommendation
 */
export interface LearningResource {
  /** Associated category */
  category: CategoryName;

  /** Resource type */
  type: ResourceType;

  /** Resource title */
  title: string;

  /** Description */
  description: string;

  /** URL (optional) */
  url?: string;

  /** Estimated duration */
  duration?: string;

  /** Difficulty level */
  difficulty: DifficultyLevel;

  /** Provider/author (optional) */
  provider?: string;

  /** Cost (optional) */
  cost?: 'free' | 'paid' | string;

  /** Tags for filtering */
  tags?: string[];
}

/**
 * Learning resource definition (used in data files)
 */
export interface LearningResourceDefinition extends LearningResource {
  /** Unique ID */
  id: string;

  /** Prerequisites (other resource IDs) */
  prerequisites?: string[];

  /** Related resources */
  relatedResources?: string[];
}

// ============================================================================
// Role Suitability Types
// ============================================================================

/**
 * Readiness level for developer roles
 */
export type ReadinessLevel = 'high' | 'medium' | 'low';

/**
 * Role suitability assessment
 */
export interface RoleSuitability {
  /** Overall suitability assessment */
  assessment: string;

  /** Estimated timeline to readiness */
  timeline: string;

  /** Readiness level */
  readinessLevel: ReadinessLevel;

  /** Recommended roles */
  recommendedRoles?: string[];

  /** Roles to avoid initially */
  rolesToAvoid?: string[];

  /** Key strengths for development work */
  keyStrengths?: string[];

  /** Areas needing development */
  areasNeedingDevelopment?: string[];
}

// ============================================================================
// Complete Recommendation Set
// ============================================================================

/**
 * Complete set of recommendations
 */
export interface RecommendationSet {
  /** Career path recommendations */
  careerPaths: CareerRecommendation[];

  /** Focus areas for improvement */
  focusAreas: FocusArea[];

  /** Learning resources */
  learningResources: LearningResource[];

  /** Next steps action items */
  nextSteps: string[];

  /** Role suitability assessment */
  roleSuitability: RoleSuitability;

  /** Training plan (optional) */
  trainingPlan?: TrainingPlan;
}

// ============================================================================
// Training Plan Types
// ============================================================================

/**
 * Training phase
 */
export interface TrainingPhase {
  /** Phase number */
  phase: number;

  /** Phase name */
  name: string;

  /** Duration estimate */
  duration: string;

  /** Goals for this phase */
  goals: string[];

  /** Focus categories */
  focusCategories: CategoryName[];

  /** Recommended resources */
  resources: string[]; // Resource IDs

  /** Success criteria */
  successCriteria: string[];
}

/**
 * Complete training plan
 */
export interface TrainingPlan {
  /** Overall duration */
  totalDuration: string;

  /** Training phases */
  phases: TrainingPhase[];

  /** Overall goals */
  goals: string[];

  /** Milestones */
  milestones: Milestone[];
}

/**
 * Training milestone
 */
export interface Milestone {
  /** Milestone name */
  name: string;

  /** Target completion date */
  targetDate?: string;

  /** Success criteria */
  criteria: string[];

  /** Associated phase */
  phase: number;
}

// ============================================================================
// Recommendation Rules
// ============================================================================

/**
 * Rule for generating career recommendations
 */
export interface CareerRecommendationRule {
  /** Rule ID */
  id: string;

  /** Rule name */
  name: string;

  /** Conditions that must be met */
  conditions: RecommendationCondition[];

  /** Career paths to recommend if conditions met */
  careerPaths: string[]; // Career path IDs

  /** Priority if conditions met */
  priority: 'primary' | 'secondary' | 'alternative';

  /** Match reason template */
  matchReasonTemplate: string;
}

/**
 * Condition for recommendation rules
 */
export interface RecommendationCondition {
  /** Category to check */
  category: CategoryName;

  /** Minimum score required */
  minScore: number;

  /** Maximum score (optional) */
  maxScore?: number;

  /** Operator */
  operator: '>=' | '<=' | '==' | '>' | '<';
}

// ============================================================================
// Recommendation Options
// ============================================================================

/**
 * Options for generating recommendations
 */
export interface RecommendationOptions {
  /** Include training plan */
  includeTrainingPlan?: boolean;

  /** Maximum number of career paths to recommend */
  maxCareerPaths?: number;

  /** Maximum number of learning resources per category */
  maxResourcesPerCategory?: number;

  /** Include only free resources */
  freeResourcesOnly?: boolean;

  /** Preferred difficulty levels */
  preferredDifficulties?: DifficultyLevel[];

  /** Preferred resource types */
  preferredResourceTypes?: ResourceType[];
}
