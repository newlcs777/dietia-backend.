import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

app.post("/api/gerarDieta", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });

  try {
    console.log("🧠 Enviando prompt para Gemini...");
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erro na API Gemini:", data);
      return res.status(500).json({ error: "Erro ao gerar dieta com Gemini." });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Nenhuma resposta gerada.";
    res.json({ dieta: text });
  } catch (error) {
    console.error("❌ Falha geral:", error);
    res.status(500).json({ error: "Falha geral ao gerar dieta." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
