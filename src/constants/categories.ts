/**
 * Category Constants
 *
 * This file contains definitions for the 8 assessment focus areas,
 * including their names, descriptions, and metadata.
 */

import { CategoryName } from '../types/assessment.types';

/**
 * Category definition with metadata
 */
export interface CategoryDefinition {
  /** Category name */
  name: CategoryName;
  /** URL-friendly code */
  code: string;
  /** Full description */
  description: string;
  /** Skills assessed in this category */
  skills: string[];
  /** Icon or emoji for display */
  icon?: string;
  /** Color for UI display */
  color?: string;
}

/**
 * All 8 assessment categories with their definitions
 */
export const CATEGORIES: Record<string, CategoryDefinition> = {
  PATTERN_RECOGNITION: {
    name: 'Pattern Recognition & Sequences',
    code: 'pattern_recognition',
    description: 'Ability to identify patterns in numbers, shapes, or symbols and predict sequences',
    skills: [
      'Identifying patterns in data',
      'Predicting next elements in sequences',
      'Finding pattern breaks',
      'Analogical reasoning',
    ],
    icon: '🔍',
    color: '#3B82F6', // Blue
  },

  LOGICAL_REASONING: {
    name: 'Logical Reasoning',
    code: 'logical_reasoning',
    description: 'Capacity for logical thinking, deduction, and working with conditional statements',
    skills: [
      'Conditional logic (if-then)',
      'Boolean logic (AND, OR, NOT)',
      'Cause and effect analysis',
      'Logical deduction',
      'Valid vs invalid conclusions',
    ],
    icon: '🧠',
    color: '#8B5CF6', // Purple
  },

  ABSTRACT_THINKING: {
    name: 'Abstract Thinking',
    code: 'abstract_thinking',
    description: 'Ability to work with symbolic representations and understand abstract concepts',
    skills: [
      'Working with symbols',
      'Translating between representations',
      'Understanding abstract relationships',
      'Generalization from examples',
    ],
    icon: '💭',
    color: '#EC4899', // Pink
  },

  SYSTEMATIC_PROBLEM_SOLVING: {
    name: 'Systematic Problem-Solving',
    code: 'systematic_problem_solving',
    description: 'Skill in breaking down complex problems and following structured approaches',
    skills: [
      'Breaking problems into steps',
      'Following multi-step instructions',
      'Creating procedures',
      'Ordering operations correctly',
    ],
    icon: '🎯',
    color: '#F59E0B', // Amber
  },

  ATTENTION_TO_DETAIL: {
    name: 'Attention to Detail',
    code: 'attention_to_detail',
    description: 'Precision in following rules, spotting differences, and detecting inconsistencies',
    skills: [
      'Spotting differences',
      'Following precise rules',
      'Identifying missing elements',
      'Detecting inconsistencies',
    ],
    icon: '🔬',
    color: '#10B981', // Green
  },

  SPATIAL_VISUAL_REASONING: {
    name: 'Spatial & Visual Reasoning',
    code: 'spatial_visual_reasoning',
    description: 'Capacity for mental rotation, visualization, and understanding spatial relationships',
    skills: [
      'Mental rotation',
      'Flow diagram comprehension',
      'Understanding hierarchies',
      'Grid-based problem solving',
    ],
    icon: '🧩',
    color: '#06B6D4', // Cyan
  },

  MATHEMATICAL_REASONING: {
    name: 'Mathematical Reasoning',
    code: 'mathematical_reasoning',
    description: 'Basic mathematical thinking including algebra, order of operations, and proportions',
    skills: [
      'Order of operations',
      'Basic algebra',
      'Set theory concepts',
      'Proportional reasoning',
    ],
    icon: '🔢',
    color: '#EF4444', // Red
  },

  RULE_APPLICATION: {
    name: 'Rule Application',
    code: 'rule_application',
    description: 'Ability to apply rules to new situations and work within constraints',
    skills: [
      'Applying rules to new situations',
      'Identifying rule conflicts',
      'Understanding precedence',
      'Working within constraints',
    ],
    icon: '📋',
    color: '#14B8A6', // Teal
  },
};

/**
 * Array of all category names
 */
export const CATEGORY_NAMES: CategoryName[] = [
  'Pattern Recognition & Sequences',
  'Logical Reasoning',
  'Abstract Thinking',
  'Systematic Problem-Solving',
  'Attention to Detail',
  'Spatial & Visual Reasoning',
  'Mathematical Reasoning',
  'Rule Application',
];

/**
 * Map category name to code
 */
export const CATEGORY_NAME_TO_CODE: Record<CategoryName, string> = {
  'Pattern Recognition & Sequences': 'pattern_recognition',
  'Logical Reasoning': 'logical_reasoning',
  'Abstract Thinking': 'abstract_thinking',
  'Systematic Problem-Solving': 'systematic_problem_solving',
  'Attention to Detail': 'attention_to_detail',
  'Spatial & Visual Reasoning': 'spatial_visual_reasoning',
  'Mathematical Reasoning': 'mathematical_reasoning',
  'Rule Application': 'rule_application',
};

/**
 * Map category code to name
 */
export const CATEGORY_CODE_TO_NAME: Record<string, CategoryName> = {
  pattern_recognition: 'Pattern Recognition & Sequences',
  logical_reasoning: 'Logical Reasoning',
  abstract_thinking: 'Abstract Thinking',
  systematic_problem_solving: 'Systematic Problem-Solving',
  attention_to_detail: 'Attention to Detail',
  spatial_visual_reasoning: 'Spatial & Visual Reasoning',
  mathematical_reasoning: 'Mathematical Reasoning',
  rule_application: 'Rule Application',
};

/**
 * Get category definition by name
 */
export function getCategoryDefinition(name: CategoryName): CategoryDefinition | undefined {
  return Object.values(CATEGORIES).find(cat => cat.name === name);
}

/**
 * Get category code from name
 */
export function getCategoryCode(name: CategoryName): string {
  return CATEGORY_NAME_TO_CODE[name];
}

/**
 * Get category name from code
 */
export function getCategoryName(code: string): CategoryName | undefined {
  return CATEGORY_CODE_TO_NAME[code];
}
