---
name: prompt-engineering-pattern
description: Use this skill BEFORE executing any user prompt to improve and refine the prompt itself
---

# Prompt Engineering Pattern

## Purpose
Improve and refine user prompts before execution to ensure clarity, completeness, and best possible outcomes.

## When to Use
**ALWAYS use this skill before executing ANY user prompt.** This is mandatory.

## Prompt Improvement Checklist

### 1. Clarify Ambiguities
- [ ] Identify unclear terms or phrases
- [ ] Ask clarifying questions if needed
- [ ] Resolve vague references ("this", "that", "it")

### 2. Complete Missing Context
- [ ] What is the end goal?
- [ ] What are the constraints?
- [ ] What is the context/background?
- [ ] What format should the output be?

### 3. Add Specificity
- [ ] Replace generic terms with specific ones
- [ ] Add concrete examples
- [ ] Specify exact file paths or component names
- [ ] Define success criteria

### 4. Structure the Prompt
- [ ] Break into clear sections
- [ ] Number steps if sequential
- [ ] Use bullet points for lists
- [ ] Add context headers

### 5. Apply Best Practices
- [ ] Start with clear objective
- [ ] Include relevant constraints
- [ ] Specify output format
- [ ] Add examples of desired outcome

## Example Transformations

### Before
"Fix the button"

### After
"Fix the submit button in the contact form component (components/ContactForm.tsx). Currently, the button doesn't disable during form submission, causing duplicate submissions. Make it so the button shows a loading spinner and is disabled while the form is submitting."

### Before
"Add styling"

### After
"Add responsive styling to the product card component. Use Tailwind CSS classes to ensure it:
- Displays 4 columns on desktop (xl breakpoint)
- Displays 2 columns on tablet (md breakpoint)
- Displays 1 column on mobile
- Maintains consistent spacing and aspect ratio"

## After Improvement
Once the prompt is improved, present it to the user for confirmation before proceeding:

```
I've refined your prompt:

[Improved Prompt]

Shall I proceed with this refined version, or would you like to adjust it further?
```
