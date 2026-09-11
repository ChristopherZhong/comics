# AGENTS Guidelines & Conventions

This document outlines repository-wide coding conventions, architectural patterns, and developer preferences for AI agents and human contributors working on this project.

---

## 1. Code Style & Syntax Conventions

* **Function Syntax**:
  * Always use standard `function` declarations (`export function myFunction()`) for top-level functions and methods.
  * Do not use arrow syntax for top-level functions (`export const myFunction = () => ...`).
  * Arrow syntax is permitted for inline callbacks and anonymous parameters (e.g., `.map((item) => ...)`).

* **Variable & Parameter Naming**:
  * Single-letter variable names (such as `c`, `d`, `e`, `r`) are strictly prohibited.
  * Use clear, descriptive names (e.g., `comic`, `data`, `event`, `role`, `error`).

* **Object Key Sorting**:
  * Properties within object literals, configuration files, and Jest/Vite configs must be sorted in alphabetical order unless a specific execution order is functionally required.

* **Module Import Extensions**:
  * Always explicitly specify file extensions when importing configuration files or local modules where applicable (e.g., `import baseConfig from '../../eslint.config.ts';`).

* **ESM Syntax**:
  * Use ESM `import` and `export default` syntax across TypeScript configuration files (such as `jest.preset.ts`), avoiding CommonJS `require` / `module.exports`.

---

## 2. TypeScript & ESLint Rules

* **Strict Anti-`any` Policy**:
  * Never use the `any` type. Use explicit interfaces, generic types, or `unknown` when the type is not strictly determined.
  * `@typescript-eslint/no-explicit-any` is configured as an error.

* **No Lint Disabling Comments**:
  * Never use `eslint-disable` or `eslint-disable-next-line` comments.
  * Always fix underlying type or lint issues directly in code.

* **Explicit Return Types**:
  * All public methods and functions must declare explicit return types (`@typescript-eslint/explicit-module-boundary-types`).

---

## 3. NestJS & Swagger Conventions

* **Swagger JSDoc Comment Introspection**:
  * The project relies on the NestJS Swagger compiler plugin (`@nestjs/swagger/plugin`) configured in Webpack (`apps/backend/webpack.config.js`).
  * Document property descriptions, examples, and defaults using JSDoc comments (`/** Description */`) on classes and properties rather than explicit `@ApiProperty` / `@ApiPropertyOptional` decorators to avoid duplicating documentation in code.

* **DTO Mapped Types**:
  * Avoid re-declaring properties in DTOs. Derive DTOs from domain entities using NestJS Swagger mapped types (`PickType`, `OmitType`, `PartialType`, `IntersectionType`).

* **Module Array Alphabetization**:
  * In NestJS `@Module()` decorators, keep `controllers`, `exports`, `imports`, and `providers` arrays sorted alphabetically.

---

## 4. Environment Variables & Security

* **No Hardcoded Secret Fallbacks**:
  * Never hardcode fallback strings for sensitive credentials or keys (e.g., `JWT_SECRET`).
  * Throw an exception or register dynamically if required environment variables are missing.

---

## 5. Prisma & Database Model Conventions

* **User Roles**:
  * Roles are dynamic entities stored in the `Role` model (`roles Role[]`), not hardcoded enums. Represent assigned roles as string lists (`roles: string[]`) rather than single primary role strings.

* **Scanlation Group Relations**:
  * Many-to-many relationships that include additional metadata (such as URLs to translated comics or chapters) must use explicit join models (e.g., `ComicScanlationGroup` and `ChapterScanlationGroup`) with standard column definitions (`id`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`).

---

## 6. Testing & Environment Verification

* **Dependencies**:
  * Use `npm ci --legacy-peer-deps` when installing workspace dependencies.
* **Testing Command**:
  * Run unit tests across backend and frontend using `npx nx run-many -t test` and Vitest / Jest runners.
