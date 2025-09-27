const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// conexão com o MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // seu usuário
  password: "senha", // sua senha
  database: "mylove"
});

// rota para buscar todos os comentários
app.get("/comentarios", (req, res) => {
  db.query("SELECT * FROM comentarios ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// rota para salvar novo comentário
app.post("/comentarios", (req, res) => {
  const { trechoId, texto, comentario } = req.body;
  if (!trechoId || !texto || !comentario) {
    return res.status(400).json({ error: "Faltam campos obrigatórios" });
  }

  db.query(
    "INSERT INTO comentarios (trechoId, texto, comentario) VALUES (?, ?, ?)",
    [trechoId, texto, comentario],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, trechoId, texto, comentario });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
