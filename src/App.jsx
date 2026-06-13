import { useState } from "react";
import ConsignmentTracker from "./ConsignmentTracker";
import InboundReceiving from "./InboundReceiving";
import ExpiryManagement from "./ExpiryManagement";
import WardDistribution from "./WardDistribution";
import RecallManagement from "./RecallManagement";
import { printAsPDF, downloadCSV, sendExpiryAlert } from "./utils";

const USERS = [
  { username:"sarak", password:"S@ra2020", role:"admin", org:"Royal Melbourne Hospital" },
  { username:"admin", password:"Admin@123", role:"admin", org:"Royal Melbourne Hospital" },
  { username:"ward1", password:"Ward@123", role:"staff", org:"Royal Melbourne Hospital" },
];

const SAMPLE_EMAILS = [
  { label:"AU Supplier", text:"From: brett@southerncross.com.au\nASN Reference: ASN-20240613\nPurchase Order: PO-88123\nShip Date: 2024-06-13\nETA: 2024-06-16\nCarrier: StarTrack\nTracking: TRK99887766\n\nItems:\n- SKU: ELE-4521-A | Control Module | Qty: 50 EA | Batch: BT-11234\n- SKU: MEC-8834-B | Bearing Assembly | Qty: 20 SET | Batch: BT-11235\n\nCartons: 12 | Weight: 240 kg" },
  { label:"China Supplier", text:"From: export@zhonghua.cn\nASN No: ASN-CN-88712\nPO: PO-77654\nETA: 2024-06-28\nCarrier: Maersk Line\nTracking: MRKU1234567\n\nItems:\n- SKU: ELE-9987-I | LED Driver 100W | Qty: 200 EA | Batch: BT-55001\n\nCartons: 30 | Weight: 850 kg" },
  { label:"Urgent Medical", text:"URGENT SHIPMENT\nFrom: logistics@stryker.com.au\nASN: ASN-URGENT-001\nPO: PO-HOSP-9921\nETA: 2024-06-14 NEXT DAY\nCarrier: DHL Express\nTracking: DHL9988001122\n\nItems:\n- SKU: STR-TRI-001 | Triathlon Knee System | Qty: 2 EA | Batch: BT-20240613\n- SKU: STR-CAL-002 | Calys Tibial Tray | Qty: 4 EA | Batch: BT-20240614\n\nCartons: 3 | Weight: 18 kg | FRAGILE" },
];

const bg = "#0f1117";
const surface = "#1a1d27";
const bdr = "1px solid #2a2d3a";

const S = {
  page: { minHeight:"100vh", background:bg, color:"#e8eaf0", fontFamily:"system-ui,sans-serif" },
  header: { background:surface, borderBottom:bdr, padding:"14px 24px", display:"flex", alignItems:"center", gap:12 },
  input: { width:"100%", padding:"10px 12px", background:bg, border:bdr, borderRadius:8, color:"#e8eaf0", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: (c) => ({ padding:"10px 20px", background:c||"#4f8ef7", border:"none", borderRadius:8, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer" }),
  btnSm: (c) => ({ padding:"5px 12px", background:"transparent", border:"1px solid "+(c||"#4f8ef7"), borderRadius:6, color:c||"#4f8ef7", fontSize:11, cursor:"pointer" }),
  card: { background:surface, border:bdr, borderRadius:10, padding:20 },
  metric: { background:bg, borderRadius:8, padding:"14px 16px" },
  label: { fontSize:11, fontWeight:600, letterSpacing:"0.07em", color:"#8b8fa8", textTransform:"uppercase", display:"block", marginBottom:6 },
};

function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    const m = USERS.find(x => x.username === u && x.password === p);
    if (m) onLogin(m);
    else setErr("Invalid credentials.");
  };
  return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ ...S.card, width:380 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🏥</div>
          <h2 style={{ fontSize:20, fontWeight:600, margin:0 }}>Hospital Supply Chain</h2>
          <p style={{ fontSize:13, color:"#8b8fa8", margin:"6px 0 0" }}>Logistics and Consignment Management</p>
        </div>
        {err && <p style={{ color:"#ef4444", fontSize:12, marginBottom:10 }}>{err}</p>}
        <div style={{ marginBottom:12 }}>
          <label style={S.label}>Username</label>
          <input style={S.input} value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} placeholder="sarak" />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={S.label}>Password</label>
          <input type="password" style={S.input} value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} />
        </div>
        <button style={{ ...S.btn(), width:"100%" }} onClick={submit}>Sign in</button>
        <div style={{ marginTop:14, padding:12, background:bg, borderRadius:8, fontSize:11, color:"#8b8fa8" }}>
          <div style={{ marginBottom:4, fontWeight:600 }}>Demo accounts:</div>
          <div>Admin: sarak / S@ra2020</div>
          <div>Staff: ward1 / Ward@123</div>
        </div>
      </div>
    </div>
  );
}

function ASNParser() {
  const [email, setEmail] = useState("");
  const [asn1, setAsn1] = useState("");
  const [asn2, setAsn2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parse = async () => {
    if (!email.trim()) return;
    setLoading(true); setError(""); setAsn1(""); setAsn2("");
    try {
      const r = await fetch("/api/parse-email", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email }) });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      setAsn1(d.asn1 || d.result || "");
      setAsn2(d.asn2 || "");
    } catch {
      setError("Error connecting to Groq API. Check GROQ_KEY in Vercel.");
    }
    setLoading(false);
  };

  const downloadASN = () => {
    if (!asn1) return;
    const content = "ASN 1:\n" + "=".repeat(40) + "\n" + asn1 + "\n\nASN 2:\n" + "=".repeat(40) + "\n" + asn2;
    const blob = new Blob([content], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ASN-" + Date.now() + ".txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const emailWarehouse = () => {
    const subject = encodeURIComponent("ASN Notice — Action Required");
    const body = encodeURIComponent("ASN 1:\n" + asn1 + "\n\nASN 2:\n" + asn2);
    window.open("https://mail.google.com/mail/?view=cm&to=supplychain.asn@gmail.com&su=" + subject + "&body=" + body, "_blank");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <span style={{ fontSize:24 }}>📧</span>
        <div>
          <div style={{ fontSize:16, fontWeight:600 }}>ASN Parser</div>
          <div style={{ fontSize:11, color:"#8b8fa8" }}>Groq AI · LLaMA 3.3 70B</div>
        </div>
      </div>
      <div style={{ padding:"24px", maxWidth:900, margin:"0 auto" }}>
        <div style={{ ...S.card, marginBottom:14 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
            {SAMPLE_EMAILS.map((s,i) => (
              <button key={i} style={{ padding:"6px 14px", borderRadius:8, fontSize:12, cursor:"pointer", border:bdr, background:"transparent", color:"#8b8fa8" }} onClick={() => setEmail(s.text)}>{s.label}</button>
            ))}
          </div>
          <label style={S.label}>Paste supplier email</label>
          <textarea style={{ ...S.input, minHeight:200, resize:"vertical", fontFamily:"monospace", marginBottom:12 }} value={email} onChange={e => setEmail(e.target.value)} placeholder="Paste supplier email here..." />
          <button style={{ ...S.btn(), padding:"10px 24px" }} onClick={parse} disabled={loading}>
            {loading ? "Parsing..." : "Generate ASN 1 and ASN 2"}
          </button>
          {error && <p style={{ color:"#ef4444", fontSize:12, marginTop:10 }}>{error}</p>}
        </div>
        {(asn1 || asn2) && (
          <div>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <button style={S.btn("#22c55e")} onClick={downloadASN}>Download ASN</button>
              <button style={S.btn("#4f8ef7")} onClick={emailWarehouse}>Email Warehouse</button>
              <button style={S.btn("#a855f7")} onClick={() => printAsPDF("ASN Report")}>Print PDF</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["ASN 1", asn1],["ASN 2", asn2]].map(([l,v]) => v && (
                <div key={l} style={S.card}>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:10, color:"#4f8ef7" }}>{l}</div>
                  <pre style={{ fontSize:11, color:"#8b8fa8", whiteSpace:"pre-wrap", margin:0, fontFamily:"monospace", lineHeight:1.7 }}>{v}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ onNav, user }) {
  const MODULES = [
    { id:"asn", icon:"📧", title:"ASN Parser", desc:"Groq AI email to ASN 1 and ASN 2", color:"#4f8ef7", kpi:"3 pending" },
    { id:"inbound", icon:"📦", title:"Inbound Receiving", desc:"GRN, 3-way match, cold chain", color:"#22c55e", kpi:"2 ASNs due" },
    { id:"consignment", icon:"🔬", title:"Consignment Manager", desc:"Implant tracking and reconciliation", color:"#a855f7", kpi:"386 lines" },
    { id:"expiry", icon:"📅", title:"Expiry Management", desc:"FEFO and 90/60/30 day alerts", color:"#f59e0b", kpi:"4 expiring" },
    { id:"ward", icon:"🚚", title:"Ward Distribution", desc:"Requisitions, delivery, returns", color:"#14b8a6", kpi:"99.2% fill" },
    { id:"recall", icon:"🚨", title:"Recall Management", desc:"TGA recall and batch traceability", color:"#ef4444", kpi:"1 ACTIVE" },
  ];

  const exportKPIs = () => {
    const rows = [
      ["Hospital Supply Chain Dashboard"],
      ["Generated: " + new Date().toLocaleString()],
      ["Organisation: " + user.org],
      [""],
      ["KPI","Value"],
      ["ASNs pending","3"],
      ["GRNs today","7"],
      ["Consignment lines","386"],
      ["Expiring 30d","4"],
      ["Ward fill rate","99.2%"],
      ["Active recalls","1"],
    ];
    downloadCSV(rows, "Dashboard-" + new Date().toISOString().split("T")[0] + ".csv");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <span style={{ fontSize:26 }}>🏥</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:600 }}>Hospital Supply Chain</div>
          <div style={{ fontSize:11, color:"#8b8fa8" }}>{user.org}</div>
        </div>
        <button style={S.btnSm("#22c55e")} onClick={exportKPIs}>Download KPIs</button>
      </div>
      <div style={{ padding:"24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ background:"#450a0a", border:"1px solid #ef4444", borderRadius:10, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <span>🚨</span>
          <div>
            <span style={{ fontWeight:600, color:"#ef4444", fontSize:13 }}>Active recall — Stryker Triathlon Knee System (BT-20240501)</span>
            <span style={{ fontSize:12, color:"#fca5a5", marginLeft:12 }}>Class II | TGA-RC-2024-0412</span>
          </div>
          <button style={{ marginLeft:"auto", padding:"5px 14px", background:"#ef4444", border:"none", borderRadius:6, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }} onClick={() => onNav("recall")}>Respond</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, marginBottom:24 }}>
          {[["ASNs pending","3","#f59e0b"],["GRNs today","7","#22c55e"],["Consignment","386","#4f8ef7"],["Expiring 30d","4","#ef4444"],["Fill rate","99.2%","#22c55e"],["Recalls","1","#ef4444"]].map(([l,v,c]) => (
            <div key={l} style={S.metric}>
              <div style={{ fontSize:11, color:"#8b8fa8", marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14, marginBottom:20 }}>
          {MODULES.map(m => (
            <div key={m.id} style={{ ...S.card, cursor:"pointer", borderLeft:"3px solid "+m.color }} onClick={() => onNav(m.id)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:24 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{m.title}</div>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background:m.color+"22", color:m.color, fontWeight:600 }}>{m.kpi}</span>
                  </div>
                </div>
                <span style={{ color:"#2a2d3a" }}>→</span>
              </div>
              <div style={{ fontSize:12, color:"#8b8fa8", lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#8b8fa8", fontWeight:600 }}>Quick actions:</span>
          <button style={S.btnSm("#f59e0b")} onClick={() => sendExpiryAlert([{desc:"Micra AV Pacemaker",sku:"MDT-MIC-002",batch:"BT-20240312",expiry:"2024-08-01",days:8,qty:1}])}>Send expiry alert</button>
          <button style={S.btnSm("#4f8ef7")} onClick={() => printAsPDF("Dashboard")}>Print dashboard</button>
          <button style={S.btnSm("#22c55e")} onClick={exportKPIs}>Export CSV</button>
          <button style={S.btnSm("#ef4444")} onClick={() => onNav("recall")}>Recall response</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("dashboard");

  if (!user) return <Login onLogin={setUser} />;

  const SCREENS = {
    dashboard: <Dashboard onNav={setScreen} user={user} />,
    asn: <ASNParser />,
    inbound: <InboundReceiving />,
    consignment: <ConsignmentTracker />,
    expiry: <ExpiryManagement />,
    ward: <WardDistribution />,
    recall: <RecallManagement />,
  };

  return (
    <div>
      <div style={{ background:"#0a0c12", padding:"8px 20px", borderBottom:bdr, display:"flex", alignItems:"center", gap:12 }}>
        {screen !== "dashboard" && (
          <button style={{ padding:"4px 12px", borderRadius:6, fontSize:12, cursor:"pointer", border:bdr, background:"transparent", color:"#8b8fa8" }} onClick={() => setScreen("dashboard")}>Back to Dashboard</button>
        )}
        <span style={{ fontSize:12, color:"#8b8fa8" }}>🏥 {user.org}</span>
        <span style={{ fontSize:12, color:"#8b8fa8", marginLeft:8 }}>{user.role === "admin" ? "Admin" : "Staff"} — {user.username}</span>
        <button style={{ marginLeft:"auto", padding:"4px 12px", borderRadius:6, fontSize:12, cursor:"pointer", border:bdr, background:"transparent", color:"#8b8fa8" }} onClick={() => { setUser(null); setScreen("dashboard"); }}>Sign out</button>
      </div>
      {SCREENS[screen]}
    </div>
  );
}
