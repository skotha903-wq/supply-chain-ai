export function printAsPDF(title) {
  const style = document.createElement('style');
  style.id = 'print-style';
  style.innerHTML = '@media print { body { background: white !important; color: black !important; } button { display: none !important; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 6px 10px; font-size: 12px; } th { background: #f0f0f0; } }';
  document.head.appendChild(style);
  const prev = document.title;
  document.title = title || 'Report';
  window.print();
  document.title = prev;
  setTimeout(function() {
    const s = document.getElementById('print-style');
    if (s) s.remove();
  }, 1000);
}

export function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(rows, filename) {
  const lines = rows.map(function(r) {
    return r.map(function(c) {
      return '"' + String(c).replace(/"/g, '""') + '"';
    }).join(',');
  }).join('\n');
  const blob = new Blob([lines], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function sendExpiryAlert(items, recipient) {
  const to = recipient || 'supplychain.asn@gmail.com';
  const subject = encodeURIComponent('Expiry Alert - ' + items.length + ' item(s) requiring action');
  let bodyText = 'EXPIRY ALERT - Hospital Supply Chain\nGenerated: ' + new Date().toLocaleString() + '\n\n';
  items.forEach(function(i) {
    bodyText += '- ' + i.desc + '\n  SKU: ' + i.sku + ' | Batch: ' + i.batch + ' | Expiry: ' + i.expiry + ' | Days left: ' + i.days + ' | Qty: ' + i.qty + '\n\n';
  });
  bodyText += 'Please action these items immediately.\n\nHospital Supply Chain System';
  const body = encodeURIComponent(bodyText);
  window.open('https://mail.google.com/mail/?view=cm&to=' + to + '&su=' + subject + '&body=' + body, '_blank');
}

export function sendRecallAlert(recall, affected, recipient) {
  const to = recipient || 'supplychain.asn@gmail.com';
  const subject = encodeURIComponent('URGENT RECALL - ' + recall.product + ' (' + recall.severity + ')');
  let bodyText = 'PRODUCT RECALL NOTIFICATION\n';
  bodyText += 'TGA Reference: ' + recall.tgaRef + '\n';
  bodyText += 'Date: ' + recall.date + '\n';
  bodyText += 'Product: ' + recall.product + '\n';
  bodyText += 'SKU: ' + recall.sku + '\n';
  bodyText += 'Supplier: ' + recall.supplier + '\n';
  bodyText += 'Class: ' + recall.severity + '\n';
  bodyText += 'Affected Batches: ' + (recall.affectedBatches || []).join(', ') + '\n\n';
  bodyText += 'Reason:\n' + recall.reason + '\n\nAffected stock:\n';
  affected.forEach(function(i) {
    bodyText += '- ' + i.location + ' | Batch: ' + i.batch + ' | Qty: ' + i.qty + '\n';
  });
  bodyText += '\nImmediate action required.\n\nHospital Supply Chain System';
  const body = encodeURIComponent(bodyText);
  window.open('https://mail.google.com/mail/?view=cm&to=' + to + '&su=' + subject + '&body=' + body, '_blank');
}

export function exportTGAReport(recall, inventory, quarantine) {
  const affected = inventory.filter(function(i) {
    return (recall.affectedBatches || []).includes(i.batch);
  });
  let content = 'TGA REGULATORY RECALL NOTIFICATION\n';
  content += '==================================================\n';
  content += 'Report generated: ' + new Date().toLocaleString() + '\n\n';
  content += 'RECALL DETAILS\n';
  content += '--------------\n';
  content += 'TGA Reference: ' + (recall.tgaRef || 'PENDING') + '\n';
  content += 'Recall ID: ' + recall.id + '\n';
  content += 'Issue Date: ' + recall.date + '\n';
  content += 'Recall Class: ' + recall.severity + '\n\n';
  content += 'PRODUCT INFORMATION\n';
  content += '-------------------\n';
  content += 'Product Name: ' + recall.product + '\n';
  content += 'SKU: ' + recall.sku + '\n';
  content += 'Supplier: ' + recall.supplier + '\n';
  content += 'Affected Batches: ' + (recall.affectedBatches || []).join(', ') + '\n\n';
  content += 'RECALL REASON\n';
  content += '-------------\n';
  content += recall.reason + '\n\n';
  content += 'STOCK ASSESSMENT\n';
  content += '----------------\n';
  content += 'Total affected units: ' + affected.reduce(function(a,i) { return a + i.qty; }, 0) + '\n\n';
  affected.forEach(function(i) {
    const key = recall.id + '-' + i.batch;
    content += '  - ' + i.location + '\n';
    content += '    Batch: ' + i.batch + ' | Qty: ' + i.qty + '\n';
    content += '    Quarantined: ' + (quarantine[key] ? 'YES' : 'NO') + '\n\n';
  });
  content += 'ACTIONS TAKEN\n';
  content += '-------------\n';
  content += '  [ ] Stock identified\n';
  content += '  [ ] Stock quarantined\n';
  content += '  [ ] Clinical team notified\n';
  content += '  [ ] Supplier contacted\n';
  content += '  [ ] TGA notification submitted\n\n';
  content += 'Submitted by: Supply Chain Department\n';
  content += 'Date: ' + new Date().toLocaleDateString() + '\n';
  content += '==================================================\n';
  content += 'END OF REPORT';
  downloadText(content, 'TGA-Recall-' + recall.id + '-' + recall.date + '.txt');
}

export function exportGRNReport(grn) {
  let content = 'GOODS RECEIPT NOTE (GRN)\n';
  content += '========================================\n';
  content += 'GRN Number: ' + grn.id + '\n';
  content += 'ASN Reference: ' + grn.asnId + '\n';
  content += 'Supplier: ' + grn.supplier + '\n';
  content += 'Purchase Order: ' + grn.po + '\n';
  content += 'Receipt Date: ' + grn.date + '\n\n';
  content += 'LINE ITEMS\n';
  content += '----------\n';
  grn.items.forEach(function(item, i) {
    content += (i+1) + '. ' + item.desc + '\n';
    content += '   SKU: ' + item.sku + ' | Batch: ' + item.batch + '\n';
    content += '   Expected: ' + item.qty + ' | Actual: ' + item.actualQty + '\n';
    content += '   Discrepancy: ' + (item.discrepancy ? 'YES - INVESTIGATE' : 'None') + '\n\n';
  });
  content += 'Cold chain temp: ' + (grn.coldTemp ? grn.coldTemp + 'C' : 'N/A') + '\n';
  content += 'Notes: ' + (grn.notes || 'None') + '\n\n';
  content += 'Received by: _______________________\n';
  content += 'Date: ' + grn.date + '\n';
  content += 'Signature: _______________________\n';
  content += '========================================';
  downloadText(content, 'GRN-' + grn.id + '-' + grn.date + '.txt');
}

export function exportReconciliation(supplier, items, usage) {
  const rows = [
    ['Consignment Reconciliation Report'],
    ['Supplier: ' + supplier],
    ['Generated: ' + new Date().toLocaleString()],
    [''],
    ['STOCK ON HAND'],
    ['ID','Product','SKU','Batch','Expiry','Qty','Location','Status'],
  ];
  items.forEach(function(i) {
    rows.push([i.id, i.product, i.sku, i.batch, i.expiry, i.qty, i.location, i.status]);
  });
  rows.push(['']);
  rows.push(['USAGE THIS PERIOD']);
  rows.push(['ID','Product','Patient','Surgeon','Theatre','Date','Qty','Invoiced']);
  usage.forEach(function(u) {
    rows.push([u.id, u.product, u.patient||'', u.surgeon||'', u.theatre||'', u.date, u.qty, u.invoiced ? 'Yes' : 'No']);
  });
  downloadCSV(rows, 'Reconciliation-' + supplier + '-' + new Date().toISOString().split('T')[0] + '.csv');
}
