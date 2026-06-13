export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "No email provided" });
  const GROQ_KEY = process.env.GROQ_KEY;
  if (!GROQ_KEY) return res.status(500).json({ error: "GROQ_KEY not set in Vercel environment variables" });
  const prompt = `Parse this supplier email and extract TWO structured ASN documents.\nASN 1 = formal structured ASN with all fields.\nASN 2 = simplified warehouse-ready version.\nInclude: ASN Reference, PO Number, Supplier, Ship Date, ETA, Carrier, Tracking, Line Items (SKU, Description, Qty, UOM, Batch, Expiry), Totals.\nSeparate with ---\n\nEmail:\n${email}`;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.1 }) });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const parts = text.split("---");
    return res.json({ asn1: parts[0]?.trim() || text, asn2: parts[1]?.trim() || "" });
  } catch (err) { return res.status(500).json({ error: `Groq API error: ${err.message}` }); }
}
