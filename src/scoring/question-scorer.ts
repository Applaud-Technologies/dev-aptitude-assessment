/**
 * Question Scorer
 *
 * This module handles scoring individual questions, including:
 * - Multiple choice (all-or-nothing)
 * - True/false (all-or-nothing)
 * - Multiple select (partial credit with penalty for wrong selections)
 */

import {
  Question,
  QuestionResult,
  PartialCreditDetails,
} from '../types/assessment.types';

/**
 * Score a single question based on user's answer
 *
 * @param question - The question being scored
 * @param userAnswers - Array of indices selected by the user
 * @param timeSpent - Optional time spent on question in seconds
 * @returns QuestionResult with scoring details
 */
export function scoreQuestion(
  question: Question,
  userAnswers: number[],
  timeSpent?: number
): QuestionResult {
  // Validate inputs
  validateQuestionInput(question, userAnswers);

  // Score based on question type
  let earnedPoints: number;
  let isCorrect: boolean;
  let isPartialCredit: boolean;
  let partialCreditDetails: PartialCreditDetails | undefined;

  switch (question.type) {
    case 'multipleChoice':
    case 'trueFalse':
      ({ earnedPoints, isCorrect } = scoreStandardQuestion(question, userAnswers));
      isPartialCredit = false;
      break;

    case 'multipleSelect':
      ({
        earnedPoints,
        isCorrect,
        partialCreditDetails,
      } = scoreMultipleSelectQuestion(question, userAnswers));
      isPartialCredit = earnedPoints > 0 && earnedPoints < question.score;
      break;

    default:
      throw new Error(`Unknown question type: ${(question as any).type}`);
  }

  // Calculate percentage
  const percentage = question.score > 0 ? (earnedPoints / question.score) * 100 : 0;

  return {
    questionId: question.id,
    category: question.category,
    type: question.type,
    userAnswers,
    correctAnswers: question.correctAnswers,
    earnedPoints,
    maxPoints: question.score,
    percentage,
    isCorrect,
    isPartialCredit,
    partialCreditDetails,
    weight: question.weight,
    timeSpent,
  };
}

/**
 * Score a standard question (multiple choice or true/false)
 * All-or-nothing scoring
 */
function scoreStandardQuestion(
  question: Question,
  userAnswers: number[]
): { earnedPoints: number; isCorrect: boolean } {
  // Check if user's answer matches the correct answer exactly
  const isCorrect =
    userAnswers.length === 1 &&
    question.correctAnswers.length === 1 &&
    userAnswers[0] === question.correctAnswers[0];

  const earnedPoints = isCorrect ? question.score : 0;

  return { earnedPoints, isCorrect };
}

/**
 * Score a multiple select question with partial credit
 *
 * Formula:
 * - Correct Ratio = Correct Selections / Total Correct Answers
 * - Penalty Factor = max(0, 1 - (Incorrect Selections / Total Correct Answers))
 * - Final Score = Base Score × Correct Ratio × Penalty Factor
 *
 * Examples (for a question with 2 correct answers, score = 15):
 * - Select 2 correct, 0 wrong: 15 × 1.0 × 1.0 = 15.0
 * - Select 1 correct, 0 wrong: 15 × 0.5 × 1.0 = 7.5
 * - Select 2 correct, 1 wrong: 15 × 1.0 × 0.5 = 7.5
 * - Select 1 correct, 1 wrong: 15 × 0.5 × 0.5 = 3.75
 * - Select 0 correct, 2 wrong: 15 × 0.0 × 0.0 = 0.0
 */
function scoreMultipleSelectQuestion(
  question: Question,
  userAnswers: number[]
): {
  earnedPoints: number;
  isCorrect: boolean;
  partialCreditDetails: PartialCreditDetails;
} {
  const correctAnswers = new Set(question.correctAnswers);
  const userAnswerSet = new Set(userAnswers);

  // Count correct and incorrect selections
  let correctSelections = 0;
  let incorrectSelections = 0;

  for (const answer of userAnswerSet) {
    if (correctAnswers.has(answer)) {
      correctSelections++;
    } else {
      incorrectSelections++;
    }
  }

  // Count missed selections (correct answers not selected)
  const missedSelections = correctAnswers.size - correctSelections;

  // Calculate correctness ratio
  const totalCorrectAnswers = correctAnswers.size;
  const correctRatio = totalCorrectAnswers > 0
    ? correctSelections / totalCorrectAnswers
    : 0;

  // Calculate penalty factor
  // Each incorrect selection reduces score by a fraction
  const penaltyFactor = totalCorrectAnswers > 0
    ? Math.max(0, 1 - (incorrectSelections / totalCorrectAnswers))
    : 0;

  // Calculate final earned points
  const earnedPoints = question.score * correctRatio * penaltyFactor;

  // Check if completely correct
  const isCorrect =
    correctSelections === totalCorrectAnswers &&
    incorrectSelections === 0;

  const partialCreditDetails: PartialCreditDetails = {
    correctSelections,
    incorrectSelections,
    missedSelections,
    correctRatio,
    penaltyFactor,
  };

  return {
    earnedPoints,
    isCorrect,
    partialCreditDetails,
  };
}

/**
 * Validate question input
 */
function validateQuestionInput(question: Question, userAnswers: number[]): void {
  // Validate question has required fields
  if (!question.id) {
    throw new Error('Question must have an id');
  }

  if (!question.type) {
    throw new Error('Question must have a type');
  }

  if (!question.correctAnswers || question.correctAnswers.length === 0) {
    throw new Error(`Question ${question.id} must have correct answers`);
  }

  if (typeof question.score !== 'number' || question.score < 0) {
    throw new Error(`Question ${question.id} must have a valid score`);
  }

  if (!question.answers || question.answers.length === 0) {
    throw new Error(`Question ${question.id} must have answers`);
  }

  // Validate user answers are within valid range
  const maxIndex = question.answers.length - 1;
  for (const answer of userAnswers) {
    if (answer < 0 || answer > maxIndex) {
      throw new Error(
        `Invalid answer index ${answer} for question ${question.id}. ` +
        `Valid range is 0-${maxIndex}`
      );
    }
  }

  // Validate correct answers are within valid range
  for (const answer of question.correctAnswers) {
    if (answer < 0 || answer > maxIndex) {
      throw new Error(
        `Invalid correct answer index ${answer} for question ${question.id}. ` +
        `Valid range is 0-${maxIndex}`
      );
    }
  }

  // Type-specific validation
  switch (question.type) {
    case 'trueFalse':
      if (question.answers.length !== 2) {
        throw new Error(
          `True/False question ${question.id} must have exactly 2 answers`
        );
      }
      if (question.correctAnswers.length !== 1) {
        throw new Error(
          `True/False question ${question.id} must have exactly 1 correct answer`
        );
      }
      break;

    case 'multipleChoice':
      if (question.answers.length < 2) {
        throw new Error(
          `Multiple choice question ${question.id} must have at least 2 answers`
        );
      }
      if (question.correctAnswers.length !== 1) {
        throw new Error(
          `Multiple choice question ${question.id} must have exactly 1 correct answer`
        );
      }
      break;

    case 'multipleSelect':
      if (question.answers.length < 2) {
        throw new Error(
          `Multiple select question ${question.id} must have at least 2 answers`
        );
      }
      if (question.correctAnswers.length < 1) {
        throw new Error(
          `Multiple select question ${question.id} must have at least 1 correct answer`
        );
      }
      break;
  }
}

/**
 * Score multiple questions at once
 *
 * @param questions - Array of questions
 * @param userAnswers - Map of question ID to selected answer indices
 * @param timeSpent - Optional map of question ID to time spent
 * @returns Array of QuestionResults
 */
export function scoreQuestions(
  questions: Question[],
  userAnswers: Record<string, number[]>,
  timeSpent?: Record<string, number>
): QuestionResult[] {
  return questions.map(question => {
    const answers = userAnswers[question.id] || [];
    const time = timeSpent?.[question.id];
    return scoreQuestion(question, answers, time);
  });
}

/**
 * Calculate total points earned across multiple questions
 */
export function calculateTotalPoints(results: QuestionResult[]): {
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
} {
  const earnedPoints = results.reduce((sum, result) => sum + result.earnedPoints, 0);
  const maxPoints = results.reduce((sum, result) => sum + result.maxPoints, 0);
  const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;

  return { earnedPoints, maxPoints, percentage };
}

/**
 * Get summary statistics for question results
 */
export function getQuestionStats(results: QuestionResult[]): {
  total: number;
  correct: number;
  partial: number;
  incorrect: number;
  averageScore: number;
} {
  const total = results.length;
  let correct = 0;
  let partial = 0;
  let incorrect = 0;

  for (const result of results) {
    if (result.isCorrect) {
      correct++;
    } else if (result.isPartialCredit) {
      partial++;
    } else {
      incorrect++;
    }
  }

  const { percentage: averageScore } = calculateTotalPoints(results);

  return {
    total,
    correct,
    partial,
    incorrect,
    averageScore,
  };
}
