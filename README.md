# Market Return Graphs

## Project info

This project is a modern web application for visualizing and analyzing market returns, built with React, TypeScript, Vite, shadcn-ui, and Tailwind CSS. It provides an interactive dashboard for users to view trading performance, select accounts, and analyze trading statistics through dynamic charts and tables.

## How does this project work?

This project is a modern web application for visualizing and analyzing market returns, built with React, TypeScript, Vite, shadcn-ui, and Tailwind CSS. It provides an interactive dashboard for users to view trading performance, select accounts, and analyze trading statistics through dynamic charts and tables.

### Key Features

- **Performance Chart**: Visualizes market returns and trading performance over time using interactive charts.
- **Account Selector**: Allows users to switch between different trading accounts to view specific data.
- **Trading Dashboard**: Central hub displaying key metrics, charts, and trading statistics in a user-friendly layout.
- **Trading Stats**: Summarizes important statistics such as total returns, win/loss ratios, and other performance indicators.
- **Authentication**: Secure login and account management, integrated with Supabase for backend authentication and data storage.
- **Responsive UI**: Built with shadcn-ui and Tailwind CSS for a consistent, mobile-friendly experience.

### Architecture Overview

- **Frontend**: Developed with React and TypeScript for robust, type-safe UI components. Vite is used for fast development and build tooling.
- **UI Components**: Modular components (charts, tables, selectors) are organized under `src/components` and `src/components/ui` for reusability and maintainability.
- **State Management**: React hooks and context are used for managing application state, user authentication, and data fetching.
- **Backend Integration**: Supabase is used for authentication and as a backend service for storing and retrieving user and trading data.
- **Styling**: Tailwind CSS provides utility-first styling, while shadcn-ui offers accessible, customizable UI primitives.

### User Flow

1. **Authentication**: Users log in or sign up to access their personalized dashboard.
2. **Account Selection**: Users select a trading account to view specific performance data.
3. **Dashboard Interaction**: Users explore charts and statistics, filter data, and analyze trading performance.
4. **Real-Time Updates**: The dashboard updates dynamically as users interact with different components or as new data becomes available.

### File Structure Highlights

- `src/components/` – Main React components (charts, dashboard, selectors, stats)
- `src/components/ui/` – UI primitives and reusable elements (buttons, dialogs, tables, etc.)
- `src/pages/` – Page-level components (authentication, main dashboard, not found)
- `src/integrations/supabase/` – Supabase client and type definitions
- `src/hooks/` – Custom React hooks for state and effect management

This architecture ensures a scalable, maintainable, and high-performance application for market return analysis.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project using any modern static hosting provider (such as Vercel, Netlify, or GitHub Pages) or your own infrastructure. Build the project with:

```sh
npm run build
```

Then follow your hosting provider's instructions to deploy the contents of the `dist` folder.

## Can I connect a custom domain to my project?

Yes, most hosting providers allow you to connect a custom domain. Refer to your provider's documentation for step-by-step instructions.

---

### How to Adjust Project Branding and URLs

- **Project Name & Branding**: Update the project name, logo, and any references in the codebase or UI to reflect your own branding.
- **URLs**: Replace placeholder URLs (such as `<YOUR_GIT_URL>`, `<YOUR_PROJECT_NAME>`) with your actual repository and project names.
- **Deployment**: Update deployment instructions to match your chosen hosting provider.
- **Remove Third-Party Branding**: Ensure all references to previous platforms or services are removed from documentation and UI.

If you need to further customize the project, review the codebase for any hardcoded references and update them as needed.

how to access lovable bot for this project
Simply visit the [Lovable Project](https://lovable.dev/projects/7dfef052-3889-480b-ab01-a499669c99ed) and start prompting.