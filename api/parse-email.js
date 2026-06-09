export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
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
      "qty": 0,
      "unitPrice": "unit price as string",
      "hsCode": "HS code if international or null"
    }
  ]
}

Email:
${email}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch(e) {
    res.status(500).json({ error: "Failed to parse: " + e.message });
  }
}
