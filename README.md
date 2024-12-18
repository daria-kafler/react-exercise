# CRUK technical exercise (React)

  

## Overview

This project is a **React/TypeScript** application that connects users to the **NASA Media Library API**. It allows users to search for media (images, videos, and audio clips) using a form built with **React Hook Form** and validated by **Zod**. The application retrieves results based on user inputs and displays them in a paginated list (10 items per page). Testing was done with **Playwright**.

 **App is deployed at** [react-exercise-jet.vercel.app](https://react-exercise-jet.vercel.app/)

  

### Prerequisites

- Node.js (v18 or higher)

- npm (comes with Node.js)

- Git

  

### Installation Steps

1. Clone the repository

```bash

git  clone  https://github.com/daria-kafler/react-exercise.git

cd  react-exercise

```

  

2. Install dependencies

```bash

npm  install

```

  

3. Run the development server locally

```bash

npm  run  dev

```

The app should now be running on http://localhost:3000 in your broswer

  

#### Access to NASA's API

You should have an `.env` file with the access set up for Nasa's API. That API has an hourly and daily limit, so I recommend to sign up and get your own key, which has less limitations:

1. Go to https://api.nasa.gov/ and get you key

2. Create a `.env.local` file in the project root and add your key:

```

NEXT_PUBLIC_NASA_API_ENDPOINT=https://api.nasa.gov/

NEXT_PUBLIC_NASA_API_KEY=your_api_key_here

```
  It should automatically be prioritised over `.env` when you run your local development.

## Running tests

Testing is done with Playwright.

To run all tests

```bash

npm  run  test --worker=1

```

  

To run specific tests

```bash

npm  run  test  <file-path> --worker=1

```

for example: `npm run test list.spec.ts`
  

**Note:** I'm new to Playwright, and the easiest and most comfortable way, for me, I've found of debugging is by checking the traces files generated by Playwright.

To do this:

1. In the `playwright.config.ts` file, change `trace: "on-first-retry",` to be `trace: "on",`.

2. Run the specific test you're debugging

3. Trace files should now be generated inside the `test-results` folder.

4. Go to https://trace.playwright.dev/ and drop your trace files there.

  
---

## Technical Overview

  

### Testing Approach

This application uses Playwright for End-to-End (E2E) testing, focusing on happy path scenarios. This decision was made to:

- Ensure core user journeys work as expected

- Test real interactions with NASA's API

- Test the integration between components

- Test the user interface behaviour


**Happy path testing was prioritised due to:**

- Time constraints

- Complex state management between components, for example:

	- Form -> List on Submit (form minimises, new search triggered, pagination reset).

	- List -> DescriptionModal (handling special formatting for audio)

  

**Unit tests were not prioritised because:**

- E2E UI tests provide good coverage for this apps' search interface

- The components are tightly coupled with NASA's API responses, meaning testing the media components would've required extensive mocking.

- UI behavior testing was more critical for user experience in this scenario.

- Most of the complex logic is in the UI user interactions, not data processing (for example dialog open and close, modal interaction with different media types, switching from video preview with thumbnail to video element)

  

### Error Handling Approach

The application has the following error handling:

1.  **Form Validation**

- Uses Zod schema validation

- Real-time field validation

- Clear error messages for users

  

2.  **API Error Handling**

- Validates NASA API responses

- Handles network failures gracefully

- Shows user-friendly error messages

  

3.  **UI State Management**

- Loading states for API calls

- Error states for failed requests

- "No results found" handling

  

### Known Limitations & Future Improvements

  

1.  **Current Limitations**

- Uses NASA API demo key with rate limits - limited to 30 requests per hour, means likely to reach error states quickly.

- No persistent storage of searches - means no search history.

- Some TypeScript 'any' types remain - could lead to runtime errors, makes code harder to maintain. This is a reflection of time constraints against level of familiarity with TS.

  

2.  **Future Improvements**

- Add testing for all components (example: Form component)

- Add unhappy path and edge cases testing (example: test list handles API errors gracefully)

- Implement proper unit tests (example: Form minimisation, Pagination 'Next' and 'Prev' behaviour, API fetching logic)

- Improve TypeScript type safety

- Refactor List.tsx (separate out pagination into it's own component)

- Improve Error logging and display (add logging library for structured logging, add error tracking service and context preservation)

- Add animation for Form minimise/expand

- Improve styling overall (examples: audio interview transcripts could display speakers better, href not displayed property in results description)

- Implement proper error logging (more detailed error context, analytics and monitoring, etc)

- Explore reasoning and consistent sizing strategy (example: image and video sizing is arbitrary, looked good to me)

- Add more accessibility (example: add aria labels where missing, add focus management in modal)

  
  

---

## Task details

  

- We will be testing your ability to understand an existing React/Typescript codebase, find what is already built, and what is not.

- You will be building a form using the CRUK React Component Library controlled by ReactHookForm which uses a Zod validation schema.

- This form which will fetch items from the NASA Library API. The "Form fields" section below describes the fields and their validation which should modify the search query.

- The media returned should be displayed in list below the form, these may be images, video, or audio clips. It is up to you how you display these

- The user should only see the first 10 items on the page. If you have time enabling pagination is a stretch target.

- Code must be clean and production ready, quality is better than quantity.

- You can test your application with Playwright, see src/test folder for example tests and see all the scripts available in the package.json

- Feel free to edit this readme or add a new readme file for any additional information, such as what you might do improve your application in the future.

- Please do not attempt to push to this repo, please create your own fork.

  

## Tools to be used

  

- NextJS (server) https://nextjs.org/docs

- NASA Images and Video Library API https://api.nasa.gov/

- CRUK React Component Library Storybook site: https://master.d28a8la187lo73.amplifyapp.com/

- CRUK React Component Library Package: https://www.npmjs.com/package/@cruk/cruk-react-components

- Styled Components (what the CRUK Component Library was built with) https://styled-components.com/docs

- React Hook Form (forms): https://react-hook-form.com/

- Zod (validation) https://zod.dev/

  

## Form fields

  

This form has 3 fields and error messages should appear below each field.

  

### Keywords field

  

| Attribute | Value |

| :-------- | :------- |

| Label | Keywords |

| Name | keywords |

| Required | true |

| Type | text |

| Default | "" |

  

### Keywords validation

  

| Type | Value | Message |

| :--------- | :---- | :------------------------------------------ |

| min length | 2 | "keywords must have at least 2 characters." |

| max length | 50 | "keywords must have at most 50 characters." |

  

An error message should appear below the field

  

### Media type field

  

| Attribute | Value |

| :-------- | :-------------------------- |

| Label | Media type |

| Name | mediaType |

| Required | true |

| Type | select |

| Values | [“audio”, “video”, “image”] |

| Default | "" |

  

### Media types validation

  

| Type | Value | Message |

| :------- | :---------------- | :---------------------------- |

| if unset | null or undefined | "Please select a media type." |

  

### Year start field

  

| Attribute | Value |

| :-------- | :--------- |

| Label | Year start |

| Name | yearStart |

| Required | false |

| Type | text |

| Default | "" |

  

### Year start validation

  

| Type | Value | Message |

| :---------- | :--------------------- | :-------------------------------------- |

| number type | any non digit charater | "Please enter a valid number." |

| min | 1900 | "Year start must be after 1900." |

| max | current year | "Year start must not be in the future." |

  

## Getting Started

  

First, run the development server:

  

```bash

npm  run  dev

```

  

Open [http://localhost:3000](http://localhost:3000) with your browser to view your application.

  

The page auto-updates as you edit the files.

  

## Testing

  

To test your code run:

  

```bash

npm  run  test:debug

```

  

This will open up a browser window to show you your test in action

The page will auto-update as you edit files.

  

## Learn More

  

To learn more about Next.js, take a look at the following resources:

  

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

  

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

  

## Deploy on Vercel

  

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

  

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
