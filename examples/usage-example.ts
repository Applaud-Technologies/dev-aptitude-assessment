/**
 * Usage Example - Developer Aptitude Assessment
 *
 * This example demonstrates how to:
 * 1. Load questions from the template
 * 2. Simulate user answers
 * 3. Score the assessment
 * 4. Display results
 */

import * as fs from 'fs';
import * as path from 'path';
import { scoreAssessment } from '../src/scoring/overall-scorer';
import { Question } from '../src/types/assessment.types';

async function main() {
  console.log('='.repeat(60));
  console.log('Developer Aptitude Assessment - Example Usage');
  console.log('='.repeat(60));
  console.log();

  // 1. Load questions from template
  console.log('📋 Loading questions...');
  // Use process.cwd() to get the project root, works from both src and dist
  const projectRoot = process.cwd();
  const questionsPath = path.join(projectRoot, 'templates/sample-questions.json');
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
  const questions: Question[] = questionsData.questions;
  console.log(`   Loaded ${questions.length} questions across 8 categories\n`);

  // 2. Simulate user answers
  console.log('✍️  Simulating user answers...');
  const userAnswers: Record<string, number[]> = {
    // Pattern Recognition & Sequences
    'pr-001': [2],      // Correct
    'pr-002': [1],      // Correct

    // Logical Reasoning
    'lr-001': [1],      // Correct
    'lr-002': [2, 3],   // Correct (multiple select)

    // Abstract Thinking
    'at-001': [0],      // Correct

    // Systematic Problem-Solving
    'sp-001': [1],      // Correct
    'sp-002': [0, 2],   // Correct (multiple select)

    // Attention to Detail
    'ad-001': [1],      // Correct
    'ad-002': [0, 3],   // Correct (multiple select)

    // Spatial & Visual Reasoning
    'sv-001': [0],      // Correct
    'sv-002': [0, 1, 3], // Correct (multiple select)

    // Mathematical Reasoning
    'mr-001': [1],      // Correct
    'mr-002': [1],      // Correct

    // Rule Application
    'ra-001': [2],      // Correct
    'ra-002': [0, 1],   // Correct (multiple select)
  };
  console.log(`   Answered all ${Object.keys(userAnswers).length} questions\n`);

  // 3. Score the assessment
  console.log('🧮 Scoring assessment...');
  const result = await scoreAssessment({
    assessmentId: `asmt_${Date.now()}`,
    userId: 'example_user',
    questions,
    userAnswers,
  });
  console.log('   Scoring complete!\n');

  // 4. Display results
  displayResults(result);
}

function displayResults(result: any) {
  console.log('='.repeat(60));
  console.log('📊 ASSESSMENT RESULTS');
  console.log('='.repeat(60));
  console.log();

  // Overall Score
  console.log('🎯 OVERALL SCORE');
  console.log('-'.repeat(60));
  console.log(`   Score:      ${result.overall.percentage.toFixed(1)}%`);
  console.log(`   Tier:       ${result.overall.rank} (Level ${result.overall.tier}/5)`);
  console.log(`   Points:     ${result.overall.earnedPoints.toFixed(1)} / ${result.overall.maxPossible}`);
  console.log();

  // Category Breakdown
  console.log('📈 CATEGORY BREAKDOWN');
  console.log('-'.repeat(60));

  // Sort by score descending
  const sortedCategories = [...result.categories].sort((a, b) => b.percentage - a.percentage);

  for (const category of sortedCategories) {
    const bar = createProgressBar(category.percentage);
    const icon = getClassificationIcon(category.classification);
    console.log(`   ${icon} ${category.name}`);
    console.log(`      ${bar} ${category.percentage.toFixed(1)}% (${category.rank})`);
  }
  console.log();

  // Performance Analysis
  console.log('🔍 PERFORMANCE ANALYSIS');
  console.log('-'.repeat(60));

  if (result.analysis.exceptional.length > 0) {
    console.log(`   ⭐ Exceptional (${result.analysis.exceptional.length}):`);
    for (const cat of result.analysis.exceptional) {
      console.log(`      • ${cat.name} (${cat.percentage.toFixed(1)}%)`);
    }
  }

  if (result.analysis.strengths.length > 0) {
    console.log(`   💪 Strengths (${result.analysis.strengths.length}):`);
    for (const cat of result.analysis.strengths) {
      console.log(`      • ${cat.name} (${cat.percentage.toFixed(1)}%)`);
    }
  }

  if (result.analysis.adequate.length > 0) {
    console.log(`   ✓  Adequate (${result.analysis.adequate.length}):`);
    for (const cat of result.analysis.adequate) {
      console.log(`      • ${cat.name} (${cat.percentage.toFixed(1)}%)`);
    }
  }

  if (result.analysis.weaknesses.length > 0) {
    console.log(`   ⚠️  Weaknesses (${result.analysis.weaknesses.length}):`);
    for (const cat of result.analysis.weaknesses) {
      console.log(`      • ${cat.name} (${cat.percentage.toFixed(1)}%)`);
    }
  }

  if (result.analysis.criticalWeaknesses.length > 0) {
    console.log(`   🔴 Critical Weaknesses (${result.analysis.criticalWeaknesses.length}):`);
    for (const cat of result.analysis.criticalWeaknesses) {
      console.log(`      • ${cat.name} (${cat.percentage.toFixed(1)}%)`);
    }
  }

  console.log();
  console.log(`   Consistency: ${result.analysis.consistencyScore.toFixed(1)}/100`);
  console.log(`   Improvement Potential: ${result.analysis.improvementPotential}`);
  console.log();

  // Career Recommendations
  console.log('💼 CAREER RECOMMENDATIONS');
  console.log('-'.repeat(60));

  const topCareers = result.recommendations.careerPaths.slice(0, 3);
  for (let i = 0; i < topCareers.length; i++) {
    const career = topCareers[i];
    const priority = career.priority === 'primary' ? '🥇' : career.priority === 'secondary' ? '🥈' : '🥉';
    console.log(`   ${priority} ${career.path}`);
    console.log(`      Match: ${career.matchScore?.toFixed(0)}%`);
    console.log(`      ${career.matchReason}`);
    if (i < topCareers.length - 1) console.log();
  }
  console.log();

  // Role Suitability
  console.log('🎓 ROLE SUITABILITY');
  console.log('-'.repeat(60));
  console.log(`   ${result.recommendations.roleSuitability.assessment}`);
  console.log(`   Timeline: ${result.recommendations.roleSuitability.timeline}`);
  console.log(`   Readiness: ${result.recommendations.roleSuitability.readinessLevel.toUpperCase()}`);
  console.log();

  // Next Steps
  console.log('🚀 NEXT STEPS');
  console.log('-'.repeat(60));
  const nextSteps = result.recommendations.nextSteps.slice(0, 5);
  for (let i = 0; i < nextSteps.length; i++) {
    console.log(`   ${i + 1}. ${nextSteps[i]}`);
  }
  console.log();

  // Focus Areas
  if (result.recommendations.focusAreas.length > 0) {
    console.log('📚 FOCUS AREAS FOR IMPROVEMENT');
    console.log('-'.repeat(60));
    for (const focus of result.recommendations.focusAreas.slice(0, 3)) {
      const priorityIcon = focus.priority === 'critical' ? '🔴' :
                          focus.priority === 'high' ? '🟠' :
                          focus.priority === 'medium' ? '🟡' : '🟢';
      console.log(`   ${priorityIcon} ${focus.category}`);
      console.log(`      Current: ${focus.currentScore.toFixed(1)}% → Target: ${focus.targetScore}%`);
      console.log(`      ${focus.reason}`);
      console.log(`      Effort: ${focus.estimatedEffort}`);
      console.log();
    }
  }

  console.log('='.repeat(60));
  console.log('Assessment complete! 🎉');
  console.log('='.repeat(60));
}

function createProgressBar(percentage: number): string {
  const width = 30;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

function getClassificationIcon(classification: string): string {
  const icons: Record<string, string> = {
    'exceptional': '⭐',
    'strength': '💪',
    'adequate': '✓',
    'weakness': '⚠️',
    'critical-weakness': '🔴',
  };
  return icons[classification] || '•';
}

// Run the example
main().catch(error => {
  console.error('Error running example:', error);
  process.exit(1);
});
