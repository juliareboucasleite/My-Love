const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DB_FILE = "comentarios.json";

app.use(express.json());
app.use(cors());

// Listar comentários
app.get("/comentarios", (req, res) => {
  const data = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];
  res.json(data);
});

// Salvar comentário
app.post("/comentarios", (req, res) => {
  const data = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];
  data.push(req.body);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
