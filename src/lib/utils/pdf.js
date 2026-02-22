function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const n = Math.floor(num);
  if (n === 0) return 'Zero';
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numberToWords(n % 100) : '');
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToWords(n % 100000) : '');
  return numberToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToWords(n % 10000000) : '');
}

function rupee(n) {
  return `Rs. ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function generateInvoicePDF({ id, status, item, total, format, passengerName = 'Guest' }) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentW = pageW - margin * 2;
    let y = 0;

    const amount = typeof total === 'number' ? Math.round(total) : 0;
    const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // ── HEADER BAND (dark indigo) ──────────────────────────────────────────
    const headerH = 38;
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageW, headerH, 'F');

    // Brand name
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Book Flights', margin, 16);

    // Tagline
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(167, 162, 210);
    doc.text('Your trusted flight & hotel booking platform', margin, 22);

    // "TAX INVOICE" right
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE', pageW - margin, 16, { align: 'right' });

    // PAID badge
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(pageW - margin - 22, 21, 22, 9, 2, 2, 'F');
    doc.setFontSize(8.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PAID', pageW - margin - 11, 27, { align: 'center' });

    y = headerH;

    // ── COMPANY + INVOICE META (two columns) ─────────────────────────────
    const infoH = 38;
    doc.setFillColor(255, 255, 255);
    doc.rect(0, y, pageW, infoH, 'F');

    // Left: company details
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Book Flights Pvt. Ltd.', margin, y + 10);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    doc.text('Bengaluru, Karnataka — 560025', margin, y + 16);
    doc.text('support@bookflights.in', margin, y + 21);

    // Right: invoice meta
    const metaX = pageW - margin - 72;
    const metaW = 72;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(metaX, y + 4, metaW, 30, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(metaX, y + 4, metaW, 30, 2, 2);

    const metaRows = [
      ['Invoice No.', id],
      ['Invoice Date', invoiceDate],
      ['Booking Ref.', id],
      ['Place of Supply', 'Karnataka (29)'],
    ];
    metaRows.forEach(([label, value], i) => {
      const ry = y + 10 + i * 6;
      doc.setFontSize(7.5);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(label, metaX + 3, ry);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(17, 24, 39);
      const valStr = String(value || '—');
      doc.text(valStr.length > 20 ? valStr.slice(0, 20) + '…' : valStr, metaX + metaW - 3, ry, { align: 'right' });
    });

    y += infoH;

    // Thin divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageW - margin, y);
    y += 1;

    // ── BILL TO ───────────────────────────────────────────────────────────
    const billH = 24;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y + 3, contentW, billH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(margin, y + 3, contentW, billH);

    // "BILL TO" label strip
    doc.setFillColor(30, 27, 75);
    doc.rect(margin, y + 3, 22, billH, 'F');
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('BILL TO', margin + 11, y + 3 + billH / 2 + 1, { align: 'center', angle: 0 });

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(passengerName, margin + 26, y + 13);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('Passenger / Traveller', margin + 26, y + 19);
    doc.text('India', margin + 26, y + 24);

    y += billH + 8;

    // ── LINE ITEMS TABLE ──────────────────────────────────────────────────
    // Column config: x offset from margin, width, label, align
    const tCols = [
      { label: '#',               w: 8,  align: 'left'  },
      { label: 'Description',     w: 74, align: 'left'  },
      { label: 'HSN/SAC',         w: 22, align: 'left'  },
      { label: 'Qty',             w: 14, align: 'center'},
      { label: 'Rate',            w: 28, align: 'right' },
      { label: 'Amount',          w: 28, align: 'right' },
    ];

    // Build column x positions
    let cx = margin;
    tCols.forEach((col) => { col.x = cx; cx += col.w; });

    // Header row
    const thH = 9;
    doc.setFillColor(30, 27, 75);
    doc.rect(margin, y, contentW, thH, 'F');
    tCols.forEach((col) => {
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      const tx = col.align === 'right' ? col.x + col.w - 2 : col.align === 'center' ? col.x + col.w / 2 : col.x + 2;
      doc.text(col.label, tx, y + 6, { align: col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left' });
    });
    y += thH;

    // Line item data
    const lineItems = [];
    if (item?.flight || item?.airline) {
      const f = item?.flight || item;
      const desc = `${f.airline || 'Flight'} — ${f.origin || ''} to ${f.destination || ''}`;
      lineItems.push({ desc, sub: 'Air Travel (Economy)', hsn: '996411', qty: 1, rate: f.price ?? amount });
    }
    if (item?.hotel || item?.name) {
      const h = item?.hotel || item;
      const hPrice = h.price ?? h.rooms?.[0]?.price ?? 0;
      lineItems.push({ desc: `${h.name || 'Hotel'} — ${h.location || ''}`, sub: 'Hotel Accommodation', hsn: '996311', qty: 1, rate: hPrice });
    }
    if (lineItems.length === 0) {
      lineItems.push({ desc: 'Travel Booking', sub: 'Booking Service', hsn: '996412', qty: 1, rate: amount });
    }

    lineItems.forEach((row, i) => {
      const rowH = 14;
      doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.rect(margin, y, contentW, rowH, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowH, margin + contentW, y + rowH);

      const vals = [
        { v: String(i + 1), align: 'left' },
        { v: row.desc, sub: row.sub, align: 'left' },
        { v: row.hsn, align: 'left' },
        { v: String(row.qty), align: 'center' },
        { v: rupee(row.rate), align: 'right' },
        { v: rupee(row.rate * row.qty), align: 'right' },
      ];

      vals.forEach((cell, ci) => {
        const col = tCols[ci];
        const tx = col.align === 'right' ? col.x + col.w - 2 : col.align === 'center' ? col.x + col.w / 2 : col.x + 2;
        doc.setFontSize(8.5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(17, 24, 39);
        doc.text(cell.v, tx, y + 6, { align: col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left' });
        if (cell.sub) {
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          doc.text(cell.sub, tx, y + 11, { align: 'left' });
        }
      });
      y += rowH;
    });

    // ── TOTALS BLOCK (right-aligned) ──────────────────────────────────────
    y += 4;
    const totX = pageW - margin - 72;
    const totW = 72;

    const totRows = [
      { label: 'Sub Total',     value: rupee(amount), bold: false },
      { label: 'IGST (0%)',     value: rupee(0),       bold: false },
      { label: 'CGST (0%)',     value: rupee(0),       bold: false },
      { label: 'Payment Made',  value: `- ${rupee(amount)}`, bold: false },
    ];

    totRows.forEach((row) => {
      doc.setFontSize(8.5);
      doc.setFont(undefined, row.bold ? 'bold' : 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(row.label, totX, y + 5);
      doc.setTextColor(17, 24, 39);
      doc.text(row.value, pageW - margin, y + 5, { align: 'right' });
      y += 7;
    });

    // Balance Due row (highlighted)
    doc.setFillColor(30, 27, 75);
    doc.roundedRect(totX, y, 72, 10, 1.5, 1.5, 'F');
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Balance Due', totX + 4, y + 6.5);
    doc.text('Rs. 0.00', pageW - margin - 2, y + 6.5, { align: 'right' });
    y += 16;

    // ── AMOUNT IN WORDS ───────────────────────────────────────────────────
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin, y, contentW, 13, 2, 2, 'F');
    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentW, 13, 2, 2);
    doc.setFontSize(7.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text('Amount in Words:', margin + 4, y + 5.5);
    doc.setFont(undefined, 'normal');
    doc.text(`Indian Rupee ${numberToWords(amount)} Only`, margin + 38, y + 5.5);
    doc.setFontSize(7);
    doc.setTextColor(99, 102, 241);
    doc.text('(Amount paid in full — no balance outstanding)', margin + 4, y + 10);
    y += 20;

    // ── PAYMENT DETAILS ───────────────────────────────────────────────────
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentW, 22, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentW, 22, 2, 2);

    doc.setFontSize(8.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Payment Details', margin + 4, y + 7);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    doc.text('UPI:  book@payment', margin + 4, y + 13);
    doc.text('Bank: ICICI Bank  |  A/C: 058305006828  |  IFSC: ICIC0000583', margin + 4, y + 18.5);
    y += 28;

    // ── FOOTER ────────────────────────────────────────────────────────────
    const footerY = pageH - 20;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 5, pageW - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Thank you for booking with Book Flights. We hope you have a wonderful journey!', pageW / 2, footerY, { align: 'center' });
    doc.setFontSize(7);
    doc.text('This is a computer-generated invoice and does not require a physical signature.', pageW / 2, footerY + 5, { align: 'center' });

    // Authorised signatory right
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 27, 75);
    doc.text('Authorised Signatory', pageW - margin, footerY, { align: 'right' });
    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(7);
    doc.text('Book Flights Pvt. Ltd.', pageW - margin, footerY + 5, { align: 'right' });

    doc.save(`invoice-${id}.pdf`);
  } catch {
    return false;
  }
}

const BRAND = 'Book Flights';

function formatPdfTime(iso) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatPdfDate(iso) {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

function formatPdfBookingDate(iso) {
  if (!iso) return '--';
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return `${date} ${time} (UTC)`;
}

function getCheckInClose(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - 60);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function drawBarcode(doc, x, y, w, h) {
  const bars = [0,3,6,8,11,14,16,19,22,25,27,30,33,35,38,41,44,46,49,52,54,57,60];
  const barW = w / 70;
  doc.setFillColor(30, 27, 75);
  bars.forEach((bx, i) => {
    const bw = i % 3 === 0 ? barW * 2 : barW;
    const bh = i % 5 === 0 ? h : h * 0.85;
    doc.rect(x + (bx / 70) * w, y + (h - bh), bw, bh, 'F');
  });
}

function sectionHeader(doc, x, y, w, h, text) {
  doc.setFillColor(243, 244, 246);
  doc.rect(x, y, w, h, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.line(x, y + h, x + w, y + h);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(text, x + 4, y + h - 3);
}

export async function generateItineraryPDF({ id, status, item, total, format, passengerName, seat, bookingDate, paymentStatus }) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    const cardW = pageW - margin * 2;
    let y = 14;

    const f = item?.flight || (item?.airline ? item : null);
    const h = item?.hotel || (item?.name && item?.location ? item : null);

    const airline = f?.airline || BRAND;
    const pnr = id || '--';
    const passenger = passengerName || 'Guest';
    const seatNo = seat || f?.seat || '—';
    const bookDate = formatPdfBookingDate(bookingDate || f?.departureTime);
    const pymtStatus = paymentStatus || 'Approved';
    const aircraft = f?.aircraft || 'A320';
    const prefix = (f?.airline || '').includes('Air India') ? 'AI' : 'BK';
    const flightNum = f?.id ? `${prefix} ${String(f.id).replace(/\D/g, '').slice(0, 4) || '6251'}` : `${prefix} 6251`;

    const origin = f?.originCity || f?.origin || '--';
    const destination = f?.destinationCity ? `${f.destinationCity} (T1)` : (f?.destination || '--');
    const originCode = f?.origin || '---';
    const destCode = f?.destination || '---';

    // ── Outer card border ──
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, cardW, 0); // just draws from top; height computed dynamically

    // ── HEADER ROW ──
    const headerH = 12;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, headerH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + headerH, margin + cardW, y + headerH);

    // Brand name
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 27, 75);
    doc.text(BRAND, margin + 4, y + 8);

    // Airline sub-label
    const brandW = doc.getTextWidth(BRAND);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(`(${airline})`, margin + 4 + brandW + 2, y + 8);

    // PNR right
    doc.setFontSize(8.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`PNR / Booking Ref.: `, margin + cardW - 4, y + 8, { align: 'right' });
    const labelW = doc.getTextWidth('PNR / Booking Ref.: ');
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(pnr, margin + cardW - 4, y + 8, { align: 'right' });
    y += headerH;

    // ── BOOKING STATUS SECTION ──
    const statusH = 28;
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, cardW, statusH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + statusH, margin + cardW, y + statusH);

    const colW = cardW / 3;
    // Column labels
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('STATUS', margin + 4, y + 6);
    doc.text('DATE OF BOOKING*', margin + colW + 4, y + 6);
    doc.text('PAYMENT STATUS', margin + colW * 2 + 4, y + 6);

    // Column values
    doc.setFontSize(9.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('CONFIRMED', margin + 4, y + 13);
    doc.setFontSize(8.5);
    doc.text(bookDate, margin + colW + 4, y + 13);
    doc.setFontSize(9.5);
    doc.text(pymtStatus, margin + colW * 2 + 4, y + 13);

    // Footnote
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('*Booking Date reflects in UTC (Universal Time Coordinated), all other timings mentioned are as per Local Time.', margin + 4, y + 23);
    y += statusH;

    // ── PASSENGER ROW ──
    const passH = 10;
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y, cardW, passH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + passH, margin + cardW, y + passH);
    doc.setFontSize(8.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text(`${BRAND} Passenger - 1/1`, margin + 4, y + 6.5);
    // Flight Status "button"
    doc.setFillColor(30, 27, 75);
    doc.roundedRect(margin + cardW - 32, y + 1.5, 28, 7, 1, 1, 'F');
    doc.setFontSize(7.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Flight Status', margin + cardW - 18, y + 6.5, { align: 'center' });
    y += passH;

    // ── FLIGHT(S) HEADER ──
    sectionHeader(doc, margin, y, cardW, 9, `${BRAND} Flight(s)`);
    y += 9;

    // ── PASSENGER + BARCODE ROW ──
    const barcodeH = 14;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, barcodeH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + barcodeH, margin + cardW, y + barcodeH);

    drawBarcode(doc, margin + 4, y + 2, 28, 10);

    doc.setFontSize(9.5);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(passenger, margin + 36, y + 7);

    if (f?.origin && f?.destination) {
      doc.setFontSize(7.5);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`${f.origin} → ${f.destination}`, margin + 36, y + 12);
    }
    y += barcodeH;

    // ── FLIGHT TABLE HEADER ──
    const cols = [
      { label: 'Date',             w: 20 },
      { label: 'From (Terminal)',  w: 28 },
      { label: 'Departs',         w: 18 },
      { label: 'Flight Number\n(Aircraft type)', w: 28 },
      { label: 'Check-in/Bag\ndrop closes', w: 24 },
      { label: 'To (Terminal)',   w: 30 },
      { label: 'Arrives',        w: 18 },
      { label: 'Via',            w: 14 },
    ];

    const tableH = 13;
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, cardW, tableH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + tableH, margin + cardW, y + tableH);

    let cx = margin + 2;
    cols.forEach((col) => {
      doc.setFontSize(7.5);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128);
      const lines = col.label.split('\n');
      lines.forEach((line, li) => {
        doc.text(line, cx, y + 5 + li * 4);
      });
      cx += col.w;
    });
    y += tableH;

    // ── FLIGHT TABLE DATA ROW ──
    const rowH = 13;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, rowH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + rowH, margin + cardW, y + rowH);

    const rowData = [
      formatPdfDate(f?.departureTime),
      origin,
      formatPdfTime(f?.departureTime),
      `${flightNum}\n(${aircraft})`,
      getCheckInClose(f?.departureTime),
      destination,
      formatPdfTime(f?.arrivalTime),
      '—',
    ];

    cx = margin + 2;
    rowData.forEach((val, i) => {
      const lines = val.split('\n');
      doc.setFontSize(8.5);
      doc.setFont(undefined, i === 2 || i === 6 ? 'bold' : 'normal');
      doc.setTextColor(17, 24, 39);
      lines.forEach((line, li) => {
        if (li === 1) {
          doc.setFont(undefined, 'normal');
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(7.5);
        }
        doc.text(line, cx, y + 5.5 + li * 4.5);
      });
      cx += cols[i].w;
    });
    y += rowH;

    // ── SEATS AND ADDITIONAL SERVICES HEADER ──
    sectionHeader(doc, margin, y, cardW, 9, 'Seats and Additional Services');
    y += 9;

    // Route display
    const routeH = 10;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, routeH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + routeH, margin + cardW, y + routeH);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text(originCode, margin + 4, y + 6.5);
    const origW = doc.getTextWidth(originCode);
    doc.text(' →', margin + 4 + origW, y + 6.5);
    const arrowW = doc.getTextWidth(' →');
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 27, 75);
    doc.text(` ${destCode}`, margin + 4 + origW + arrowW, y + 6.5);
    y += routeH;

    // Seats table header
    const seatsHeaderH = 9;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, seatsHeaderH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + seatsHeaderH, margin + cardW, y + seatsHeaderH);

    doc.setFontSize(7.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('', margin + 4, y + 6);
    doc.text('Passenger Name', margin + 4 + 46, y + 6);
    doc.text('Seat', margin + 4 + 46 + 48, y + 6);
    doc.text('Services Purchased', margin + 4 + 46 + 48 + 24, y + 6);
    y += seatsHeaderH;

    // Seats data row
    const seatsRowH = 11;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, cardW, seatsRowH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y + seatsRowH, margin + cardW, y + seatsRowH);

    doc.setFontSize(7.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(`${originCode} → ${destCode}`, margin + 4, y + 7);

    doc.setFontSize(8.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(passenger, margin + 4 + 46, y + 7);

    doc.setFont(undefined, 'bold');
    doc.text(String(seatNo), margin + 4 + 46 + 48, y + 7);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('—', margin + 4 + 46 + 48 + 24, y + 7);
    y += seatsRowH;

    // ── FOOTER NOTE ──
    const footerH = 10;
    doc.setFillColor(238, 242, 255);
    doc.rect(margin, y, cardW, footerH, 'F');
    doc.setFontSize(7.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(67, 56, 202);
    doc.text('Please carry a valid photo ID for check-in. Web check-in opens 48 hours before departure.', margin + 4, y + 6.5);
    y += footerH;

    // Draw outer card border now that we know the height
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.4);
    doc.rect(margin, 14, cardW, y - 14);

    // ── HOTEL SECTION (if any) ──
    if (h && (h.name || h.location)) {
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text('Hotel Details', margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text(`${h.name || '—'}`, margin, y); y += 5;
      doc.text(`${h.location || '—'}`, margin, y); y += 5;
      if (h.room?.name) { doc.text(`Room: ${h.room.name}`, margin, y); y += 5; }
    }

    doc.save(`itinerary-${id}.pdf`);
  } catch (err) {
    return false;
  }
}
