/**
 * Career Recommender
 *
 * This module generates personalized career path recommendations,
 * learning resources, and next steps based on assessment performance.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  CategoryResult,
  OverallResult,
} from '../types/assessment.types';
import {
  CareerRecommendation,
  FocusArea,
  LearningResource,
  RecommendationSet,
  RoleSuitability,
  CareerPathDefinition,
  LearningResourceDefinition,
} from '../types/recommendation.types';
import { PerformanceAnalysis } from '../types/analysis.types';
import { getReadinessLevel } from '../constants/tiers';

// Load data files
const DATA_DIR = path.join(__dirname, '../../data');
const careerPathsData = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'career-paths.json'), 'utf-8')
);
const learningResourcesData = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'learning-resources.json'), 'utf-8')
);

const CAREER_PATHS: CareerPathDefinition[] = careerPathsData.careerPaths;
const LEARNING_RESOURCES: LearningResourceDefinition[] = learningResourcesData.resources;

/**
 * Generate complete recommendation set
 */
export function generateRecommendations(
  categoryResults: CategoryResult[],
  overall: OverallResult,
  analysis: PerformanceAnalysis
): RecommendationSet {
  const careerPaths = recommendCareerPaths(categoryResults, overall);
  const focusAreas = identifyFocusAreas(categoryResults, analysis);
  const learningResources = recommendLearningResources(focusAreas);
  const nextSteps = generateNextSteps(overall, analysis, focusAreas);
  const roleSuitability = assessRoleSuitability(overall, analysis);

  return {
    careerPaths,
    focusAreas,
    learningResources,
    nextSteps,
    roleSuitability,
  };
}

/**
 * Recommend career paths based on strengths
 */
function recommendCareerPaths(
  categoryResults: CategoryResult[],
  overall: OverallResult
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  // Calculate match score for each career path
  for (const career of CAREER_PATHS) {
    const matchScore = calculateCareerMatchScore(career, categoryResults);

    // Only recommend if match score is above threshold
    if (matchScore >= 50) {
      const priority = determinePriority(matchScore);
      const relevantStrengths = findRelevantStrengths(career, categoryResults);
      const matchReason = generateMatchReason(career, relevantStrengths, matchScore);

      recommendations.push({
        path: career.name,
        matchReason,
        relevantStrengths,
        requiredSkills: career.skills,
        priority,
        matchScore,
        description: career.description,
      });
    }
  }

  // Sort by match score (descending)
  recommendations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Limit to top 5 recommendations
  return recommendations.slice(0, 5);
}

/**
 * Calculate match score for a career path
 */
function calculateCareerMatchScore(
  career: CareerPathDefinition,
  categoryResults: CategoryResult[]
): number {
  let totalScore = 0;

  for (const [categoryName, weight] of Object.entries(career.matchScore)) {
    const category = categoryResults.find(cat => cat.name === categoryName);
    if (category) {
      // Weight × category percentage
      totalScore += weight * category.percentage;
    }
  }

  return totalScore;
}

/**
 * Determine recommendation priority based on match score
 */
function determinePriority(matchScore: number): 'primary' | 'secondary' | 'alternative' {
  if (matchScore >= 75) return 'primary';
  if (matchScore >= 60) return 'secondary';
  return 'alternative';
}

/**
 * Find relevant strengths for a career path
 */
function findRelevantStrengths(
  career: CareerPathDefinition,
  categoryResults: CategoryResult[]
): string[] {
  const strengths: string[] = [];

  for (const requiredCategory of career.requiredStrengths) {
    const category = categoryResults.find(cat => cat.name === requiredCategory);
    if (category && category.percentage >= 75) {
      strengths.push(requiredCategory);
    }
  }

  return strengths;
}

/**
 * Generate match reason text
 */
function generateMatchReason(
  career: CareerPathDefinition,
  relevantStrengths: string[],
  matchScore: number
): string {
  if (relevantStrengths.length === 0) {
    return `Good fit based on overall profile (${matchScore.toFixed(0)}% match)`;
  }

  const strengthsList = relevantStrengths.slice(0, 2).join(' and ');
  return `Your strong ${strengthsList} skills make you well-suited for ${career.name}`;
}

/**
 * Identify focus areas for improvement
 */
function identifyFocusAreas(
  categoryResults: CategoryResult[],
  analysis: PerformanceAnalysis
): FocusArea[] {
  const focusAreas: FocusArea[] = [];

  // Add critical weaknesses (< 45%)
  for (const category of analysis.criticalWeaknesses) {
    focusAreas.push({
      category: category.name,
      priority: 'critical',
      currentScore: category.percentage,
      targetScore: 60, // Target adequate level
      reason: `Essential skill currently scoring ${category.percentage.toFixed(1)}%`,
      estimatedEffort: '4-6 weeks of intensive practice',
    });
  }

  // Add weaknesses (45-59%)
  for (const category of analysis.weaknesses) {
    focusAreas.push({
      category: category.name,
      priority: 'high',
      currentScore: category.percentage,
      targetScore: 75, // Target strength level
      reason: `Below threshold at ${category.percentage.toFixed(1)}%`,
      estimatedEffort: '2-4 weeks of focused practice',
    });
  }

  // Add adequate areas that can become strengths (60-74%)
  for (const category of analysis.adequate) {
    if (category.percentage >= 65) {
      focusAreas.push({
        category: category.name,
        priority: 'medium',
        currentScore: category.percentage,
        targetScore: 85, // Target exceptional level
        reason: `Close to strength level, can reach exceptional with practice`,
        estimatedEffort: '2-3 weeks of regular practice',
      });
    }
  }

  // Sort by priority: critical > high > medium
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  focusAreas.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return focusAreas;
}

/**
 * Recommend learning resources based on focus areas
 */
function recommendLearningResources(focusAreas: FocusArea[]): LearningResource[] {
  const resources: LearningResource[] = [];
  const categoriesNeedingResources = new Set(focusAreas.slice(0, 5).map(f => f.category));

  for (const category of categoriesNeedingResources) {
    // Find resources for this category
    const categoryResources = LEARNING_RESOURCES
      .filter(res => res.category === category)
      .slice(0, 3); // Limit to 3 resources per category

    resources.push(...categoryResources);
  }

  return resources;
}

/**
 * Generate next steps action items
 */
function generateNextSteps(
  overall: OverallResult,
  analysis: PerformanceAnalysis,
  focusAreas: FocusArea[]
): string[] {
  const steps: string[] = [];

  // Based on overall tier
  if (overall.tier >= 4) {
    steps.push('Begin practical coding training immediately');
    steps.push('Consider accelerated learning track or bootcamp');
    steps.push('Build portfolio projects showcasing your strengths');
  } else if (overall.tier === 3) {
    steps.push('Start structured development training program');
    steps.push('Focus on practical application with guided exercises');
    steps.push('Join peer learning groups or study communities');
  } else {
    steps.push('Complete comprehensive foundational training');
    steps.push('Work with mentor or instructor for guidance');
    steps.push('Practice daily with structured curriculum');
  }

  // Add focus area specific steps
  if (focusAreas.length > 0) {
    const topFocus = focusAreas[0];
    steps.push(`Priority: Improve ${topFocus.category} (currently ${topFocus.currentScore.toFixed(0)}%)`);
  }

  // Add specialization recommendation
  if (analysis.exceptional.length >= 2) {
    const specializations = analysis.exceptional.slice(0, 2).map(cat => cat.name).join(' and ');
    steps.push(`Consider specialized tracks leveraging your ${specializations} skills`);
  }

  // Add mentorship recommendation
  if (overall.tier <= 3) {
    steps.push('Seek mentorship from experienced developers');
  } else {
    steps.push('Pair with senior mentor for rapid growth and industry insights');
  }

  return steps;
}

/**
 * Assess role suitability
 */
function assessRoleSuitability(
  overall: OverallResult,
  analysis: PerformanceAnalysis
): RoleSuitability {
  const readinessLevel = getReadinessLevel(overall.percentage);
  let assessment: string;
  let timeline: string;
  const recommendedRoles: string[] = [];
  const areasNeedingDevelopment: string[] = [];

  if (readinessLevel === 'high') {
    assessment = 'Excellent candidate for developer roles with strong potential';
    timeline = 'Ready to start within 3-6 months with intensive training';
    recommendedRoles.push('Junior Developer', 'Associate Software Engineer', 'Entry-level roles in specialized areas');
  } else if (readinessLevel === 'medium') {
    assessment = 'Good candidate with solid foundation for development work';
    timeline = 'Ready for entry-level role in 6-12 months with structured training';
    recommendedRoles.push('Junior Developer with mentorship', 'Apprentice Developer', 'QA roles as entry point');
  } else {
    assessment = 'Has potential but needs foundational development';
    timeline = '12-18 months with dedicated learning, or consider prerequisite training';
    recommendedRoles.push('Consider bootcamp or intensive program', 'Technical support roles', 'QA tester as entry');
  }

  // Add key strengths
  const keyStrengths = analysis.exceptional
    .concat(analysis.strengths)
    .slice(0, 3)
    .map(cat => cat.name);

  // Add areas needing development
  areasNeedingDevelopment.push(
    ...analysis.weaknesses.map(cat => cat.name),
    ...analysis.criticalWeaknesses.map(cat => cat.name)
  );

  return {
    assessment,
    timeline,
    readinessLevel,
    recommendedRoles,
    keyStrengths,
    areasNeedingDevelopment,
  };
}
