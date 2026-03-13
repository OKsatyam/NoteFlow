# Architecture & Error Handling Refactor Document

This document summarizes the recent changes made to introduce a proper error handling system and improve the separation of concerns between the controllers and services.

## 1. Custom Error Class (`AppError.ts`)

**File**: `src/utils/AppError.ts`

Created a centralized error class `AppError` extending the native `Error`.
It standardizes error reporting by attaching:
- `statusCode`: HTTP status code (e.g., 400, 404, 500)
- `isOperational`: A boolean to distinguish trusted, predicted errors (like validation or "Not Found") from actual unhandled programming bugs.

## 2. Global Error Middleware (`error.middleware.ts`)

**File**: `src/middleware/error.middleware.ts`

Refactored the Express error handling middleware to interpret standard errors and `AppError`s differently:
- intercepts exceptions caught by `next(error)` in the controller catch blocks.
- If the error is an `instanceof AppError`, its explicit `statusCode` and `message` are returned.
- If it is a generic, unhandled exception, it defaults to `500 Internal Server Error`.
- Guarantees a consistent JSON response shape (`{ success: false, message: ... }`) instead of raw HTML crash pages.

## 3. Service Layer Refactor (`page.service.ts`)

**File**: `src/services/page.service.ts`

Moved all business logic, database lookups, and constraint-checking into the service layer function `createPageService()`.
- Replaced basic JavaScript `throw new Error()` calls with semantic `AppError` constructs (e.g., `throw new AppError("Username is required", 400)`).
- Decoupled `req` and `res` objects from the logic execution so the service is easily testable and reusable.

## 4. Controller Layer Thinning (`page.controller.ts`)

**File**: `src/controllers/page.controller.ts`

Rebuilt the controller `createPage()` to act purely as an HTTP orchestrator:
- Takes the incoming HTTP values (`req.body`).
- Passes the arguments to the `createPageService` layer.
- Immediately catches success to resolve HTTP `201 Created`.
- Sends any raised exceptions down the Express chain dynamically by calling `next(error)`, which passes control directly to `error.middleware.ts`.

## 5. Middleware Chain (`app.ts`)

**File**: `src/app.ts`

Ensured that the application executes routing correctly by shifting `app.use(errorHandler)` to the absolute **bottom** of the pipeline (below the `pageRoutes`). This ensures Express forwards unhandled route errors to your global error wrapper rather than abandoning the request.
