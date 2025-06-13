# MT5 Integration Backend

This backend service enables your web application to connect to MetaTrader 5 (MT5) using user-provided credentials, fetch trading/account data, and return analytics for visualization in your frontend.

---

## Directory Structure

```
backend/
  index.js         # Node.js Express API server
  mt5_fetch.py     # Python script for MT5 data fetching
  requirements.txt # Python dependencies
```

---

## Setup Instructions

### 1. Prerequisites

- Node.js (v16+ recommended)
- Python 3.8+
- MetaTrader5 terminal must be installed on the backend server (for MetaTrader5 Python package to work)

### 2. Install Dependencies

#### a. Node.js dependencies

```powershell
cd backend
npm install express cors
```

#### b. Python dependencies

```powershell
pip install -r requirements.txt
```

---

## 3. Files and Their Purpose

### a. `index.js`

- Express server exposing `/api/mt5/fetch` endpoint
- Receives POST requests with `{ server, login, password }`
- Calls the Python script and returns analytics JSON

### b. `mt5_fetch.py`

- Connects to MT5 using MetaTrader5 Python package
- Fetches account info and trade history
- Processes and returns analytics as JSON

### c. `requirements.txt`

- Lists Python dependencies (MetaTrader5, etc.)

---

## 4. Running the Backend

```powershell
# In the backend directory
node index.js
```

---

## 5. Example API Usage

POST to `http://localhost:5000/api/mt5/fetch` with JSON body:

```json
{
  "server": "YourMT5Server",
  "login": "12345678",
  "password": "yourpassword"
}
```

Response: Analytics and trade data in JSON format.

---

## 6. Security Notes

- Credentials are used only for the session and never stored.
- Use HTTPS in production.

---

## 7. Changes Performed

- Added `backend/` directory with Node.js Express API and Python MT5 integration script.
- Provided instructions for setup and usage.
- No changes made to the frontend yet; you must POST credentials from your React app to `/api/mt5/fetch` and handle the returned analytics.

---

## 8. Extending Functionality

- You can expand `mt5_fetch.py` to process and return more analytics as needed (e.g., win/loss stats, pips, lots, etc.).
- For MT4, a different integration approach is required (not included here).
