# Telapsi

### [Click here for live preview!](https://telapsi-lit-2025.web.app)

---

## Overview

Telapsi is an educational dashboard and landing page built with modern web technologies. It is designed to provide responsive, accessible, and intuitive interfaces for professors and users, running alongside Firebase and integrating with Google authentication.

---

## Features

- **Landing Page**: Public facing entry point to the application.
- **Google OAuth Login**: Secure authentication for professors.
- **Professor Dashboard**: Protected routes and specialized interfaces for educators.
- **Internationalization**: Support for multiple languages via `i18next`.
- **Responsive Design**: Mobile-friendly layouts for on-the-go access.

## How does it work?

1. **Authentication & Routing**
   - The user visits the landing page (`/`).
   - Through the `Login` page (`/login`), users can authenticate via Google OAuth.
   - Successful authentication stores context and allows access to the `Professor` dashboard (`/professor`) via protected routes.

2. **Localization**
   - `i18next` handles translation strings, allowing the interface to respond to different language preferences seamlessly.

## Installation

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd telapsi`
3. Install dependencies: `npm install`
4. Set up your `.env` file with Firebase and Google OAuth keys (refer to `.env.example`).
5. Run the development server with Vite: `npm run dev`

## Usage

1. Start the dev server using `npm run dev`.
2. Visit the local host address provided in your terminal (usually `http://localhost:5173`).
3. Access the landing page and click the login button to test Google Authentication.
4. Navigate through the protected Professor dashboard.

---

## Technologies

- `ReactJS`
- `Vite`
- `React Router DOM`
- `Firebase`
- `Google OAuth`
- `i18next`

## AI Usage

This project's development and validation were accelerated with the help of the "Squad," a specs-driven group of AI agents. Specifically, the Squad was utilized for:

- **Codebase Auditing**: Identifying performance bottlenecks, such as N+1 queries during database calls, and orphan components.
- **UI/UX & Best Practices**: Spotting React anti-patterns (such as using index as key in maps) and ensuring optimal layout rendering.
- **Responsive Validations**: Verifying mobile layouts, touch target sizing according to WCAG guidelines, and overall accessibility.
- **Localization Checks**: Scanning for missing translation strings and hardcoded texts.
- **Security & SAST**: Discovering inadvertently exposed API keys and validating proper `.env` architecture patterns.

---

Copyright (c) 2026 Laboratório de Inovações Tecnológicas (LIT). All rights reserved; usage, distribution, or copying of this project without explicit authorization is strictly prohibited.
