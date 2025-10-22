import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Endpoint para receber logs
app.get("/analytics", (req, res) => {
  const data = {
    timestamp: new Date().toISOString(),
    script: req.query.a_reading || "unknown",
    gameName: req.query.a_game || "unknown",
    gameId: req.query.a_gameId || "unknown",
    userId: req.query.a_uqid || "unknown",
    executor: req.query.a_exec || "unknown"
  };
  fs.appendFileSync("analytics_log.json", JSON.stringify(data) + "\n");
  console.log("New log:", data);
  res.json({ status: "ok" });
});

// Endpoint para fornecer logs ao dashboard
app.get("/logs", (req, res) => {
  if (!fs.existsSync("analytics_log.json")) return res.json([]);
  const logs = fs.readFileSync("analytics_log.json", "utf-8")
    .split("\n")
    .filter(l => l.trim() !== "")
    .map(JSON.parse);
  res.json(logs);
});

app.listen(PORT, () => console.log(`✅ Analytics running on port ${PORT}`));
