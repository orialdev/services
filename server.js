import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 8080;

// Habilita CORS para o painel web
app.use(cors());

// Endpoint para receber analytics
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
  console.log("Novo registro:", data);

  res.json({ status: "ok" });
});

// Endpoint para fornecer logs ao painel web
app.get("/logs", (req, res) => {
  if (!fs.existsSync("analytics_log.json")) {
    return res.json([]);
  }

  const logs = fs.readFileSync("analytics_log.json", "utf-8")
    .split("\n")
    .filter(l => l.trim() !== "")
    .map(JSON.parse);

  res.json(logs);
});

app.listen(PORT, () => console.log(`✅ Analytics ativo na porta ${PORT}`));
