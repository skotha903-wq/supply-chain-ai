import { useState } from "react";

const USERS = [{ username: "sarak", password: "S@ra2020" }];

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

const ODOO_DATA = [
  {name:"WH/OUT/00006",type:"Delivery",partner:"Wood Corner",date:"2026-05-21",state:"assigned"},
  {name:"WH/OUT/00002",type:"Delivery",partner:"Wood Corner",date:"2026-05-24",state:"assigned"},
  {name:"WH/OUT/00007",type:"Delivery",partner:"Wood Corner",date:"2026-06-01",state:"assigned"},
  {name:"WH/IN/00004",type:"Receipt",partner:"Wood Corner",date:"2026-06-08",state:"assigned"},
  {name:"WH/IN/00003",type:"Receipt",partner:"Wood Corner",date:"2026-06-08",state:"assigned"},
  {name:"WH/OUT/00001",type:"Delivery",partner:"Wood Corner",date:"2026-06-08",state:"assigned"},
  {name:"WH/IN/00006",type:"Receipt",partner:"Ready Mat",date:"2026-06-08",state:"assigned"},
];

const TODAY = "2026-06-08";
function isLate(s) { return s.date < TODAY; }

function Badge({ state, late }) {
  if (late) return <span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:500}}>Late</span>;
  if (state==="assigned") return <span style={{background:"#dcfce7",color:"#166534",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:500}}>Ready</span>;
  if (state==="draft") return <span style={{background:"#f3f4f6",color:"#6b7280",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:500}}>Draft</span>;
  return <span style={{background:"#fef9c3",color:"#854d0e",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:500}}>{state}</span>;
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) { onLogin(user.username); }
    else { setError("Invalid username or password."); }
  }

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"2.5rem 2rem",width:"100%",maxWidth:380,boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:32,marginBottom:8}}>📦</div>
          <div style={{fontSize:20,fontWeight:600,color:"#1e293b"}}>Supply Chain AI</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Odoo 17 · Groq AI · ASN Automation</div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Username</label>
          <input type="text" value={username} onChange={e=>{setUsername(e.target.value);setError("");}} placeholder="Enter username"
            style={{width:"100%",padding:"10px 12px",fontSize:13,borderRadius:8,border:"1px solid #e2e8f0",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Password</label>
          <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setError("");}} placeholder="Enter password"
            onKeyDown={e=>e.key==="Enter"&&handleLogin(e)}
            style={{width:"100%",padding:"10px 12px",fontSize:13,borderRadius:8,border:"1px solid #e2e8f0",boxSizing:"border-box",outline:"none"}}/>
        </div>
        {error && <div style={{fontSize:12,padding:"8px 12px",borderRadius:6,marginBottom:12,background:"#fef2f2",color:"#dc2626"}}>{error}</div>}
        <button onClick={handleLogin}
          style={{width:"100%",padding:"11px",fontSize:14,fontWeight:500,borderRadius:8,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [tab, setTab] = useState("asn");
  const [emailText, setEmailText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [asnData, setAsnData] = useState(null);
  const [status, setStatus] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={(u) => { setLoggedIn(true); setCurrentUser(u); }} />;
  }

  async function parseEmail() {
    if (!emailText.trim()) { setStatus("Please load or paste an email first."); return; }
    setParsing(true); setAsnData(null); setStatus("Parsing...");
    try {
      const res = await fetch("/api/parse-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailText })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAsnData(data); setStatus("");
    } catch(e) { setStatus("Error: " + e.message); }
    setParsing(false);
  }

  async function getInsight(type) {
    setAiLoading(true); setAiText("Analysing...");
    const prompts = {
      risk: `Analyse this supply chain data and flag risks. Today is ${TODAY}. Plain text:\n${JSON.stringify(ODOO_DATA)}`,
      recommend: `Give 3-5 actionable supply chain recommendations. Today is ${TODAY}. Plain text:\n${JSON.stringify(ODOO_DATA)}`,
      forecast: `Give a 2-week supply chain forecast. Today is ${TODAY}. Plain text:\n${JSON.stringify(ODOO_DATA)}`,
    };
    try {
      const res = await fetch("/api/insight", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompts[type] })
      });
      const data = await res.json();
      setAiText(data.text || "No response.");
    } catch { setAiText("Error connecting to AI."); }
    setAiLoading(false);
  }

  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"2rem 1rem",fontFamily:"system-ui,sans-serif",background:"#f8fafc",minHeight:"100vh"}}>
      <div style={{background:"#1e293b",borderRadius:12,padding:"1.25rem 1.5rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:18,fontWeight:600,color:"#fff"}}>Supply Chain AI</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Odoo 17 · Groq AI · ASN Automation</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {[["asn","📧 ASN Parser"],["dashboard","📦 Dashboard"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{fontSize:12,padding:"6px 14px",borderRadius:6,border:"none",background:tab===key?"#3b82f6":"#334155",color:"#fff",cursor:"pointer"}}>{label}</button>
          ))}
          <span style={{fontSize:12,color:"#94a3b8",marginLeft:4}}>👤 {currentUser}</span>
          <button onClick={()=>setLoggedIn(false)} style={{fontSize:12,padding:"6px 12px",borderRadius:6,border:"none",background:"#475569",color:"#fff",cursor:"pointer"}}>Sign out</button>
        </div>
      </div>

      {tab==="asn" && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1.5rem"}}>
          <div style={{fontSize:15,fontWeight:600,marginBottom:"1rem",color:"#1e293b"}}>📧 Email to ASN</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>Load sample email:</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {[["local","🇦🇺 Local"],["international","🌏 International"],["urgent","⚡ Urgent"]].map(([key,label])=>(
              <button key={key} onClick={()=>{setEmailText(SAMPLE_EMAILS[key]);setStatus("");setAsnData(null);}}
                style={{fontSize:12,padding:"5px 12px",borderRadius:6,border:"1px solid #e2e8f0",background:"#f8fafc",cursor:"pointer",color:"#475569"}}>{label}</button>
            ))}
          </div>
          <textarea value={emailText} onChange={e=>setEmailText(e.target.value)}
            placeholder="Paste supplier email here or click a sample above..."
            style={{width:"100%",height:180,padding:"0.75rem",fontSize:12,borderRadius:8,border:"1px solid #e2e8f0",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box"}}/>
          {status && <div style={{fontSize:12,padding:"8px 12px",borderRadius:6,margin:"8px 0",background:status.startsWith("Error")?"#fef2f2":"#eff6ff",color:status.startsWith("Error")?"#dc2626":"#2563eb"}}>{status}</div>}
          <button onClick={parseEmail} disabled={parsing}
            style={{marginTop:8,padding:"10px 24px",fontSize:13,fontWeight:500,borderRadius:8,border:"none",background:parsing?"#93c5fd":"#2563eb",color:"#fff",cursor:parsing?"not-allowed":"pointer"}}>
            {parsing?"⏳ Parsing...":"✦ Parse with AI"}
          </button>
          {asnData && (
            <div style={{marginTop:"1.5rem"}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:"1rem",color:"#1e293b"}}>📋 Extracted ASN</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:"1rem"}}>
                {[["Reference",asnData.reference],["Supplier",asnData.supplier],["Ship From",asnData.shipFrom],["Ship To",asnData.shipTo],["Carrier",asnData.carrier],["Tracking",asnData.tracking],["ETA",asnData.eta],["Type",asnData.shipmentType],["Total Value",asnData.totalValue],["Incoterms",asnData.incoterms||"N/A"]].map(([label,value])=>(
                  <div key={label} style={{background:"#f8fafc",borderRadius:8,padding:"0.6rem 0.8rem",border:"1px solid #f1f5f9"}}>
                    <div style={{fontSize:10,color:"#94a3b8"}}>{label}</div>
                    <div style={{fontSize:13,fontWeight:500,marginTop:3,color:"#1e293b"}}>{value||"—"}</div>
                  </div>
                ))}
              </div>
              {asnData.shipmentType==="international" && (
                <div style={{background:"#fefce8",border:"1px solid #fde68a",borderRadius:8,padding:"0.75rem",marginBottom:"1rem",fontSize:12,color:"#92400e"}}>
                  ⚠️ International shipment — customs clearance required.
                </div>
              )}
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:"1rem"}}>
                <thead><tr style={{background:"#f8fafc"}}>{["SKU","Description","Qty","Unit Price","HS Code"].map(h=><th key={h} style={{textAlign:"left",color:"#64748b",padding:"8px 10px",fontWeight:500,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
                <tbody>{asnData.items?.map((item,i)=>(
                  <tr key={i} style={{background:i%2===0?"#fff":"#fafafa"}}>
                    <td style={{padding:"8px 10px",fontFamily:"monospace",fontSize:11}}>{item.sku}</td>
                    <td style={{padding:"8px 10px"}}>{item.description}</td>
                    <td style={{padding:"8px 10px",fontWeight:500}}>{item.qty}</td>
                    <td style={{padding:"8px 10px"}}>{item.unitPrice}</td>
                    <td style={{padding:"8px 10px"}}>{item.hsCode||"—"}</td>
                  </tr>
                ))}</tbody>
              </table>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={()=>setStatus("✅ ASN created in Odoo!")} style={{fontSize:12,padding:"8px 16px",borderRadius:6,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",fontWeight:500}}>✅ Create in Odoo</button>
                <button onClick={()=>setStatus("📄 PDF generated!")} style={{fontSize:12,padding:"8px 16px",borderRadius:6,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer",fontWeight:500}}>📄 Generate PDF</button>
                <button onClick={()=>setStatus("📧 Email sent to warehouse!")} style={{fontSize:12,padding:"8px 16px",borderRadius:6,border:"none",background:"#0891b2",color:"#fff",cursor:"pointer",fontWeight:500}}>📧 Email Warehouse</button>
              </div>
              {status && <div style={{marginTop:"0.75rem",fontSize:13,color:"#16a34a",fontWeight:500}}>{status}</div>}
            </div>
          )}
        </div>
      )}

      {tab==="dashboard" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:"1.25rem"}}>
            {[["Total",ODOO_DATA.length,"#1e293b"],["Ready",ODOO_DATA.filter(s=>s.state==="assigned").length,"#16a34a"],["Late",ODOO_DATA.filter(isLate).length,"#dc2626"],["Draft",ODOO_DATA.filter(s=>s.state==="draft").length,"#d97706"]].map(([label,val,color])=>(
              <div key={label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"1rem"}}>
                <div style={{fontSize:11,color:"#94a3b8"}}>{label}</div>
                <div style={{fontSize:28,fontWeight:600,color,marginTop:4}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1.25rem",marginBottom:"1rem"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:"1rem",color:"#1e293b"}}>Shipments</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#f8fafc"}}>{["Reference","Type","Partner","Date","Status"].map(h=><th key={h} style={{textAlign:"left",color:"#64748b",padding:"8px 10px",fontWeight:500,borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
              <tbody>{ODOO_DATA.map((s,i)=>(
                <tr key={s.name} style={{background:i%2===0?"#fff":"#fafafa"}}>
                  <td style={{padding:"8px 10px",fontFamily:"monospace",fontSize:11}}>{s.name}</td>
                  <td style={{padding:"8px 10px"}}>{s.type}</td>
                  <td style={{padding:"8px 10px"}}>{s.partner}</td>
                  <td style={{padding:"8px 10px"}}>{s.date}</td>
                  <td style={{padding:"8px 10px"}}><Badge state={s.state} late={isLate(s)}/></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{background:"#fff",border:"1px solid #bfdbfe",borderRadius:12,padding:"1.25rem"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:"0.75rem",color:"#1d4ed8"}}>✦ AI analysis</div>
            <div style={{fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",color:aiLoading?"#94a3b8":"#334155",minHeight:60}}>{aiText||"Click a button to get AI insights."}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:"0.75rem"}}>
              {[["Risk analysis","risk"],["Recommendations","recommend"],["Demand forecast","forecast"]].map(([label,type])=>(
                <button key={type} onClick={()=>getInsight(type)} disabled={aiLoading}
                  style={{fontSize:12,padding:"6px 14px",borderRadius:6,border:"1px solid #bfdbfe",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer",fontWeight:500}}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
