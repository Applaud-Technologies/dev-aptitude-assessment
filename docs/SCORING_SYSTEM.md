# Developer Aptitude Assessment - Scoring System

## Overview

The scoring system evaluates developer aptitude across 8 cognitive skill areas, providing:
- Individual question scoring with partial credit support
- Category-level aggregation
- Weighted overall score calculation
- 5-tier classification system
- Performance analysis and recommendations
- Career path matching

## Quick Start

```typescript
import { scoreAssessment } from './src/scoring/overall-scorer';
import { Question } from './src/types/assessment.types';

// Load your questions
const questions: Question[] = [...]; // From templates/sample-questions.json

// Collect user answers
const userAnswers: Record<string, number[]> = {
  'pr-001': [2],      // Multiple choice answer
  'lr-002': [2, 3],   // Multiple select answers
  // ... more answers
};

// Score the assessment
const result = await scoreAssessment({
  assessmentId: 'asmt_001',
  userId: 'user_123',
  questions,
  userAnswers,
});

console.log(`Overall Score: ${result.overall.percentage}%`);
console.log(`Tier: ${result.overall.rank}`);
```

## Scoring Methodology

### 1. Question-Level Scoring

#### Standard Questions (Multiple Choice, True/False)
All-or-nothing scoring:
```
Score = Base Score × Correctness (1.0 or 0.0)
```

#### Multiple Select with Partial Credit
Proportional scoring with penalty for incorrect selections:
```
Score = Base Score × Correct Ratio × Penalty Factor

Where:
- Correct Ratio = Correct Selections / Total Correct Answers
- Penalty Factor = max(0, 1 - (Incorrect Selections / Total Correct Answers))
```

**Examples** (15-point question with 2 correct answers):
| User Selection | Correct | Wrong | Score Calculation | Final Score |
|----------------|---------|-------|-------------------|-------------|
| [2, 3] | 2 | 0 | 15 × 1.0 × 1.0 | 15.0 |
| [2] | 1 | 0 | 15 × 0.5 × 1.0 | 7.5 |
| [2, 3, 1] | 2 | 1 | 15 × 1.0 × 0.5 | 7.5 |
| [2, 0] | 1 | 1 | 15 × 0.5 × 0.5 | 3.75 |
| [0, 1] | 0 | 2 | 15 × 0.0 × 0.0 | 0.0 |

### 2. Category-Level Scoring

Questions are aggregated by their 8 categories:
```
Category % = (Earned Points / Max Points) × 100%
```

### 3. Overall Score Calculation

Weighted calculation based on category importance:
```
Overall Score = Σ(Category % × Category Weight) / Σ(All Weights)
```

**Example:**
```
Pattern Recognition: 100% × weight 6 = 600
Logical Reasoning:   62.5% × weight 6 = 375
Abstract Thinking:   100% × weight 4 = 400
... (continue for all 8 categories)

Total Weight = 46
Overall Score = (600 + 375 + 400 + ...) / 46 = 84.5%
```

## Tier System

### Five-Tier Classification

| Tier | Range | Label | Description |
|------|-------|-------|-------------|
| 5 | 85-100% | Expert | Exceptional aptitude, ready for complex challenges |
| 4 | 70-84% | Advanced | Strong aptitude, capable of independent work |
| 3 | 55-69% | Intermediate | Solid foundation, needs guidance on complex tasks |
| 2 | 40-54% | Beginner | Basic understanding, requires significant training |
| 1 | 0-39% | Novice | Foundational development needed |

### Performance Classification

Each category is also classified for detailed analysis:

| Classification | Range | Color | Meaning |
|----------------|-------|-------|---------|
| Exceptional | 85-100% | Green | Top-tier performance |
| Strength | 75-84% | Light Green | Above-average |
| Adequate | 60-74% | Yellow | Satisfactory |
| Weakness | 45-59% | Orange | Needs improvement |
| Critical Weakness | 0-44% | Red | Requires development |

## Performance Analysis

The system automatically analyzes performance to identify:

### Strengths & Weaknesses
- **Exceptional**: Categories scoring 85%+
- **Strengths**: Categories scoring 75-84%
- **Adequate**: Categories scoring 60-74%
- **Weaknesses**: Categories scoring 45-59%
- **Critical Weaknesses**: Categories scoring <45%

### Consistency Score
Measures variance across categories (0-100, higher = more consistent):
```typescript
const consistency = calculateConsistency(categoryResults);
console.log(consistency.consistencyScore); // 82.5
console.log(consistency.standardDeviation); // 15.2
```

### Performance Profile
Identifies overall performance pattern:
- **High Performer**: 85%+ overall, most categories strong
- **Balanced**: 70-84% overall, even distribution
- **Specialist**: High variance, some exceptional, some weak
- **Developing**: 55-69% overall
- **Early Stage**: <55% overall

## Recommendations

### Career Path Matching

Recommends career paths based on strength patterns:

```typescript
const recommendations = result.recommendations;

for (const career of recommendations.careerPaths) {
  console.log(`${career.path} (${career.priority})`);
  console.log(`  Match: ${career.matchReason}`);
  console.log(`  Skills needed: ${career.requiredSkills.join(', ')}`);
}
```

**Example Output:**
```
Software Architecture (primary)
  Match: Your strong Pattern Recognition & Abstract Thinking make you well-suited
  Skills needed: System design patterns, Scalability planning, Technical leadership

Full-Stack Development (secondary)
  Match: Balanced performance across all categories
  Skills needed: Frontend/backend tech, Database design, API integration
```

### Focus Areas

Identifies specific categories needing improvement:

```typescript
for (const focus of recommendations.focusAreas) {
  console.log(`${focus.category}: ${focus.currentScore}% → ${focus.targetScore}%`);
  console.log(`  Priority: ${focus.priority}`);
  console.log(`  Effort: ${focus.estimatedEffort}`);
}
```

### Learning Resources

Curated resources mapped to focus areas:

```typescript
for (const resource of recommendations.learningResources) {
  console.log(`${resource.title} (${resource.type})`);
  console.log(`  Category: ${resource.category}`);
  console.log(`  Duration: ${resource.duration}`);
  console.log(`  Level: ${resource.difficulty}`);
}
```

### Role Suitability

Assessment of readiness for developer roles:

```typescript
const suitability = recommendations.roleSuitability;
console.log(suitability.assessment);  // "Excellent candidate..."
console.log(suitability.timeline);    // "Ready in 3-6 months..."
console.log(suitability.readinessLevel); // "high" | "medium" | "low"
```

## API Reference

### Main Functions

#### `scoreAssessment(input, options)`
Main entry point for scoring.

**Parameters:**
- `input: AssessmentInput` - Questions and user answers
- `options?: ScoringOptions` - Optional configuration

**Returns:** `Promise<AssessmentResult>`

**Example:**
```typescript
const result = await scoreAssessment({
  assessmentId: 'asmt_001',
  userId: 'user_123',
  questions: questionArray,
  userAnswers: answersMap,
  timeSpent: timeMap, // optional
}, {
  includeAnalysis: true,
  includeRecommendations: true,
  version: '1.0',
});
```

#### `scoreQuestions(questions, userAnswers, timeSpent?)`
Score individual questions.

**Returns:** `QuestionResult[]`

#### `scoreCategories(questionResults)`
Aggregate questions by category.

**Returns:** `CategoryResult[]`

#### `calculateOverallScore(categoryResults)`
Calculate weighted overall score.

**Returns:** `number` (0-100)

### Helper Functions

#### `getTierFromPercentage(percentage)`
Convert score to tier level.
```typescript
const tier = getTierFromPercentage(84.5); // 4
```

#### `getPerformanceClassification(percentage)`
Get performance classification.
```typescript
const classification = getPerformanceClassification(87); // 'exceptional'
```

#### `analyzePerformance(categoryResults, overall)`
Generate performance analysis.

#### `generateRecommendations(categoryResults, overall, analysis)`
Generate career and learning recommendations.

## Data Structures

### Question
```typescript
{
  id: string;
  text: string;
  type: 'multipleChoice' | 'trueFalse' | 'multipleSelect';
  category: CategoryName;
  answers: Answer[];
  correctAnswers: number[];
  score: number;
  weight: number;
}
```

### AssessmentResult
```typescript
{
  assessmentId: string;
  userId: string;
  completedAt: string;
  overall: OverallResult;
  categories: CategoryResult[];
  questions: QuestionResult[];
  analysis: PerformanceAnalysis;
  recommendations: RecommendationSet;
  metadata: AssessmentMetadata;
}
```

See `src/types/assessment.types.ts` for complete type definitions.

## Categories

The 8 assessment focus areas:

1. **Pattern Recognition & Sequences**
   - Identifying patterns in data
   - Predicting sequences
   - Analogical reasoning

2. **Logical Reasoning**
   - Conditional logic
   - Boolean logic
   - Deductive reasoning

3. **Abstract Thinking**
   - Working with symbols
   - Understanding abstractions
   - Generalization

4. **Systematic Problem-Solving**
   - Breaking down problems
   - Following procedures
   - Ordering operations

5. **Attention to Detail**
   - Spotting differences
   - Following rules precisely
   - Detecting inconsistencies

6. **Spatial & Visual Reasoning**
   - Mental rotation
   - Understanding hierarchies
   - Visual problem-solving

7. **Mathematical Reasoning**
   - Order of operations
   - Basic algebra
   - Proportional reasoning

8. **Rule Application**
   - Applying rules to situations
   - Working with constraints
   - Understanding precedence

## Validation

The system includes comprehensive validation:

```typescript
import { validateAssessmentInput } from './src/scoring/overall-scorer';

const validation = validateAssessmentInput(input);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Example Workflow

```typescript
// 1. Load questions
const questions = JSON.parse(
  fs.readFileSync('./templates/sample-questions.json', 'utf-8')
).questions;

// 2. Collect user answers
const userAnswers = {
  'pr-001': [2],
  'lr-001': [1],
  'lr-002': [2, 3],
  // ... all answers
};

// 3. Score assessment
const result = await scoreAssessment({
  assessmentId: `asmt_${Date.now()}`,
  userId: 'user_123',
  questions,
  userAnswers,
});

// 4. Display results
console.log(`\n=== OVERALL RESULTS ===`);
console.log(`Score: ${result.overall.percentage.toFixed(1)}%`);
console.log(`Tier: ${result.overall.rank} (${result.overall.tier}/5)`);

console.log(`\n=== CATEGORY BREAKDOWN ===`);
for (const category of result.categories) {
  console.log(`${category.name}: ${category.percentage.toFixed(1)}% (${category.rank})`);
}

console.log(`\n=== ANALYSIS ===`);
console.log(`Exceptional: ${result.analysis.exceptional.length} categories`);
console.log(`Strengths: ${result.analysis.strengths.length} categories`);
console.log(`Weaknesses: ${result.analysis.weaknesses.length + result.analysis.criticalWeaknesses.length} categories`);

console.log(`\n=== CAREER RECOMMENDATIONS ===`);
for (const career of result.recommendations.careerPaths.slice(0, 3)) {
  console.log(`- ${career.path} (${career.priority})`);
}

console.log(`\n=== NEXT STEPS ===`);
for (const step of result.recommendations.nextSteps) {
  console.log(`- ${step}`);
}
```

## File Locations

```
src/
  scoring/
    question-scorer.ts    # Question-level scoring
    category-scorer.ts    # Category aggregation
    overall-scorer.ts     # Main entry point

  analysis/
    tier-classifier.ts         # Tier assignment
    performance-analyzer.ts    # Performance analysis

  recommendations/
    career-recommender.ts # Career recommendations

  types/
    assessment.types.ts      # Core types
    analysis.types.ts        # Analysis types
    recommendation.types.ts  # Recommendation types

  constants/
    categories.ts # Category definitions
    tiers.ts      # Tier thresholds

data/
  career-paths.json       # Career path definitions
  learning-resources.json # Learning resources

examples/
  example-assessment-result.json # Sample output

templates/
  question-template.json  # Question schema
  sample-questions.json   # 15 sample questions
```

## Next Steps

1. **Testing**: Add unit tests in `tests/` directory
2. **Integration**: Connect to your frontend/backend
3. **Database**: Store AssessmentResults for tracking
4. **Analytics**: Track user performance over time
5. **Customization**: Add more career paths and resources

## Support

For questions or issues:
- Review the type definitions in `src/types/`
- Check example output in `examples/example-assessment-result.json`
- Refer to sample questions in `templates/sample-questions.json`
