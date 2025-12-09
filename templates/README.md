# Question Template Documentation

This directory contains JSON templates and sample questions for the Developer Aptitude Assessment system.

## Files

- **question-template.json** - JSON Schema definition with examples for each question type
- **sample-questions.json** - Collection of 15 sample questions covering all assessment categories

## Question Structure

Each question follows this structure:

```json
{
  "id": "string",
  "text": "string",
  "type": "multipleChoice | trueFalse | multipleSelect",
  "category": "string",
  "answers": [
    {
      "id": number,
      "text": "string"
    }
  ],
  "correctAnswers": [number],
  "score": number,
  "weight": number
}
```

## Field Descriptions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the question (e.g., "mc-001", "tf-001", "ms-001") |
| `text` | string | The question text presented to the user |
| `type` | string | Question type: `multipleChoice`, `trueFalse`, or `multipleSelect` |
| `category` | string | One of the 8 assessment focus areas (see below) |
| `answers` | array | Array of answer objects, each with `id` and `text` |
| `correctAnswers` | array | Array of indices (0-based) pointing to correct answers |
| `score` | number | Base points awarded for correct answer |
| `weight` | number | Category weight/importance (typically 1-5) |

### Answer Object

Each answer in the `answers` array contains:
- `id`: Numeric index (0-based) of the answer
- `text`: The answer text displayed to the user

### Correct Answers

The `correctAnswers` field is an array of indices that point to the correct answers:
- For `trueFalse` and `multipleChoice`: Array with exactly **1** index
- For `multipleSelect`: Array with **1 or more** indices
- All indices must be valid (within the range of the answers array)

**Example:**
```json
"answers": [
  { "id": 0, "text": "Option A" },
  { "id": 1, "text": "Option B" },
  { "id": 2, "text": "Option C" }
],
"correctAnswers": [1]  // Option B is correct
```

## Valid Categories

Questions must use one of these 8 assessment focus areas:

1. **Pattern Recognition & Sequences**
   - Identifying patterns in numbers, shapes, or symbols
   - Predicting next elements in sequences
   - Finding pattern breaks

2. **Logical Reasoning**
   - Conditional logic (if-then statements)
   - Boolean logic (AND, OR, NOT)
   - Logical deduction from rules

3. **Abstract Thinking**
   - Working with symbolic representations
   - Translating between representations
   - Understanding abstract concepts

4. **Systematic Problem-Solving**
   - Breaking complex problems into steps
   - Following multi-step instructions
   - Ordering operations correctly

5. **Attention to Detail**
   - Spotting differences
   - Following precise rules/constraints
   - Detecting inconsistencies

6. **Spatial & Visual Reasoning**
   - Mental rotation and transformation
   - Flow diagrams and hierarchies
   - Grid-based puzzles

7. **Mathematical Reasoning**
   - Order of operations
   - Basic algebra
   - Proportional reasoning

8. **Rule Application**
   - Applying rules to new situations
   - Identifying rule conflicts
   - Working within constraints

## Question Types

### Multiple Choice
- Single correct answer from 3-6 options
- `correctAnswers` array contains exactly 1 index
- Recommended answer count: 4

**Example:**
```json
{
  "id": "mc-001",
  "text": "What comes next: 2, 4, 8, 16, ?",
  "type": "multipleChoice",
  "category": "Pattern Recognition & Sequences",
  "answers": [
    { "id": 0, "text": "20" },
    { "id": 1, "text": "24" },
    { "id": 2, "text": "32" },
    { "id": 3, "text": "30" }
  ],
  "correctAnswers": [2],
  "score": 10,
  "weight": 3
}
```

### True/False
- Binary choice question
- Exactly 2 answers
- `correctAnswers` array contains exactly 1 index

**Example:**
```json
{
  "id": "tf-001",
  "text": "If all birds can fly, and a penguin is a bird, then a penguin can fly.",
  "type": "trueFalse",
  "category": "Logical Reasoning",
  "answers": [
    { "id": 0, "text": "True" },
    { "id": 1, "text": "False" }
  ],
  "correctAnswers": [1],
  "score": 5,
  "weight": 2
}
```

### Multiple Select
- Multiple correct answers possible
- 2-8 answer options
- `correctAnswers` array contains 1 or more indices

**Example:**
```json
{
  "id": "ms-001",
  "text": "Which are valid conclusions?",
  "type": "multipleSelect",
  "category": "Logical Reasoning",
  "answers": [
    { "id": 0, "text": "Conclusion A" },
    { "id": 1, "text": "Conclusion B" },
    { "id": 2, "text": "Conclusion C" },
    { "id": 3, "text": "Conclusion D" }
  ],
  "correctAnswers": [2, 3],
  "score": 15,
  "weight": 4
}
```

## Validation Rules

### ID Format
- Must be unique across all questions
- Recommended format: `{type}-{number}` (e.g., "mc-001", "tf-012", "ms-005")
- Type prefixes: `mc` (multiple choice), `tf` (true/false), `ms` (multiple select)

### Answer Count Requirements
- **trueFalse**: Exactly 2 answers
- **multipleChoice**: 2-6 answers (4 recommended)
- **multipleSelect**: 2-8 answers

### Correct Answers Requirements
- All indices in `correctAnswers` must be valid (< answers.length)
- **trueFalse** and **multipleChoice**: Exactly 1 index
- **multipleSelect**: At least 1 index, can be multiple

### Score and Weight
- `score`: Must be a positive number (> 0)
- `weight`: Must be a positive number, typically 1-5
  - 1-2: Lower importance
  - 3: Medium importance
  - 4-5: High importance

## Scoring System

### Base Score
Each question has a `score` field representing base points awarded for a correct answer.

### Weight Factor
The `weight` field represents the category importance:
- Used to calculate weighted scores across categories
- Higher weight = more important to overall assessment
- Useful for emphasizing certain cognitive skills

### Calculation Example
```
Final Score = (Correct Answers / Total Questions) × Base Score × Weight Factor
```

## Best Practices

### Writing Questions
1. **Keep it clear**: Questions should be unambiguous
2. **No coding required**: Avoid programming syntax or language-specific knowledge
3. **Test aptitude**: Focus on cognitive skills, not learned knowledge
4. **Varied difficulty**: Mix easy, medium, and hard questions
5. **Realistic scenarios**: Use practical examples when possible

### Answer Options
1. **Plausible distractors**: Wrong answers should seem reasonable
2. **Consistent length**: Avoid making correct answers obviously longer/shorter
3. **No "all of the above"**: Use multipleSelect type instead
4. **Randomize order**: Don't always put correct answer in same position

### Categories
1. **Balance coverage**: Include questions from all 8 categories
2. **Match difficulty to weight**: Higher weight questions can be more challenging
3. **Progressive difficulty**: Start easier, increase complexity

## Usage Examples

### Loading Questions
```javascript
// Node.js example
const questions = require('./sample-questions.json');
console.log(`Loaded ${questions.questions.length} questions`);
```

### Validating a Question
```javascript
function validateQuestion(question) {
  // Check required fields
  const required = ['id', 'text', 'type', 'category', 'answers', 'correctAnswers', 'score', 'weight'];
  for (const field of required) {
    if (!question[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate type
  const validTypes = ['multipleChoice', 'trueFalse', 'multipleSelect'];
  if (!validTypes.includes(question.type)) {
    throw new Error(`Invalid type: ${question.type}`);
  }

  // Validate correct answers indices
  for (const index of question.correctAnswers) {
    if (index < 0 || index >= question.answers.length) {
      throw new Error(`Invalid correct answer index: ${index}`);
    }
  }

  return true;
}
```

### Checking an Answer
```javascript
function checkAnswer(question, userAnswers) {
  // userAnswers is an array of selected indices
  const correct = question.correctAnswers.sort().toString();
  const user = userAnswers.sort().toString();
  return correct === user;
}
```

## Future Enhancements

Consider adding these optional fields in future versions:

- `difficulty`: "easy" | "medium" | "hard"
- `timeLimit`: number (seconds allowed)
- `explanation`: string (explanation of correct answer)
- `tags`: string[] (additional categorization)
- `imageUrl`: string (for visual/spatial questions)
- `scenario`: string (context for scenario-based questions)
- `hints`: string[] (progressive hints for learning mode)
- `references`: string[] (educational resources)

## License

This template structure is part of the Developer Aptitude Assessment project.
