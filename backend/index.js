const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

// Add CORS middleware with specific origin
app.use(
  cors({
    origin: "http://localhost:8080", // or whatever port your frontend runs on
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// POST /api/mt5/fetch: Receives MT5 credentials and returns analytics
app.post("/api/mt5/fetch", (req, res) => {
  const { server, login, password } = req.body;
  const py = spawn("python", [
    __dirname + "/mt5_fetch.py",
    server,
    login,
    password,
  ]);

  let data = "";
  py.stdout.on("data", (chunk) => {
    data += chunk;
  });
  py.stderr.on("data", (err) => {
    console.error(err.toString());
  });

  py.on("close", (code) => {
    if (code === 0) {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: "Invalid JSON from Python script" });
      }
    } else {
      res.status(500).json({ error: "Failed to fetch MT5 data" });
    }
  });
});

app.listen(5000, () => console.log("API running on port 5000"));
