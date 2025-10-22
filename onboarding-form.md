# Onboarding Form Database Proposal

## Overview
Currently, the `/api/onboarding` endpoint returns hardcoded data.  
The goal is to move the datas into a database table for better scalability and flexibility. 

## Proposed Database Changes
The hardcoded database would completely replaced with a new database scheme.

### onboardingForm Table
- `formId`: (Primary key) Unique key 
- `version`: Integer
- `isVisible`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime

Explanation: 
- "onboardingForm" table represents one version of onboarding flow. This is to create new versions of the form too if there are any changes.
- Since a form rarely updates and only if there are major updates, I used integer instead of decimal to show the updates.
- isVisible is for the version that is currently active for the users.
- `createdAt` and `updatedAt` track when the form version was created and last modified.

### onboardingStep Table
- `stepId`: (Primary key) Unique key
- `formId`: (Foreign key): Links to "onboardingForm" table
- `order`: Integer

Explanation:
- "onboardingStep" table represents a single page / step within an "onboardingForm".
- The relationship of the foreign key (formId) is "This step / This page belongs to", this represents a single step (page) that is in the form.
- `order` is to define the sequence of the pages / steps that will appear for the users.

### onboardingField Table
- `fieldId`: (Primary key) Unique key
- `stepId`: (Foreign key): Links to "onboardingStep" table
- `name`: String 
- `label`: String
- `type`: String
- `required`: Boolean
- `order`: Integer

Explanation: 
- "onboardingField" table represents a single question or input field within an "onboardingStep".
- The relationship of the foreign key (stepId) is "This field belongs to", this represents a single question / input field that is in the page.
- `name` is the internal identifier used when saving the data.
- `label` is the text shown to the user.
- `type` determines the kind of input in each field (text, toggle, etc).
- `required` indicates if the field must be filled (yes/no).
- `order` defines the sequence of questions on the page.

### userOnboardingResponse Table
- `responseId`: (Primary key) Unique key
- `userId`: (Foreign key): Links to "User" table
- `fieldId`: (Foreign key): Links to "onboardingField" table
- `value`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

Explanation: 
- "userOnboardingResponse" table stores the answers that the users submitted by linking `userId` from "User" table to a specific question (fieldId) with their value.
- `userId` foreign key connects to a specific user.
- `fieldId` foreign key connects to a specific question / input field.
- `value` stores the user's response.
- `createdAt` and `updatedAt` track when the response was submitted and last modified.

## API Flow Explanation
### Getting Form (GET/api/onboarding)
- Backend finds the latest and active form version from "onboardingForm".
- Get all the steps (pages) from "onboardingStep" for the form sorted by 'order'.
- For each step, get all the questions or input fields from "onboardingField" sorted by 'order'.
- Assemble all the data into JSON and send it to the frontend.

### Saving Responses (POST/api/onboarding)
- Frontend sends the user's responses in the form of (array [{name: ..., value: ...}]).
- Backend validates if the user logged in or not.
- For each answer:
    - Find the 'fieldId' based on the 'name'.
    - Create a new row in 'userOnboardingResponse' table that contains:
        - userId (Who answered it).
        - fieldId (What's the question).
        - value (The user's responses).
- Update the user to completeOnboarding from false to true.