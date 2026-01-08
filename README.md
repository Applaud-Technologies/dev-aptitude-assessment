# Developer Aptitude Assessment

## Project Goal

Create an assessment tool to evaluate junior developers' aptitude for software development **without requiring prior coding knowledge**. This assessment focuses on fundamental cognitive skills and problem-solving abilities that indicate potential for success in software development.

## Assessment Focus Areas

### 1. Pattern Recognition & Sequences
- Identifying patterns in numbers, shapes, or symbols
- Predicting next elements in sequences
- Finding what breaks a pattern
- Analogical reasoning (A:B :: C:?)

### 2. Logical Reasoning
- Conditional logic (if-then statements)
- Boolean logic (AND, OR, NOT)
- Cause and effect relationships
- Logical deduction from given rules
- Identifying valid vs invalid conclusions

### 3. Abstract Thinking
- Working with symbolic representations
- Translating between different representations
- Understanding relationships between abstract concepts
- Generalizing from specific examples

### 4. Systematic Problem-Solving
- Breaking complex problems into smaller steps
- Following multi-step instructions precisely
- Creating procedures to achieve goals
- Ordering operations correctly

### 5. Attention to Detail
- Spotting differences in similar items
- Following precise rules/constraints
- Identifying missing or incorrect elements
- Detecting inconsistencies

### 6. Spatial & Visual Reasoning
- Mental rotation and transformation
- Flow diagrams and process mapping
- Understanding hierarchies and relationships
- Grid-based puzzles

### 7. Mathematical Reasoning (Basic)
- Order of operations
- Basic algebra (solving for unknowns)
- Set theory concepts (unions, intersections)
- Proportional reasoning

### 8. Rule Application
- Applying given rules to new situations
- Identifying when rules conflict
- Understanding rule precedence
- Working within constraints

## Question Format

- Multiple choice questions
- True/false questions
- Scenario-based questions that test practical application
- No syntax or programming language knowledge required

## Target Audience

Junior developers or candidates with no prior software development experience who want to assess their aptitude for coding and software development careers.

## Quick Start

### Prerequisites

- Node.js 18+ and npm installed
- Git (for cloning the repository)

### Installation

```bash
# Clone the repository
git clone https://github.com/Applaud-Technologies/dev-aptitude-assessment.git
cd dev-aptitude-assessment

# Install dependencies
npm install

# Build the project
npm run build
```

### Running the Example

```bash
# Run the example assessment
npm run example
```

This will:
1. Load 15 sample questions from `templates/sample-questions.json`
2. Simulate user answers
3. Score the assessment
4. Display comprehensive results including:
   - Overall score and tier
   - Category breakdown
   - Performance analysis
   - Career recommendations
   - Next steps

### Usage in Your Application

```typescript
import { scoreAssessment } from './src/scoring/overall-scorer';
import { Question } from './src/types/assessment.types';

// Load your questions
const questions: Question[] = [...]; // From your data source

// Collect user answers
const userAnswers: Record<string, number[]> = {
  'question-id-1': [2],      // Multiple choice answer
  'question-id-2': [0, 2],   // Multiple select answers
  // ... more answers
};

// Score the assessment
const result = await scoreAssessment({
  assessmentId: 'asmt_001',
  userId: 'user_123',
  questions,
  userAnswers,
});

console.log(`Score: ${result.overall.percentage}%`);
console.log(`Tier: ${result.overall.rank}`);
```

## Project Structure

```
dev-aptitude-assessment/
├── src/
│   ├── scoring/              # Scoring engine
│   │   ├── question-scorer.ts    # Individual question scoring
│   │   ├── category-scorer.ts    # Category aggregation
│   │   └── overall-scorer.ts     # Main scoring orchestration
│   ├── analysis/             # Performance analysis
│   │   ├── tier-classifier.ts    # Tier assignment
│   │   └── performance-analyzer.ts # Strength/weakness analysis
│   ├── recommendations/      # Career recommendations
│   │   └── career-recommender.ts  # Career path matching
│   ├── types/                # TypeScript type definitions
│   │   ├── assessment.types.ts
│   │   ├── analysis.types.ts
│   │   └── recommendation.types.ts
│   └── constants/            # Constants and configurations
│       ├── categories.ts         # 8 category definitions
│       └── tiers.ts              # Tier thresholds
├── templates/                # Question templates
│   ├── question-template.json    # JSON schema
│   ├── sample-questions.json     # 15 sample questions
│   └── README.md                 # Template documentation
├── data/                     # Supporting data
│   ├── career-paths.json         # Career path definitions
│   └── learning-resources.json   # Learning resources
├── examples/                 # Usage examples
│   ├── usage-example.ts          # TypeScript example
│   └── example-assessment-result.json # Sample output
└── docs/                     # Documentation
    └── SCORING_SYSTEM.md         # Detailed scoring documentation
```

## Features

### Scoring System

- **Question-Level Scoring**: Supports multiple choice, true/false, and multiple select questions
- **Partial Credit**: Multiple select questions award proportional credit
- **Category Aggregation**: Groups questions by 8 cognitive skill areas
- **Weighted Calculation**: Overall score weighted by category importance
- **5-Tier Classification**: Novice, Beginner, Intermediate, Advanced, Expert

### Performance Analysis

- **Strengths & Weaknesses**: Automatic identification across categories
- **Consistency Scoring**: Measures performance variance
- **Profile Detection**: High-performer, Balanced, Specialist, Developing, Early-stage
- **Improvement Potential**: Assessment of growth opportunities

### Career Recommendations

- **12 Career Paths**: Backend, Frontend, Full-Stack, Architecture, QA, DevOps, etc.
- **Match Scoring**: Weighted calculation based on strengths
- **Focus Areas**: Specific categories needing improvement
- **Learning Resources**: Curated materials mapped to weaknesses
- **Role Suitability**: Readiness assessment with timeline

## Available Scripts

```bash
# Build the TypeScript project
npm run build

# Build and watch for changes
npm run build:watch

# Run the example
npm run example

# Run with ts-node (development)
npm run dev

# Clean build output
npm run clean
```

## Documentation

- **[Scoring System](docs/SCORING_SYSTEM.md)** - Comprehensive scoring methodology and API reference
- **[Question Templates](templates/README.md)** - Question format and validation rules
- **[Example Output](examples/example-assessment-result.json)** - Sample assessment result

## Scoring Methodology

### Overall Score Calculation

```
Overall Score = Σ(Category % × Category Weight) / Σ(All Weights)
```

### Partial Credit Algorithm

For multiple select questions:
```
Score = Base Score × Correct Ratio × Penalty Factor

Where:
- Correct Ratio = Correct Selections / Total Correct Answers
- Penalty Factor = max(0, 1 - (Incorrect Selections / Total Correct Answers))
```

### Tier System

| Tier | Range | Label | Description |
|------|-------|-------|-------------|
| 5 | 85-100% | Expert | Exceptional aptitude, ready for complex challenges |
| 4 | 70-84% | Advanced | Strong aptitude, capable of independent work |
| 3 | 55-69% | Intermediate | Solid foundation, needs guidance on complex tasks |
| 2 | 40-54% | Beginner | Basic understanding, requires significant training |
| 1 | 0-39% | Novice | Foundational development needed |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Contact

For questions or support, please open an issue on GitHub.
