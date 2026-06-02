import express from "express";

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "bukhari-perfumes-server" });
});

export default app;
