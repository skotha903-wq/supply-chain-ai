import { useState } from "react";

const USERS = [
  { username: "sarak", password: "supply2026" },
  { username: "admin", password: "admin123" },
];

const SAMPLE_EMAILS = {
  local: `From: David Chen <david.chen@melbourneparts.com.au>
To: receiving@warehouse.com
Subject: ASN - Purchase Order PO-2026-04821

Hi team,

Please find below the advance shipment notice for your purchase order.

Purchase Order: PO-2026-04821
Supplier: Melbourne Parts Co. Pty Ltd
ABN: 47 123 456 789
Ship Date: 16 Jun 2026
ETA: 18 Jun 2026
Carrier: StarTrack Express
Tracking: ST-9982334411

Line Items:
1. SKU: MP-VALVE-25NB | Description: Ball Valve 25NB SS316 | Qty: 50 | UOM: EA | Batch: BV-260601
2. SKU: MP-PIPE-50NB | Description: ERW Pipe 50NB Sch40 6m | Qty: 20 | UOM: LGT | Batch: PIP-260612
3. SKU: MP-FLANGE-25 | Description: Flange Slip-On 25NB 150# | Qty: 100 | UOM: EA | Batch: FL-260598

Total Pallets: 3
Gross Weight: 840 kg

Please confirm receipt.
David Chen | Logistics Manager`,

  international: `From: Jenny Wu <jenny.wu@shenzhenlogistics.cn>
To: imports@warehouse.com
Subject: ASN for PO-2026-08841 - International Shipment

Dear Team,

Advanced Shipment Notice for your international order.

Purchase Order: PO-2026-08841
Supplier: Shenzhen Logistics Co. Ltd
Ship Date: 14 Jun 2026
ETA: 28 Jun 2026
Carrier: DHL Express
Tracking: 1Z9A8W7R034200001
Port of Loading: Shanghai (CNSHA)
Port of Discharge: Melbourne (AUMEL)
Incoterm: FOB Shanghai

Line Items:
1. SKU: ELEC-4490-BLK | Description: Industrial Control Module 24VDC | Qty: 200 | UOM: EA | HS Code: 8537.10.9000 | COO: CN
2. SKU: ELEC-2201-WHT | Description: Panel Mount Switch IP65 | Qty: 500 | UOM: EA | HS Code: 8536.50.9000 | COO: CN
3. SKU: CABLE-12C-15M | Description: 12-Core Shielded Cable 15m | Qty: 100 | UOM: ROL | HS Code: 8544.49.0000 | COO: CN

Total Cartons: 18 | Gross Weight: 620 kg | Volume: 2.4 CBM

Jenny Wu | Export Manager`,
};

function LoginScreen({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      const match = USERS.find((x) => x.username === u && x.password === p);
      if (match) onLogin(u);
      else setErr("Username or password is incorrect.");
      setLoading(false);
    }, 600);
  };

  return (
    <div style={styles.loginBg}>
      <div style={styles.loginCard}>
        <div style={styles.loginLogo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>
            Supply<span style={{ color: "#5A8FFF" }}>Chain</span> AI
          </span>
        </div>
        <p style={styles.loginSub}>ASN Intelligence Platform</p>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={u}
            onChange={(e) => setU(e.target.value)}
            placeholder="Enter username"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="Enter password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        {err && <div style={styles.errMsg}>{err}</div>}
        <button
          style={{ ...styles.btnPrimary, width: "100%", marginTop: "1.5rem" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p style={styles.loginHint}>
          Supply Chain AI · Internal Access Only
        </p>
      </div>
    </div>
  );
}

function Badge({ label, color }) {
  const colors = {
    green: { bg: "#d1fae5", text: "#065f46" },
    blue: { bg: "#dbeafe", text: "#1e40af" },
    amber: { bg: "#fef3c7", text: "#92400e" },
    red: { bg: "#fee2e2", text: "#991b1b" },
    purple: { bg: "#ede9fe", text: "#5b21b6" },
    gray: { bg: "#f3f4f6", text: "#374151" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        borderRadius: "100px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: 500,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function ASNCard({ title, data, color }) {
  if (!data) return null;
  const accentColor = color === "blue" ? "#2D6EFF" : "#7c3aed";
  const fields = Object.entries(data);

  return (
    <div style={styles.asnCard}>
      <div style={{ ...styles.asnCardHeader, borderLeftColor: accentColor }}>
        <div>
          <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {title}
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginTop: "2px" }}>
            {data.asnNumber || data.shipmentId || "ASN Generated"}
          </div>
        </div>
        <Badge label="Parsed" color={color === "blue" ? "blue" : "purple"} />
      </div>
      <div style={styles.asnFields}>
        {fields.map(([key, val]) => {
          if (key === "lineItems" || !val) return null;
          return (
            <div key={key} style={styles.asnField}>
              <span style={styles.asnFieldKey}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <span style={styles.asnFieldVal}>{String(val)}</span>
            </div>
          );
        })}
      </div>
      {data.lineItems && Array.isArray(data.lineItems) && data.lineItems.length > 0 && (
        <div style={styles.lineItemsSection}>
          <div style={styles.lineItemsHeader}>Line Items ({data.lineItems.length})</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {Object.keys(data.lineItems[0]).map((k) => (
                  <th key={k} style={styles.th}>
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                  {Object.values(item).map((v, j) => (
                    <td key={j} style={styles.td}>
                      {String(v || "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("parser");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  if (!user) return <LoginScreen onLogin={setUser} />;

  const parseEmail = async () => {
    if (!email.trim()) { setError("Paste a supplier email first."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/parse-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyJSON = (obj, label) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const sendEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`ASN Confirmation - ${result.salesforce?.purchaseOrder || "New ASN"}`);
    const body = encodeURIComponent(
      `Dear Supplier,\n\nWe have received and processed your ASN.\n\nASN Number: ${result.salesforce?.asnNumber || "N/A"}\nPO Number: ${result.salesforce?.purchaseOrder || "N/A"}\nETA: ${result.salesforce?.eta || "N/A"}\nStatus: Received & Verified\n\nThank you.\n\nWarehouse Team`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=&su=${subject}&body=${body}`, "_blank");
  };

  const tabs = [
    { id: "parser", label: "ASN Parser" },
    { id: "about", label: "About" },
  ];

  return (
    <div style={styles.app}>
      {/* Top nav */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>
            Supply<span style={{ color: "#5A8FFF" }}>Chain</span> AI
          </span>
        </div>
        <div style={styles.navCenter}>
          {tabs.map((t) => (
            <button
              key={t.id}
              style={{ ...styles.tabBtn, ...(activeTab === t.id ? styles.tabBtnActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={styles.navRight}>
          <span style={styles.userBadge}>👤 {user}</span>
          <button style={styles.btnGhost} onClick={() => setUser(null)}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {activeTab === "parser" && (
          <div>
            {/* Header */}
            <div style={styles.pageHeader}>
              <h1 style={styles.h1}>ASN Parser</h1>
              <p style={styles.pageDesc}>
                Paste a supplier email below. AI extracts structured ASN data for both Salesforce and SAP.
              </p>
            </div>

            {/* Sample email quick-load */}
            <div style={styles.sampleRow}>
              <span style={{ fontSize: "13px", color: "#6b7280", marginRight: "8px" }}>Load sample:</span>
              <button style={styles.btnSample} onClick={() => setEmail(SAMPLE_EMAILS.local)}>
                🇦🇺 Local supplier
              </button>
              <button style={styles.btnSample} onClick={() => setEmail(SAMPLE_EMAILS.international)}>
                🌐 International import
              </button>
            </div>

            {/* Input area */}
            <div style={styles.card}>
              <label style={styles.label}>Supplier email</label>
              <textarea
                style={styles.textarea}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Paste supplier email here…&#10;&#10;Include: PO number, ship date, ETA, carrier, tracking, line items with SKUs and quantities."
                rows={12}
              />
              <div style={styles.inputActions}>
                <button style={styles.btnGhost} onClick={() => { setEmail(""); setResult(null); setError(""); }}>
                  Clear
                </button>
                <button
                  style={{ ...styles.btnPrimary, minWidth: "160px" }}
                  onClick={parseEmail}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <span style={styles.spinner} /> Parsing…
                    </span>
                  ) : (
                    "⚡ Parse email"
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div>
                <div style={styles.resultsHeader}>
                  <h2 style={styles.h2}>Parsed ASN output</h2>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={styles.btnGhost} onClick={sendEmail}>
                      ✉️ Send confirmation email
                    </button>
                  </div>
                </div>

                <div style={styles.asnGrid}>
                  <div>
                    <div style={styles.asnLabel}>Salesforce format</div>
                    <ASNCard title="Salesforce ASN" data={result.salesforce} color="blue" />
                    <button
                      style={{ ...styles.btnGhost, width: "100%", marginTop: "8px" }}
                      onClick={() => copyJSON(result.salesforce, "sf")}
                    >
                      {copied === "sf" ? "✓ Copied!" : "Copy JSON"}
                    </button>
                  </div>
                  <div>
                    <div style={styles.asnLabel}>SAP format</div>
                    <ASNCard title="SAP ASN" data={result.sap} color="purple" />
                    <button
                      style={{ ...styles.btnGhost, width: "100%", marginTop: "8px" }}
                      onClick={() => copyJSON(result.sap, "sap")}
                    >
                      {copied === "sap" ? "✓ Copied!" : "Copy JSON"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={styles.pageHeader}>
              <h1 style={styles.h1}>About</h1>
            </div>
            <div style={styles.card}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>Supply Chain AI</h3>
              <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.7", marginBottom: "16px" }}>
                This tool parses unstructured supplier emails and extracts structured ASN (Advanced Shipment Notice) 
                data in both Salesforce and SAP-compatible formats, using Groq LLaMA 3.3 70B.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["AI model", "Groq LLaMA 3.3 70B"],
                  ["Hosting", "Vercel (Hobby — free)"],
                  ["Formats", "Salesforce + SAP dual output"],
                  ["Auth", "Username / password protected"],
                  ["Version", "2.0 — June 2026"],
                ].map(([k, v]) => (
                  <div key={k} style={styles.asnField}>
                    <span style={styles.asnFieldKey}>{k}</span>
                    <span style={styles.asnFieldVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111827",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    height: "56px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: "8px" },
  navCenter: { display: "flex", gap: "4px" },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  logoIcon: { fontSize: "20px", color: "#2D6EFF" },
  logoText: { fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" },
  userBadge: { fontSize: "13px", color: "#6b7280" },
  tabBtn: {
    background: "transparent",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#6b7280",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  tabBtnActive: {
    background: "#eff6ff",
    color: "#2D6EFF",
  },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 4rem" },
  pageHeader: { marginBottom: "1.5rem" },
  h1: { fontSize: "22px", fontWeight: 700, color: "#111827", marginBottom: "6px" },
  h2: { fontSize: "17px", fontWeight: 600, color: "#111827" },
  pageDesc: { fontSize: "14px", color: "#6b7280", lineHeight: "1.6" },
  sampleRow: { display: "flex", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" },
  btnSample: {
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "5px 12px",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#374151",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  },
  label: { display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#111827",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "ui-monospace, 'SF Mono', monospace",
    color: "#111827",
    background: "#f9fafb",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.6",
    boxSizing: "border-box",
  },
  inputActions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" },
  btnPrimary: {
    background: "#2D6EFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGhost: {
    background: "transparent",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#991b1b",
    marginBottom: "1.5rem",
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "8px",
  },
  asnGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  asnLabel: { fontSize: "12px", fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" },
  asnCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },
  asnCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    borderLeft: "4px solid #2D6EFF",
    background: "#fafafa",
  },
  asnFields: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" },
  asnField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "13px",
    padding: "4px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  asnFieldKey: { color: "#6b7280", flex: "0 0 140px", fontWeight: 500, textTransform: "capitalize" },
  asnFieldVal: { color: "#111827", textAlign: "right", wordBreak: "break-all" },
  lineItemsSection: { borderTop: "1px solid #f3f4f6" },
  lineItemsHeader: {
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
    background: "#f9fafb",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: {
    padding: "8px 12px",
    textAlign: "left",
    fontWeight: 600,
    color: "#6b7280",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  },
  td: { padding: "8px 12px", borderBottom: "1px solid #f3f4f6", color: "#111827" },
  trEven: { background: "#fafafa" },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  // Login
  loginBg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0B1628 0%, #112040 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  loginCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "360px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  loginLogo: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  loginSub: { fontSize: "13px", color: "#6b7280", marginBottom: "2rem" },
  loginHint: { fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "1rem" },
  field: { marginBottom: "1rem" },
  errMsg: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#991b1b",
  },
};
