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
1. Ergonomic Chair (SKU: FURN_7777) — Qty: