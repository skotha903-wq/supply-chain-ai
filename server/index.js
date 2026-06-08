import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { readFileSync } from "fs";

const env = readFileSync(".env", "utf8");
const GROQ_KEY = env.match(/GROQ_KEY=(.+)/)?.[1]?.trim();

const app = express();
app.use(cors());
app.use(express.json());

async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

app.post("/api/insight", async (req, res) => {
  const { prompt } = req.body;
  try {
    const text = await callGroq(prompt);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ text: "Error: " + e.message });
  }
});

app.post("/api/parse-email", async (req, res) => {
  const { email } = req.body;
  const prompt = `You are a supply chain data extraction expert. Extract ASN data from this supplier email and return ONLY a JSON object with no explanation, no markdown, no backticks.

Return exactly this structure:
{
  "reference": "ASN reference number or PO number",
  "supplier": "supplier company name",
  "shipFrom": "origin address or port",
  "shipTo": "destination address",
  "carrier": "carrier or vessel name",
  "tracking": "tracking number or bill of lading",
  "eta": "estimated arrival date",
  "shipmentType": "local or international",
  "totalValue": "total value with currency",
  "incoterms": "incoterms if international or null",
  "items": [
    {
      "sku": "product SKU",
      "description": "product name",
      "qty": quantity as number,
      "unitPrice": "unit price as string",
      "hsCode": "HS code if international or null"
    }
  ]
}

Email:
${email}`;

  try {
    const text = await callGroq(prompt);
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: "Failed to parse email: " + e.message });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
