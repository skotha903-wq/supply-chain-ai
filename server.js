const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

app.post("/api/parse-email", async (req, res) => {
  try {
    const { email } = req.body;
    const prompt = `Extract ASN data from this email and return ONLY valid JSON with these exact fields: reference, supplier, shipFrom, shipTo, carrier, tracking, eta, shipmentType (local/international/urgent), totalValue, incoterms, items (array of {sku, description, qty, unitPrice, hsCode}). No markdown, no explanation, just raw JSON.\n\nEmail:\n${email}`;
    const text = await callGroq(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/insight", async (req, res) => {
  try {
    const { prompt } = req.body;
    const text = await callGroq(prompt);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.send("Supply Chain AI backend running."));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
