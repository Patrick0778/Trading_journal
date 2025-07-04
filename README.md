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

# Trading Journal - Modern Web Application

A comprehensive trading journal web application with MT5 integration, modern UI, and advanced analytics. Built with React, TypeScript, Supabase, and Node.js.

## 🚀 Features

### 📊 Dashboard Overview

- **Key Statistics**: Total trades, win/loss percentage, profit factor, average R:R, cumulative P&L
- **Visual Analytics**: Pie charts for win/loss distribution, bar graphs by strategy
- **Real-time Updates**: Live data from MT5 and manual entries

### 📝 Trade Log Management

- **Searchable & Sortable Table**: Find trades quickly with advanced filtering
- **Comprehensive Columns**: Date, ticker, direction, entry/exit prices, size, P&L, notes, tags
- **Advanced Filters**: By strategy, market condition, instrument type, win/loss status

### ➕ Trade Entry Form

- **Intuitive Interface**: Dropdown selections for instrument, setup, outcome
- **Auto-calculation**: R:R ratios and percentage gains/losses
- **Screenshot Upload**: Attach charts and trade screenshots
- **Tagging System**: Add custom tags for better organization

### 📈 Analytics & Charts

- **Equity Curve**: Cumulative P&L visualization over time
- **Performance Breakdown**: By strategy, day of week, time of day
- **Heatmaps**: Best trading hours and performance patterns
- **R:R Analysis**: Compare actual vs. ideal risk-reward ratios

### 🏷️ Tagging & Notes System

- **Custom Tags**: Create tags like "FOMO", "A+ setup", "News event"
- **Markdown Support**: Rich formatting for trade notes
- **Daily Notes**: Track market conditions and observations

### 🌙 Modern UI/UX

- **Dark Mode**: Toggle between light and dark themes
- **Mobile Responsive**: Optimized for all device sizes
- **Modern Design**: Clean, professional interface with minimal glare
- **Accessibility**: High contrast and keyboard navigation support

### 📁 Data Import

- **Multiple Formats**: Support for Excel (.xlsx), CSV, and PDF files
- **MT5 Integration**: Direct connection to MetaTrader 5 for automatic data import
- **Manual Entry**: Add trades individually with detailed forms

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for modern components
- **Recharts** for data visualization
- **React Router** for navigation
- **React Query** for data fetching

### Backend

- **Node.js** with Express
- **Python** for MT5 integration
- **Supabase** for database and authentication
- **File Upload** support for multiple formats

### Database

- **Supabase PostgreSQL** for data storage
- **Real-time subscriptions** for live updates

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.8+
- MetaTrader 5 terminal (for MT5 integration)
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Trading_journal
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
pip install -r requirements.txt
cd ..
```

### 4. Environment Setup

#### Supabase Configuration

1. Create a new Supabase project
2. Run the following SQL to create the trades table:

```sql
create table public.trades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  date timestamptz,
  ticker text,
  direction text,
  entry double precision,
  exit double precision,
  size double precision,
  pnl double precision,
  notes text,
  tags text[],
  strategy text,
  market_condition text,
  instrument_type text,
  win_loss text,
  screenshot_url text,
  created_at timestamptz default now()
);
```

3. Update `src/integrations/supabase/client.ts` with your Supabase URL and key

#### Backend Configuration

1. Update `backend/mt5_fetch.py` with your Supabase credentials
2. Ensure MetaTrader 5 is installed and accessible

### 5. Start Development Servers

#### Frontend

```bash
npm run dev
```

#### Backend

```bash
cd backend
npm run dev
```

## 🎯 Usage Guide

### Adding Trades

#### Manual Entry

1. Click "Add Trade" button in the dashboard
2. Fill in trade details:
   - Date and time
   - Ticker/symbol
   - Direction (Buy/Sell)
   - Entry and exit prices
   - Position size
   - P&L
   - Strategy and market conditions
   - Notes and tags
3. Click "Add Trade" to save

#### File Upload

1. Click the "Upload" button
2. Select your file (CSV, Excel, or PDF)
3. The system will parse and import your trades automatically

#### MT5 Integration

1. Go to the MT5 integration section
2. Enter your MT5 credentials
3. Click "Fetch Trades" to import your trading history

### Analyzing Performance

#### Dashboard Overview

- View key metrics at a glance
- Monitor win rate and profit factor
- Track cumulative P&L over time

#### Trade Log

- Search and filter trades
- Sort by any column
- Export data for external analysis

#### Analytics Charts

- **Equity Curve**: See your cumulative performance
- **Win/Loss Distribution**: Understand your trading outcomes
- **Strategy Performance**: Compare different approaches
- **Monthly Breakdown**: Track performance by time period

### Customization

#### Tags and Notes

- Create custom tags for trade categorization
- Use markdown formatting in notes
- Add daily market observations

#### Theme

- Toggle between light and dark modes
- System theme detection
- Persistent theme preferences

## 🔧 API Endpoints

### Backend API (Port 5000)

#### MT5 Integration

- `POST /api/mt5/fetch` - Fetch trades from MT5
- `GET /api/trades` - Get all trades
- `POST /api/trades` - Add new trade

#### File Upload

- `POST /api/upload-trades` - Upload and parse trade files

#### Trade Management

- `GET /api/trades/:id` - Get specific trade
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade

## 📱 Mobile Support

The application is fully responsive and optimized for:

- **Desktop**: Full feature set with advanced charts
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface for on-the-go trading

## 🔒 Security Features

- **Authentication**: Supabase Auth integration
- **Data Encryption**: Secure data transmission
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured for secure cross-origin requests

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
```

### Backend (Railway/Heroku)

```bash
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Changelog

### v2.0.0 - Major Update

- ✅ MT5 integration
- ✅ File upload support (CSV, Excel, PDF)
- ✅ Modern UI with dark mode
- ✅ Advanced analytics and charts
- ✅ Tagging and notes system
- ✅ Mobile responsive design
- ✅ Supabase integration
- ✅ Real-time data updates

---

**Built with ❤️ for traders who want to improve their performance through better journaling and analysis.**
