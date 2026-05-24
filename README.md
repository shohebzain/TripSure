
# TripSure

TripSure is an AI-powered intercity logistics and passenger platform built with React, TypeScript, and Vite. The app focuses on optimizing return trips between rural and urban centers in India by matching passengers, drivers, and cargo through an intelligent booking flow.

## Key Features

- AI-driven matching engine for return trips and cargo bookings
- Multilingual UI support for English and Hindi
- Passenger, driver partner, and cargo owner flows
- Local storage persistence for user sessions, trips, and notifications
- Simulated KYC onboarding and driver verification workflow
- Gemini AI integration for route insights, trip suggestions, and support chat
- Responsive dashboard with booking, trip posting, notifications, and settings

## Tech Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- lucide-react icons
- Google Gemini AI (`@google/genai`)

## Project Structure

- `App.tsx` - main application shell, routing, state management, and tab navigation
- `components/` - UI screens and feature components including auth, matching engine, driver onboarding, dashboard, trips, and support chat
- `constants/animations.ts` - shared animation variants for Framer Motion
- `services/geminiService.ts` - Gemini AI helpers for match generation, route insights, pitstop suggestions, and support responses
- `types.ts` - shared TypeScript interfaces and app models
- `metadata.json` - app metadata and permissions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn available on your machine

### Install dependencies

```bash
npm install
```

### Environment variables

This project expects a Gemini API key to be available as `API_KEY` in your environment.

Create a `.env.local` file at the project root with:

```env
API_KEY=your_gemini_api_key_here
```

> Note: The code reads `process.env.API_KEY` in `services/geminiService.ts`.

### Run locally

```bash
npm run dev
```

Then open the local Vite preview URL shown in the terminal.

## Usage

- Use the auth screen to sign in or sign up as a Passenger, Driver Partner, or Cargo Owner
- Search for intercity matches using the Matching Engine screen
- Complete driver onboarding and KYC flows for partner activation
- Post return trips, manage active bookings, and review trip history
- Open the support chat to simulate AI-powered customer service

## Gemini AI Integration

The app connects with Google Gemini AI to deliver:

- simulated trip matches in `services/geminiService.ts`
- route insights grounded in search data
- pitstop suggestions using location-aware grounding
- support message responses using a chat system

## Notes

- This project is currently a frontend prototype and uses local storage for persistence
- Real production usage would require a backend service for authentication, booking processing, payment, KYC, and data storage
- Replace the Gemini API key with a valid key before running AI-backed features

## Scripts

- `npm run dev` - start local development server
- `npm run build` - build production files
- `npm run preview` - preview production build locally

## Contact

TripSure Logistics Pvt Ltd.

- Email: `support@tripsure.in`

