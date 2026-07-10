// import { HotTable } from '@handsontable/react-wrapper';
// import { HyperFormula } from 'hyperformula';
// import { registerAllModules } from 'handsontable/registry';
// import 'handsontable/styles/handsontable.min.css';
// import 'handsontable/styles/ht-theme-main.min.css';

// registerAllModules();

// // price, prevClose are raw; change & change% are FORMULAS referencing them
// const data = [
//   ['AAPL', 'Apple Inc.', 'Technology', 189.84, 188.50, '=D1-E1', '=(D1-E1)/E1', 2950000000],
//   ['MSFT', 'Microsoft Corp.', 'Technology', 378.91, 374.20, '=D2-E2', '=(D2-E2)/E2', 2810000000],
//   ['GOOGL', 'Alphabet Inc.', 'Technology', 141.80, 139.50, '=D3-E3', '=(D3-E3)/E3', 1780000000],
//   ['AMZN', 'Amazon.com Inc.', 'Consumer Cyclical', 178.25, 176.80, '=D4-E4', '=(D4-E4)/E4', 1850000000],
//   ['NVDA', 'NVIDIA Corp.', 'Technology', 875.28, 860.00, '=D5-E5', '=(D5-E5)/E5', 2150000000],
//   ['TSLA', 'Tesla Inc.', 'Consumer Cyclical', 249.10, 252.10, '=D6-E6', '=(D6-E6)/E6', 790000000],
//   ['JPM', 'JPMorgan Chase', 'Financials', 195.42, 193.60, '=D7-E7', '=(D7-E7)/E7', 561000000],
// ];

// function FinanceDashboard() {
//   return (
//     <div style={{ width: '100%' }}>

//       <HotTable
//         data={data}
//         themeName="ht-theme-main"
//         height="auto" stretchH="all"
//         width="100%"
//         rowHeaders={true}
//         licenseKey="non-commercial-and-evaluation"
//         // HyperFormula engine for the =D1-E1 style formulas
//         formulas={{
//           engine: HyperFormula,
//           // shares one engine instance; needed if multiple tables
//         }}
//         // Grouped/nested headers matching your screenshot
//         nestedHeaders={[
//           [
//             { label: 'Stock Info', colspan: 3 },
//             { label: 'Price Action', colspan: 4 },
//             { label: 'Fundamentals', colspan: 2 },
//           ],
//           ['Ticker', 'Company', 'Sector', 'Price', 'Prev Close', 'Change', 'Change %', 'Mkt Cap', 'P/E'],
//         ]}
//         columns={[
//           { data: 0, width: 90 },
//           { data: 1, width: 160 },
//           {
//             data: 2, width: 140, type: 'dropdown',
//             source: ['Technology', 'Consumer Cyclical', 'Financials', 'Healthcare', 'Consumer Defensive']
//           },
//           { data: 3, type: 'numeric', numericFormat: { pattern: '$0,0.00' }, width: 110 },
//           { data: 4, type: 'numeric', numericFormat: { pattern: '$0,0.00' }, width: 110 },
//           { data: 5, type: 'numeric', numericFormat: { pattern: '+0.00;-0.00' }, width: 110, readOnly: true },
//           { data: 6, type: 'numeric', numericFormat: { pattern: '+0.00%;-0.00%' }, width: 110, readOnly: true },
//           { data: 7, type: 'numeric', numericFormat: { pattern: '$0,0' }, width: 150 },
//           { data: 8, type: 'numeric', numericFormat: { pattern: '0.00' }, width: 80 },
//         ]}
//         // Conditional formatting: green for gains, red for losses on Change / Change%
//         cells={(row, col) => {
//           if (col === 5 || col === 6) {
//             const val = data[row]?.[3] - data[row]?.[4]; // price - prevClose
//             return { className: val < 0 ? 'loss-cell' : val > 0 ? 'gain-cell' : '' };
//           }
//           return {};
//         }}
//       />
//     </div>
//   );
// }
// export default FinanceDashboard


// 2
// import { HotTable } from '@handsontable/react-wrapper';
// import { HyperFormula } from 'hyperformula';
// import { registerAllModules } from 'handsontable/registry';
// import 'handsontable/styles/handsontable.min.css';
// import 'handsontable/styles/ht-theme-main.min.css';

// registerAllModules();

// /*
//   ORDER LOOKUP SHEET
//   ------------------
//   Structure is a vertical "form", not a flat grid. Each section is two rows:
//     - a LABEL row (green band, bold, centered)
//     - a VALUE row (white, holds the actual data)

//   Row map (0-indexed):
//     0  -> TITLE band  (ORDER LOOKUP SHEET, merged across all 8 cols)
//     1  -> label:  [Order#] Charged Date | Lead Source | Procured By | Order Date | Sales Agent | Invoice# | Invoice Link
//     2  -> value
//     3  -> label:  Order Source | Payment Status | Brands | Category | part# | Qty | Condition | Shipping A/C
//     4  -> value
//     5  -> label:  Bill to | Ship to | City | State | Country | Carrier | Tracking # | Status
//     6  -> value
//     7  -> label:  Reasons | Customer | Customer Company | Email | Phone | Customer PO# | Price | Shipping
//     8  -> value
//     9  -> label:  Tax | Vendor | Vendor order# | Vendor Part# | Status | CC/Paypal/Stripe Fee 4% | Paid Via | Charged Vendor
//     10 -> value
//     11 -> label:  Cost | Shipping | Tax | Total Price | Total Cost | Total Cost+4% | Gross Profit | Gross Profit-4%
//     12 -> value  (computed via HyperFormula)
// */

// // Column letters for formulas (HyperFormula uses A1 notation on the visual grid):
// // A=0 B=1 C=2 D=3 E=4 F=5 G=6 H=7
// // Cost=A13, Shipping=B13, Tax=C13, Total Price=D13 (Price+Shipping),
// // Total Cost=E13 (Cost+Ship+Tax), Total Cost+4%=F13, Gross Profit=G13, Gross Profit-4%=H13
// const data = [
//   // 0: title (only first cell holds text; rest merged away)
//   ['ORDER LOOKUP SHEET', '', '', '', '', '', '', ''],
//   // 1: labels
//   ['110050', 'Charged Date', 'Lead Source', 'Procured By', 'Order Date', 'Sales Agent', 'Invoice#', 'Invoice Link'],
//   // 2: values
//   ['', '7/20/2022', 'Inbound', '', '7/20/2022', '', '', ''],
//   // 3: labels
//   ['Order Source', 'Payment Status', 'Brands', 'Category', 'part#', 'Qty', 'Condition', 'Shipping A/C'],
//   // 4: values
//   ['Website', 'Charged - Stripe', 'Intel', 'Motherboard', 'D915GEV', 1, '', ''],
//   // 5: labels
//   ['Bill to address', 'Ship to address', 'City', 'State', 'Country', 'Carrier', 'Tracking #', 'Status'],
//   // 6: values
//   ['Darrick Jernigan', 'Darrick Jernigan', '', '', '', 'FedEx Ground', '1Z0XF5940305456', 'Delivered'],
//   // 7: labels
//   ['Reasons (IF any)', 'Customer', 'Customer Company', 'Email', 'Phone', 'Customer PO#', 'Price', 'Shipping'],
//   // 8: values
//   ['', 'Darrick Jernigan', 'Honeywell', 'darrick.jernigan@hon', '6024363736', '', 157.75, ''],
//   // 9: labels
//   ['Tax', 'Vendor', 'Vendor order#', 'Vendor Part#', 'Status', 'CC/Paypal/Stripe Fee 4%', 'Paid Via', 'Charged Vendor'],
//   // 10: values
//   ['', 'eBay - bitremedy1', '', 'C63668-303', '', 4.87, '', ''],
//   // 11: labels
//   ['Cost', 'Shipping', 'Tax', 'Total Price', 'Total Cost', 'Total Cost+4%', 'Gross Profit', 'Gross Profit-4%'],
//   // 12: values (computed). Rows are 1-indexed in formulas, so this is row 13.
//   [
//     72.99,                 // Cost
//     6.28,                  // Shipping
//     '=G9',                 // Tax (pull the Price? -> screenshot shows 157.75 here; keep as raw)
//     157.75,                // Total Price
//     '=A13+B13+C13',        // Total Cost = Cost + Shipping + Tax
//     '=E13*1.04',           // Total Cost + 4%
//     '=D13-E13',            // Gross Profit = Total Price - Total Cost
//     '=D13-F13',            // Gross Profit - 4% = Total Price - Total Cost+4%
//   ],
// ];

// // Which rows are LABEL bands (green) vs the title
// const LABEL_ROWS = [1, 3, 5, 7, 9, 11];
// const TITLE_ROW = 0;

// function FinanceDashboard() {
//   return (
//     <div style={{ width: '100%', padding: 16 }}>
//       <HotTable
//         data={data}
//         themeName="ht-theme-main"
//         height="auto"
//         stretchH="all"
//         rowHeaders={true}
//         colHeaders={true}
//         licenseKey="non-commercial-and-evaluation"
//         formulas={{ engine: HyperFormula }}
//         // Merge the title across the full width
//         mergeCells={[
//           { row: 0, col: 0, rowspan: 1, colspan: 8 },
//         ]}
//         // Per-cell classes: title band + label bands
//         cell={[
//           { row: TITLE_ROW, col: 0, className: 'ols-title' },
//           ...LABEL_ROWS.flatMap((r) =>
//             Array.from({ length: 8 }, (_, c) => ({
//               row: r,
//               col: c,
//               className: 'ols-label',
//             }))
//           ),
//         ]}
//         // Numeric formatting on the computed value row (row index 12)
//         cells={(row, col) => {
//           const cellProps = {};
//           if (row === 12) {
//             cellProps.type = 'numeric';
//             cellProps.numericFormat = { pattern: '0,0.00' };
//           }
//           return cellProps;
//         }}
//         colWidths={[110, 120, 130, 120, 100, 140, 120, 120]}
//         rowHeights={[40, 26, 30, 26, 30, 26, 30, 26, 30, 26, 30, 26, 30]}
//         afterGetColHeader={() => {}}
//         readOnly={false}
//       />
//     </div>
//   );
// }

// export default FinanceDashboard;


import { useRef, useState, useCallback } from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

/*
  ORDER LOOKUP SHEET — Excel-style, matches the Google Sheets screenshot exactly.

  Excel row map (1-indexed, as shown by rowHeaders):
    1-3   TITLE band (merged A1:H3)
    4     labels : Order# | Charged Date | Lead Source | Procured By | Order Date | Sales Agent | Invoice# | Invoice Link
    5     spacer
    6     values (Order# 110050 sits here)
    7     spacer
    8     labels : Order Source | Payment Status | Brands | Category | part# | Qty | Condition | Shipping A/C
    9     spacer
    10    values
    11    labels : Bill to | Ship to | City | State | Country | Carrier | Tracking # | Status
    12    spacer
    13    values
    14    labels : Reasons | Customer | Customer Company | Email | Phone | Customer PO# | Price | Shipping
    15    spacer
    16    values
    17    spacer
    18    labels : Tax | Vendor | Vendor order# | Vendor Part# | Status | CC/Paypal/Stripe Fee 4% | Paid Via | Charged Vendor
    19    spacer
    20    values
    21    labels : Cost | Shipping | Tax | Total Price | Total Cost | Total Cost+4% | Gross Profit | Gross Profit-4%
    22    spacer
    23    values (computed via HyperFormula — formulas reference row 23)

  So DATA array is 0-indexed => Excel row N == data[N-1].
*/

const EMPTY = ['', '', '', '', '', '', '', ''];

// Build an empty sheet skeleton (labels are static; values start blank).
function buildSheet(order) {
  const o = order || {};
  return [
    // 1-3 title
    ['ORDER LOOKUP SHEET', '', '', '', '', '', '', ''],
    [...EMPTY],
    [...EMPTY],
    // 4 labels
    ['', 'Charged Date', 'Lead Source', 'Procured By', 'Order Date', 'Sales Agent', 'Invoice#', 'Invoice Link'],
    // 5 spacer
    [...EMPTY],
    // 6 values
    [o.orderNo || '', o.chargedDate || '', o.leadSource || '', o.procuredBy || '', o.orderDate || '', o.salesAgent || '', o.invoiceNo || '', o.invoiceLink || ''],
    // 7 spacer
    [...EMPTY],
    // 8 labels
    ['Order Source', 'Payment Status', 'Brands', 'Category', 'part#', 'Qty', 'Condition', 'Shipping A/C'],
    // 9 spacer
    [...EMPTY],
    // 10 values
    [o.orderSource || '', o.paymentStatus || '', o.brands || '', o.category || '', o.partNo || '', o.qty ?? '', o.condition || '', o.shippingAc || ''],
    // 11 labels
    ['Bill to address', 'Ship to address', 'City', 'State', 'Country', 'Carrier', 'Tracking #', 'Status'],
    // 12 spacer
    [...EMPTY],
    // 13 values
    [o.billTo || '', o.shipTo || '', o.city || '', o.state || '', o.country || '', o.carrier || '', o.tracking || '', o.status || ''],
    // 14 labels
    ['Reasons (IF any)', 'Customer', 'Customer Company', 'Email', 'Phone', 'Customer PO#', 'Price', 'Shipping'],
    // 15 spacer
    [...EMPTY],
    // 16 values
    ['', o.customer || '', o.customerCompany || '', o.email || '', o.phone || '', o.customerPo || '', o.price ?? '', o.shipping ?? ''],
    // 17 spacer
    [...EMPTY],
    // 18 labels
    ['Tax', 'Vendor', 'Vendor order#', 'Vendor Part#', 'Status', 'CC/Paypal/Stripe Fee 4%', 'Paid Via', 'Charged Vendor'],
    // 19 spacer
    [...EMPTY],
    // 20 values
    ['', o.vendor || '', o.vendorOrderNo || '', o.vendorPartNo || '', o.vendorStatus || '', o.stripeFee ?? '', o.paidVia || '', o.chargedVendor || ''],
    // 21 labels
    ['Cost', 'Shipping', 'Tax', 'Total Price', 'Total Cost', 'Total Cost+4%', 'Gross Profit', 'Gross Profit-4%'],
    // 22 spacer
    [...EMPTY],
    // 23 values (computed). Formulas reference row 23.
    [
      o.cost ?? '',                 // A23 Cost
      o.costShipping ?? '',         // B23 Shipping
      o.costTax ?? '',              // C23 Tax
      o.totalPrice ?? '',           // D23 Total Price
      '=A23+B23+C23',               // E23 Total Cost = Cost + Shipping + Tax
      '=E23*1.04',                  // F23 Total Cost + 4%
      '=D23-E23',                   // G23 Gross Profit = Total Price - Total Cost
      '=D23-F23',                   // H23 Gross Profit - 4%
    ],
  ];
}

// Excel rows that are LABEL bands (green). 1-indexed -> convert to 0-indexed.
const LABEL_ROWS_EXCEL = [4, 8, 11, 14, 18, 21];
const LABEL_ROWS = LABEL_ROWS_EXCEL.map((r) => r - 1);
const VALUE_ROW_COMPUTED = 22; // Excel row 23, 0-indexed

// Sample order used when nothing is fetched yet — matches the screenshot.
const SAMPLE = {
  orderNo: '110050', chargedDate: '7/20/2022', leadSource: 'Inbound', orderDate: '7/20/2022',
  orderSource: 'Website', paymentStatus: 'Charged - Stripe', brands: 'Intel', category: 'Motherboard',
  partNo: 'D915GEV', qty: 1,
  billTo: 'Darrick Jernigan', shipTo: 'Darrick Jernigan H', carrier: 'FedEx Ground',
  tracking: '1Z0XF5940305456', status: 'Delivered',
  customer: 'Darrick Jernigan', customerCompany: 'Honeywell', email: 'darrick.jernigan@hon',
  phone: '6024363736', price: 157.75,
  vendor: 'eBay - bitremedy1', vendorPartNo: 'C63668-303', stripeFee: 4.87,
  cost: 72.99, costShipping: 6.28, costTax: 157.75, totalPrice: 157.75,
};

function FinanceDashboard() {
  const hotRef = useRef(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sheet, setSheet] = useState(() => buildSheet(SAMPLE));

  const handleLookup = useCallback(async () => {
    const orderNo = query.trim();
    if (!orderNo) {
      setError('Enter an order number to look up.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // ── Wire this to your SpareMicro Laravel order API ──────────────
      // Example:
      //   const res = await fetch(`/api/orders/${orderNo}/lookup`);
      //   if (!res.ok) throw new Error('Order not found');
      //   const order = await res.json();
      // Map the API shape to the keys used in buildSheet() above.
      //
      // For now we simulate: only the sample order number resolves.
      await new Promise((r) => setTimeout(r, 400)); // fake latency
      if (orderNo === SAMPLE.orderNo) {
        setSheet(buildSheet(SAMPLE));
      } else {
        // Unknown order -> blank sheet with just the order number filled in
        setSheet(buildSheet({ orderNo }));
        setError(`No record found for order ${orderNo}. Showing a blank sheet.`);
      }
    } catch (e) {
      setError(e.message || 'Lookup failed. Try again.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ width: '100%', padding: 16 }}>
      {/* Lookup bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          placeholder="Enter order number (e.g. 110050)"
          style={{
            padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6,
            fontSize: 14, minWidth: 260,
          }}
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          style={{
            padding: '8px 16px', border: 'none', borderRadius: 6,
            background: '#1b51ef', color: '#fff', fontWeight: 600,
            cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Looking up…' : 'Look up order'}
        </button>
      </div>
      {error && (
        <div style={{ color: '#b45309', fontSize: 13, marginBottom: 8 }}>{error}</div>
      )}

      <HotTable
        ref={hotRef}
        data={sheet}
        themeName="ht-theme-main"
        height="auto"
        stretchH="all"
        rowHeaders={true}      /* 1, 2, 3 ... row numbers (left) */
        colHeaders={true}      /* A, B, C ... column letters (top) */
        licenseKey="non-commercial-and-evaluation"
        formulas={{ engine: HyperFormula }}
        mergeCells={[
          { row: 0, col: 0, rowspan: 3, colspan: 8 }, // title A1:H3
        ]}
        cell={[
          { row: 0, col: 0, className: 'ols-title' },
          ...LABEL_ROWS.flatMap((r) =>
            Array.from({ length: 8 }, (_, c) => ({ row: r, col: c, className: 'ols-label' }))
          ),
        ]}
        cells={(row) => {
          if (row === VALUE_ROW_COMPUTED) {
            return { type: 'numeric', numericFormat: { pattern: '0,0.00' } };
          }
          return {};
        }}
        colWidths={[120, 130, 150, 140, 100, 160, 130, 130]}
      />
    </div>
  );
}

export default FinanceDashboard;