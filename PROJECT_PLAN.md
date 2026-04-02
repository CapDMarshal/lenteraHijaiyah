# Lentera Hijaiyah - Project Plan and Code Architecture

## Current Status

- Project plan created and approved.
- Phase 0 completed on 2026-04-03.
- Engineering implementation is paused while Figma design is implemented first.

## 1. Product Scope (Based on User Flow)

Public flow:
- Landing page
- About us page
- Sign in
- Sign up
- Forgot password

Authenticated flow:
- Dashboard
- Pembelajaran Modul (module selection -> theory content -> quiz -> score)
- Al-Quran Digital (choose Surah/Juz -> reading page)
- Canvas Huruf Hijaiyah (choose letter -> write on canvas -> validate -> success message)
- Profile (view/edit profile -> reset password -> logout)

Priority order:
1. Auth
2. Quran reader
3. Learning module
4. Hijaiyah canvas

## 2. Chosen Stack

- Frontend and backend: Next.js App Router (single app)
- Language: TypeScript
- Auth: Auth.js (NextAuth)
- Database: PostgreSQL
- ORM: Prisma
- Quran data source: External API
- Canvas validation: Basic deterministic shape/stroke similarity (MVP)

## 3. Target Architecture

### 3.1 Route and Layout Architecture

```txt
app/
  (public)/
    page.tsx                      # Landing
    about/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
    forgot-password/page.tsx

  (auth)/
    layout.tsx                    # Authenticated layout + nav
    dashboard/page.tsx

    quran/
      page.tsx                    # Surah/Juz selector
      [identifier]/page.tsx       # Reader page

    learning/
      page.tsx                    # Category/module list
      [categoryId]/page.tsx       # Theory content
      [categoryId]/quiz/page.tsx  # Quiz + score

    hijaiyah/
      page.tsx                    # Letter selector + canvas
      result/page.tsx             # Success/result feedback

    profile/
      page.tsx                    # View/edit profile
      change-password/page.tsx

  api/
    auth/
      [...nextauth]/route.ts
      register/route.ts
      forgot-password/route.ts
      reset-password/route.ts

    quran/
      surahs/route.ts
      juz/route.ts
      [identifier]/route.ts

    learning/
      categories/route.ts
      [categoryId]/content/route.ts
      [categoryId]/quiz/route.ts
      score/route.ts

    hijaiyah/
      validate/route.ts

    user/
      profile/route.ts
      password/route.ts

middleware.ts                     # Protect (auth) and selected API routes
```

### 3.2 Module Boundaries

- lib/auth
  - Auth.js configuration
  - Session helpers and role guards
  - Route protection helpers
- lib/db
  - Prisma client singleton
  - DB access helpers/repositories
- lib/quran
  - External API client
  - Response mappers/normalizers
  - Cache policy helpers
- lib/learning
  - Quiz logic and scoring engine
  - Attempt/progress utilities
- lib/hijaiyah
  - Stroke normalization
  - Similarity scoring
- lib/validation
  - Zod schemas for all API and form payloads

### 3.3 Component Architecture

```txt
components/
  auth/
    SignInForm.tsx
    SignUpForm.tsx
    ForgotPasswordForm.tsx

  layout/
    AppShell.tsx
    TopNav.tsx
    Sidebar.tsx

  quran/
    SurahList.tsx
    JuzList.tsx
    ReaderView.tsx

  learning/
    ModuleCard.tsx
    TheoryView.tsx
    QuizRunner.tsx
    ScoreCard.tsx

  hijaiyah/
    LetterPicker.tsx
    DrawingCanvas.tsx
    ValidationFeedback.tsx

  profile/
    ProfileForm.tsx
    ChangePasswordForm.tsx

  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    EmptyState.tsx
    ErrorState.tsx
    LoadingState.tsx
```

## 4. Data Architecture (PostgreSQL + Prisma)

Core/Auth entities:
- User
- Account
- Session
- VerificationToken

App entities:
- Profile
- LearningCategory
- LearningContent
- Quiz
- QuizQuestion
- QuizOption
- QuizAttempt
- QuizScore
- HijaiyahLetter
- HijaiyahAttempt
- HijaiyahScore

Optional aggregate entity:
- UserModuleProgress

### 4.1 Prisma Notes

- Keep all IDs as UUID/CUID consistently.
- Add createdAt/updatedAt timestamps to mutable records.
- Add useful indexes:
  - QuizAttempt(userId, categoryId)
  - HijaiyahAttempt(userId, letterId)
  - Profile(userId unique)

## 5. Security and Reliability

- Auth.js session cookies: httpOnly, secure in production, sameSite=lax.
- Middleware-level auth checks for protected routes.
- Handler-level authorization checks for all user-specific actions.
- Zod validation in every API endpoint and server action.
- Basic rate limiting for:
  - sign-in
  - forgot/reset password
  - hijaiyah validate endpoint
- Safe error handling:
  - no stack trace leakage to client
  - typed error responses

## 6. Caching and Fetching Strategy

- Quran metadata endpoints (surahs/juz): cache with revalidate window.
- User-specific progress/profile: no-store.
- Reader data: revalidate and graceful fallback state.
- Standardized server fetch wrappers in lib/quran and lib/api.

## 7. Delivery Phases

## Phase 0 - Foundation (Completed)

Backend Tasks:
- Done: Add environment schema and config utilities.
- Done: Prepare base project structure for future API routes.

Frontend Tasks:
- Done: Create public/auth route groups.
- Done: Add shared UI primitives and app shell.

AI Tasks:
- Done: Define AI module boundary for future hijaiyah validation (`lib/hijaiyah`).

## Phase 1 - Auth Foundation

Backend Tasks:
- Install and configure Prisma + PostgreSQL connection.
- Implement Auth.js (`[...nextauth]`) and credentials auth flow.
- Implement auth-related route handlers (register, forgot password, reset password).
- Protect private routes with middleware and session checks.

Frontend Tasks:
- Build sign-in/sign-up/forgot-password forms and states.
- Connect auth forms to backend contracts with validation/error UI.
- Add redirect rules (public -> auth pages) after successful login.

AI Tasks:
- Not required in this phase.

## Phase 1a - Account Management

Backend Tasks:
- Implement profile get/update endpoint.
- Implement change password endpoint with current-password verification.
- Implement logout/session invalidation pathway.

Frontend Tasks:
- Build profile edit page and change-password page.
- Add logout action in authenticated navigation.
- Add success/error notification states for profile operations.

AI Tasks:
- Not required in this phase.

## Phase 2 - Quran Reader

Backend Tasks:
- Build external Quran API client and response mappers.
- Add cached route handlers for Surah/Juz list and reader data.
- Implement fallback handling for provider failure/timeouts.

Frontend Tasks:
- Build Surah/Juz selector UI.
- Build reader page with loading/empty/error states.
- Add navigation controls between Surah/Juz and return-to-list actions.

AI Tasks:
- Optional later: recommendation engine for next Surah/Juz based on user activity.

## Phase 3 - Learning Module

Backend Tasks:
- Create module/category/content/quiz schema and seed strategy.
- Implement endpoints for category content, quiz retrieval, and score save.
- Store attempt history and score summary per user.

Frontend Tasks:
- Build module/category list UI.
- Build theory content page and quiz runner UI.
- Show score/result and progress summary.

AI Tasks:
- Optional later: adaptive quiz difficulty recommendations from attempt history.

## Phase 4 - Hijaiyah Canvas MVP

Backend Tasks:
- Define payload contract for stroke points and target letter.
- Implement `/api/hijaiyah/validate` endpoint and persistence for attempts.
- Add threshold configuration per letter for pass/fail result.

Frontend Tasks:
- Build letter picker and drawing canvas UI.
- Send stroke data to validation endpoint and display feedback.
- Implement retry flow and success state/feedback screen.

AI Tasks:
- Implement deterministic stroke normalization and similarity scoring.
- Build calibration utility for per-letter thresholds.
- Log evaluation metrics (score distribution, fail/pass rates) for model upgrade readiness.

## Phase 5 - Dashboard Orchestration

Backend Tasks:
- Build aggregated progress query for dashboard cards.
- Add endpoint/service for user module completion snapshot.

Frontend Tasks:
- Implement dashboard cards linking all modules.
- Show progress indicators for Quran, Learning, and Hijaiyah modules.

AI Tasks:
- Optional: personalized “next best activity” suggestion card.

## Phase 6 - Testing and Hardening

Backend Tasks:
- Integration tests for auth, profile, learning, quran, and hijaiyah routes.
- Security checks for authorization, validation, and rate limiting.

Frontend Tasks:
- Component tests for forms, quiz flow, and dashboard cards.
- E2E flow tests for critical user journeys.

AI Tasks:
- Validate hijaiyah scoring consistency with golden test samples.
- Add regression tests for threshold and similarity changes.

## Phase 7 - Release Readiness

Backend Tasks:
- Finalize migrations, seed scripts, and production env vars.
- Add logs/monitoring for API, auth, and validation endpoints.

Frontend Tasks:
- Final UI polish from Figma and responsive QA pass.
- Improve accessibility and empty/error UX states.

AI Tasks:
- Freeze MVP scoring parameters and baseline metrics.
- Prepare roadmap for V2 (adaptive scoring or ML handwriting model).

## 8. Testing Matrix

Auth:
- register -> login -> access protected page -> logout
- forgot password -> reset -> login with new password

Quran:
- list Surah/Juz
- open reader
- external API failure fallback

Learning:
- module select
- read theory
- take quiz
- save and show score

Hijaiyah:
- choose letter
- draw and submit
- invalid attempt loop
- success message

Profile:
- edit profile persistence
- change password constraints

## 9. Initial Dependency Plan

Expected additions (implementation stage):
- Auth and security: next-auth, @auth/prisma-adapter, bcryptjs, zod
- DB: prisma, @prisma/client, pg
- Optional utilities: react-hook-form, @hookform/resolvers
- Testing: vitest or jest, @testing-library/react, playwright

## 10. Open Decisions for Production Cut

- Email provider for reset password:
  - start with development token flow, then integrate provider before production
- Quran API strategy:
  - single provider first, fallback provider abstraction later if needed
- Canvas scoring strictness:
  - fixed threshold per letter in MVP, adaptive threshold after user data collection

## 11. Immediate Next Actions

1. Implement and apply Figma design to the existing Phase 0 structure.
2. Resume with Phase 1: add Prisma and initialize PostgreSQL schema.
3. Integrate Auth.js and protect authenticated routes.
4. Build Quran reader module first (after auth), then continue by priority.
