const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const app = express();

// Supabase configuration
const SUPABASE_URL = "https://uatxrhkbslqnfazzodyo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdHhyaGtic2xxbmZhenpvZHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjUwODcsImV4cCI6MjA2NDU0MTA4N30.RvrbYmZ5bew9lDFyjFolswBk-TxN-YMdm8hbdy6ugZs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only CSV, Excel, and PDF files are allowed."
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Add CORS middleware with specific origin
app.use(
  cors({
    origin: "http://localhost:8080", // or whatever port your frontend runs on
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// POST /api/mt5/fetch: Receives MT5 credentials and returns analytics
app.post("/api/mt5/fetch", (req, res) => {
  const { server, login, password } = req.body;

  if (!server || !login || !password) {
    return res
      .status(400)
      .json({ error: "Missing required fields: server, login, password" });
  }

  const py = spawn("python", [
    __dirname + "/mt5_fetch.py",
    server,
    login,
    password,
  ]);

  let data = "";
  let errorData = "";

  py.stdout.on("data", (chunk) => {
    data += chunk;
  });

  py.stderr.on("data", (err) => {
    errorData += err.toString();
    console.error(err.toString());
  });

  py.on("close", (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (e) {
        res
          .status(500)
          .json({
            error: "Invalid JSON from Python script",
            details: e.message,
          });
      }
    } else {
      res.status(500).json({
        error: "Failed to fetch MT5 data",
        details: errorData || "Python script failed",
        code: code,
      });
    }
  });
});

// GET /api/trades: Fetch all trades from Supabase
app.get("/api/trades", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ trades: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trades: Add a new trade manually
app.post("/api/trades", async (req, res) => {
  try {
    const tradeData = req.body;

    const { data, error } = await supabase
      .from("trades")
      .insert([tradeData])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ trade: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/trades/:id: Update a trade
app.put("/api/trades/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tradeData = req.body;

    const { data, error } = await supabase
      .from("trades")
      .update(tradeData)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ trade: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/trades/:id: Delete a trade
app.delete("/api/trades/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("trades").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload-trades: Upload and parse trade files
app.post("/api/upload-trades", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let trades = [];

    // Parse file based on type
    if (fileType === "text/csv") {
      trades = await parseCSV(filePath);
    } else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
      trades = await parseExcel(filePath);
    } else if (fileType === "application/pdf") {
      trades = await parsePDF(filePath);
    }

    // Insert trades into Supabase
    if (trades.length > 0) {
      const { data, error } = await supabase
        .from("trades")
        .insert(trades)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        message: `Successfully imported ${trades.length} trades`,
        trades: data,
      });
    } else {
      res.status(400).json({ error: "No valid trades found in file" });
    }
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse CSV files
async function parseCSV(filePath) {
  const csv = require("csv-parser");
  const trades = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Map CSV columns to trade data structure
        const trade = {
          date: row.date || row.Date || row.DATE,
          ticker:
            row.ticker || row.Ticker || row.TICKER || row.symbol || row.Symbol,
          direction: row.direction || row.Direction || row.DIRECTION,
          entry: parseFloat(row.entry || row.Entry || row.ENTRY || 0),
          exit: parseFloat(row.exit || row.Exit || row.EXIT || 0),
          size: parseFloat(
            row.size || row.Size || row.SIZE || row.volume || row.Volume || 0
          ),
          pnl: parseFloat(
            row.pnl || row.PnL || row.PNL || row.profit || row.Profit || 0
          ),
          notes: row.notes || row.Notes || row.NOTES || "",
          tags: row.tags ? row.tags.split(",").map((tag) => tag.trim()) : [],
          strategy: row.strategy || row.Strategy || row.STRATEGY || "",
          market_condition: row.market_condition || row.Market_Condition || "",
          instrument_type: row.instrument_type || row.Instrument_Type || "",
          win_loss: row.win_loss || row.Win_Loss || row.WIN_LOSS || "",
          screenshot_url: row.screenshot_url || row.Screenshot_URL || "",
        };
        trades.push(trade);
      })
      .on("end", () => resolve(trades))
      .on("error", reject);
  });
}

// Helper function to parse Excel files
async function parseExcel(filePath) {
  const XLSX = require("xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row) => ({
    date: row.date || row.Date || row.DATE,
    ticker: row.ticker || row.Ticker || row.TICKER || row.symbol || row.Symbol,
    direction: row.direction || row.Direction || row.DIRECTION,
    entry: parseFloat(row.entry || row.Entry || row.ENTRY || 0),
    exit: parseFloat(row.exit || row.Exit || row.EXIT || 0),
    size: parseFloat(
      row.size || row.Size || row.SIZE || row.volume || row.Volume || 0
    ),
    pnl: parseFloat(
      row.pnl || row.PnL || row.PNL || row.profit || row.Profit || 0
    ),
    notes: row.notes || row.Notes || row.NOTES || "",
    tags: row.tags ? row.tags.split(",").map((tag) => tag.trim()) : [],
    strategy: row.strategy || row.Strategy || row.STRATEGY || "",
    market_condition: row.market_condition || row.Market_Condition || "",
    instrument_type: row.instrument_type || row.Instrument_Type || "",
    win_loss: row.win_loss || row.Win_Loss || row.WIN_LOSS || "",
    screenshot_url: row.screenshot_url || row.Screenshot_URL || "",
  }));
}

// Helper function to parse PDF files
async function parsePDF(filePath) {
  const pdf = require("pdf-parse");
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);

  // This is a basic implementation - PDF parsing is complex
  // You might need to implement more sophisticated parsing based on your PDF structure
  const lines = data.text.split("\n");
  const trades = [];

  // Basic parsing - adjust based on your PDF format
  for (const line of lines) {
    if (line.includes("TRADE") || line.includes("DEAL")) {
      // Parse trade data from line
      // This is a placeholder - implement based on your PDF structure
      const trade = {
        date: new Date().toISOString(),
        ticker: "UNKNOWN",
        direction: "UNKNOWN",
        entry: 0,
        exit: 0,
        size: 0,
        pnl: 0,
        notes: line,
        tags: [],
        strategy: "",
        market_condition: "",
        instrument_type: "",
        win_loss: "",
        screenshot_url: "",
      };
      trades.push(trade);
    }
  }

  return trades;
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(5000, () => console.log("API running on port 5000"));
