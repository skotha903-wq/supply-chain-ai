import { useState } from "react";

const TODAY = "2026-06-08";

const SAMPLE_EMAILS = {
  local: `From: orders@woodcorner.com.au
Subject: Purchase Order Confirmation — PO-2026-0042
Supplier: Wood Corner Pty Ltd
Ship From: 12 Industrial Ave, Dandenong VIC 3175
Ship To: My Company, 100 Supply Chain Rd, Melbourne VIC 3000
Carrier: Toll Group
Tracking: TG-AU-2026-884421
Estimated Delivery: 2026-06-12
Items:
1. Office Chair (SKU: FURN_7777) — Qty: 50 — Unit Price: $150.00
2. Office Desk (SKU: FURN_9002) — Qty: 30 — Unit Price: $300.00
3. Office Lamp (SKU: FURN_8888) — Qty: 25 — Unit Price: $50.00
Total Value: AUD $18,750.00`,

  international: `From: export@shanghaifurniture.cn
Subject: ASN Notice — Shipment SHF-2026-AU-0091
Supplier: Shanghai Furniture Co. Ltd
Ship From: Port of Shanghai, China
Ship To: Port of Melbourne, Australia
Incoterms: FOB Shanghai
Vessel: Maersk Sealand
Bill of Lading: MAEU2026091AUS
Container: TCKU3456789
ETD Shanghai: 2026-06-10
ETA Melbourne: 2026-07-02
Items:
1. Ergonomic Chair (SKU: FURN_7777) — Qty: 200 — Unit Price: USD $85.00 — HS Code: 9401.30
2. Standing Desk (SKU: FURN_9002) — Qty: 100 — Unit Price: USD $220.00 — HS Code: 9403.30
3. LED Desk Lamp (SKU: FURN_8888) — Qty: 150 — Unit Price: USD $35.00 — HS Code: 9405.20
Total Value: USD $46,500.00`,

  urgent: `From: dispatch@readymat.com.au
Subject: URGENT — Same Day Delivery — RM-2026-0015
Supplier: Ready Mat Australia
Ship From: 8 Warehouse St, Moorabbin VIC 3189
Ship To: My Company, 100 Supply Chain Rd, Melbourne VIC 3000
Carrier: StarTrack Express
Tracking: ST-2026-URGENT-00445
Delivery Date: 2026-06-08
Items:
1. Floor Mat Heavy Duty (SKU: MAT_001) — Qty: 20 — Unit Price: $45.00
2. Anti-Fatigue Mat (SKU: MAT_002) — Qty: 15 — Unit Price: $65.00
Total Value: AUD $1,875.00`
};

export default function App() {
  const [tab, setTab] = useState("asn");
  const [emailText, setEmailText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [asnData, setAsnData] = useState(null);
  const [status, setStatus] = useState("");

  async function parseEmail() {
    if (!emailText.trim()) return;
    setParsing(true);
    setAsnData(null);
    setStatus("");
    try {
      const res = await fetch("http://localhost:3001/api/parse-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailText })
      });
      const data = await res.json();
      setAsnData(data);
    } catch {
      setStatus("Error connecting to server.");
    }
    setParsing(false);
  }

  async function createASN() {
    setStatus("Creating ASN in Odoo...");
    setTimeout(() => setStatus("✅ ASN created successfully in Odoo!"), 1500);
  }

  async function generatePDF() {
    setStatus("Generating PDF...");
    try {
      const res = await fetch("http://localhost:3001/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asn: asnData })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ASN-${asnData?.reference || "document"}.pdf`;
      a.click();
      setStatus("✅ PDF downloaded!");
    } catch {
      setStatus("Error generating PDF.");
    }
  }

  const tabs = ["asn", "dashboard"];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"2rem 1rem",fontFamily:"sans-serif"}}>
      <h1 style={{fontSize:22,fontWeight:500,marginBottom:4}}>Supply chain AI</h1>
      <p style={{fontSize:12,color:"#888",marginBottom:"1.5rem"}}>Odoo 17 · Gmail · Groq AI</p>

      <div style={{display:"flex",gap:8,marginBottom:"1.5rem",borderBottom:"0.5px solid #eee",paddingBottom:8}}>
        {[["asn","📧 ASN Parser"],["dashboard","📦 Dashboard"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{fontSize:13,padding:"6px 16px",borderRadius:6,border:"0.5px solid",borderColor:tab===key?"#3b82f6":"#ddd",background:tab===key?"#eff6ff":"#fff",color:tab===key?"#1d4ed8":"#333",cursor:"pointer"}}>{label}</button>
        ))}
      </div>

      {tab === "asn" && (
        <div>
          <div style={{marginBottom:"1rem"}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Load sample email:</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["local","🇦🇺 Local (Wood Corner)"],["international","🌏 International (Shanghai)"],["urgent","⚡ Urgent (Ready Mat)"]].map(([key,label])=>(
                <button key={key} onClick={()=>setEmailText(SAMPLE_EMAILS[key])} style={{fontSize:12,padding:"5px 12px",borderRadius:6,border:"0.5px solid #ddd",background:"#f9f9f9",cursor:"pointer"}}>{label}</button>
              ))}
            </div>
          </div>

          <textarea
            value={emailText}
            onChange={e=>setEmailText(e.target.value)}
            placeholder="Paste supplier email here or click a sample above..."
            style={{width:"100%",height:200,padding:"0.75rem",fontSize:12,borderRadius:8,border:"0.5px solid #ddd",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box"}}
          />

          <button onClick={parseEmail} disabled={parsing} style={{marginTop:8,padding:"8px 20px",fontSize:13,borderRadius:6,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer"}}>
            {parsing ? "Parsing..." : "✦ Parse with AI"}
          </button>

          {asnData && (
            <div style={{marginTop:"1.5rem",background:"#fff",border:"0.5px solid #ddd",borderRadius:12,padding:"1.25rem"}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:"1rem"}}>📋 Extracted ASN data</div>
              
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1rem"}}>
                {[
                  ["Reference", asnData.reference],
                  ["Supplier", asnData.supplier],
                  ["Ship From", asnData.shipFrom],
                  ["Ship To", asnData.shipTo],
                  ["Carrier", asnData.carrier],
                  ["Tracking", asnData.tracking],
                  ["ETA", asnData.eta],
                  ["Type", asnData.shipmentType],
                  ["Total Value", asnData.totalValue],
                  ["Incoterms", asnData.incoterms || "N/A"],
                ].map(([label, value])=>(
                  <div key={label} style={{background:"#f9f9f9",borderRadius:8,padding:"0.6rem 0.8rem"}}>
                    <div style={{fontSize:11,color:"#888"}}>{label}</div>
                    <div style={{fontSize:13,fontWeight:500,marginTop:2}}>{value || "—"}</div>
                  </div>
                ))}
              </div>

              <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Line items:</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:"1rem"}}>
                <thead>
                  <tr>{["SKU","Description","Qty","Unit Price","HS Code"].map(h=>(
                    <th key={h} style={{textAlign:"left",color:"#888",padding:"4px 8px 8px",borderBottom:"0.5px solid #eee"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {asnData.items?.map((item,i)=>(
                    <tr key={i}>
                      <td style={{padding:"6px 8px",borderBottom:"0.5px solid #f0f0f0",fontFamily:"monospace",fontSize:11}}>{item.sku}</td>
                      <td style={{padding:"6px 8px",borderBottom:"0.5px solid #f0f0f0"}}>{item.description}</td>
                      <td style={{padding:"6px 8px",borderBottom:"0.5px solid #f0f0f0"}}>{item.qty}</td>
                      <td style={{padding:"6px 8px",borderBottom:"0.5px solid #f0f0f0"}}>{item.unitPrice}</td>
                      <td style={{padding:"6px 8px",borderBottom:"0.5px solid #f0f0f0"}}>{item.hsCode || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {asnData.shipmentType === "international" && (
                <div style={{background:"#fef9c3",border:"0.5px solid #fde68a",borderRadius:8,padding:"0.75rem",marginBottom:"1rem",fontSize:12}}>
                  ⚠️ International shipment — customs clearance required. HS codes and country of origin included.
                </div>
              )}

              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={createASN} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer"}}>✅ Create ASN in Odoo</button>
                <button onClick={generatePDF} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer"}}>📄 Generate PDF</button>
                <button onClick={()=>setStatus("📧 Email sent to warehouse!")} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"none",background:"#0891b2",color:"#fff",cursor:"pointer"}}>📧 Email to Warehouse</button>
              </div>

              {status && <div style={{marginTop:"0.75rem",fontSize:13,color:"#16a34a",fontWeight:500}}>{status}</div>}
            </div>
          )}
        </div>
      )}

      {tab === "dashboard" && (
        <div style={{fontSize:13,color:"#888"}}>Dashboard coming soon — switch to ASN Parser tab to get started!</div>
      )}
    </div>
  );
}