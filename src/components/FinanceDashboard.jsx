import { useRef, useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

const orderData = [
  // === HEADER ROW ===
  [
    "Order#", "Charged Date", "Lead Source", "Procured By", "Order Date", "Refund Date",
    "Sales Agent", "Invoice#", "Invoice Link", "Order Source", "Payment Status", "Brands",
    "Category", "part#", "Qty", "Condition", "Shipping A/C", "Bill to address", "Ship to address",
    "City", "State", "Country", "Carrier", "Tracking#", "Status", "Reasons (IF any)",
    "Customer", "Customer Company", "Email", "Phone", "Customer PO#", "Price", "Shipping",
    "Tax", "Vendor", "Vendor order#", "Vendor Part#", "Status", "CC/Paypal 4%", "Charged Vendor",
    "Paid Via", "Cost", "Vendor Shipping", "Vendor Tax", "Total Price", "Total Cost",
    "Total Cost+4%", "Gross Profit", "Gross Profit-4%", "Profit %", "Check/Invoice#",
    "Entry Check", "Attached To Order", "Entry Reason", "Comment"
  ],

  // === REAL DATA ROWS (from your Excel file) ===
  ["311711", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Dell", "SSD", "8C3CP", 1, "Refurb", "Vendor Account", "3939 Lavista Rd E245 Tucker, Georgia, 30084 USA", "3939 Lavista Rd E245 Tucker, Georgia, 30084 USA", "Tucker", "Georgia", "USA", "USPS", "940010810624...", "Delivered", "", "Lucien Cook", "-", "olb.lhc@live.com", "2102102100", "", 79.98, 10, "", "eBay - unlocked4life", "19-14433-08660", "", "", 2.91, "", "CC", 45, "", 3.6, 89.98, 48.6, 51.51, 41.38, 38.47, "42.75%", "", "", "", "", ""],

  ["311712", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "D-Link", "Rouder", "DAP-2553", 1, "Refurb", "Vendor Account", "20360 N 110TH LANE SUN CITY, Arizona, 85373 USA", "10401 W Thunderbird Blvd, SUN CITY, Arizona, 85351 USA", "SUN CITY", "Arizona", "USA", "USPS", "943463610619...", "Delivered", "", "DEBORAH TESTA", "-", "Deborah.testa@gmail.com", "4803325454", "", 127.18, 194.11, "", "eBay - blue_frog_enterprises", "11-14448-31542", "", "", 9.62, "", "CC", 47.99, 15.25, 15.25, 321.29, 78.49, 88.11, 242.8, 233.18, "72.58%", "", "Serial # PVIAU1B7000406", "", "", ""],

  ["311712", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "D-Link", "Rouder", "DAP-2553", 1, "Refurb", "Vendor Account", "20360 N 110TH LANE SUN CITY, Arizona, 85373 USA", "10401 W Thunderbird Blvd, SUN CITY, Arizona, 85351 USA", "SUN CITY", "Arizona", "USA", "USPS", "943460810624...", "Delivered", "", "DEBORAH TESTA", "-", "Deborah.testa@gmail.com", "4803325454", "", "", "", "", "eBay - admin.sayyah1", "14-14445-13733", "", "", 0, "", "CC", 38.99, 16.99, 2.46, 0, 58.44, 58.44, -58.44, -58.44, "#DIV/0!", "", "", "", "", ""],

  ["311717", "4/12/2026", "Order Update", "Bill Dawson", "4/12/2026", "", "Frank", "KOMCQFQH-0001", "https://invoice.stripe.com/...", "Order Update", "Charged-stripe", "Brady", "Printer", "BBP11-34L", 1, "Refurb", "Vendor Account", "W57N14386 Doerr Way East Bldg Cedarburg, WI, Wisconsin, 53012 USA", "W57N14386 Doerr Way East Bldg Cedarburg, WI, Wisconsin, 53012 USA", "Cedarburg", "Wisconsin", "USA", "UPS Ground", "1Z78AR120394...", "Delivered", "", "Amy Krumbiegel", "Carlson Tool & Manufacturing Corp", "akrumbiegel@gmail.com", "2623778771", "", 199.65, 35.15, "", "eBay - solutionsdepot", "24-14445-73926", "", "", 7.11, "", "CC", 180, "", 9.9, 234.8, 189.9, 197.01, 44.9, 37.79, "16.09%", "", "", "", "", ""],

  ["311718", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Canon", "Scanner", "2925B002", 1, "Refurb", "Vendor Account", "32912 Danapoplar Dana Point, California, 92629 USA", "32912 Danapoplar Dana Point, California, 92629 USA", "Dana Point", "California", "USA", "USPS", "943460810624...", "Delivered", "RMA open Reason : We received the scanner...", "Darrell Foster", "-", "fdarrell44@gmail.com", "", "", 161.36, 10, "", "eBay - idioteque928", "15-14443-21604", "", "", 5.27, "", "CC", 36, 16.8, 2.79, 171.36, 55.59, 60.86, 115.77, 110.5, "64.48%", "", "R Label tracking : 9302...", "RMA closed got refund from vendor", ""],

  ["311718", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Canon", "Scanner", "2925B002", 1, "Refurb", "Vendor Account", "32912 Danapoplar Dana Point, California, 92629 USA", "32912 Danapoplar Dana Point, California, 92629 USA", "Dana Point", "California", "USA", "USPS", "", "", "Full refund to cx", "Darrell Foster", "-", "fdarrell44@gmail.com", "", "", 55.59, "", "", "", "", "", "", 0, "", "", "", "", "", 171.36, 171.36, -115.77, -115.77, "-2.0826", "", "", "", "", ""],

  ["311719", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Crestron", "Pair Receiver", "HD-RX3-CB", 1, "Refurb", "Vendor Account", "1020 Detroit Ave Concord, California, 94518 USA", "1020 Detroit Ave Concord, California, 94518 USA", "Concord", "California", "USA", "UPS Ground", "1ZHG199603...", "Delivered", "", "Patrick Canada", "PG&E", "PJCJ@gmail.com", "9257198844", "", 33.88, 5, "", "eBay - musthavegear", "01-14464-27399", "", "", 3.81, "", "CC", 14.99, "", 1.46, 38.88, 16.45, 20.26, 22.43, 18.62, "47.89%", "", "", "", "", ""],

  ["311719", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Crestron", "Adapter", "HD-TX3-C-W", 1, "Refurb", "Vendor Account", "1020 Detroit Ave Concord, California, 94518 USA", "1020 Detroit Ave Concord, California, 94518 USA", "Concord", "California", "USA", "USPS", "940015020622...", "Delivered", "", "Patrick Canada", "PG&E", "PJCJ@gmail.com", "9257198844", "", 77.32, 5, "", "eBay - werks1234", "04-14462-33323", "", "", 0, "", "CC", 23, "", 2.24, 82.32, 25.24, 25.24, 57.08, 57.08, "69.34%", "", "", "", "", ""],

  ["311719", "4/12/2026", "PPC Direct", "Bill Dawson", "4/12/2026", "", "PPC", "", "", "PPC Direct", "Charged-stripe", "Crestron", "Adapter", "HD-TX3-C-W", 1, "Refurb", "Vendor Account", "1020 Detroit Ave Concord, California, 94518 USA", "1020 Detroit Ave Concord, California, 94518 USA", "Concord", "California", "USA", "USPS", "921449040447...", "Delivered", "", "Patrick Canada", "PG&E", "PJCJ@gmail.com", "9257198844", "", "", "", "", "eBay - bestadapter", "14-14493-62519", "", "", 0, "", "CC", 9.99, 3.99, 0.97, 0, 14.95, 14.95, -14.95, -14.95, "#DIV/0!", "", "Note : Order is for AC adapter", "", ""]
];
// const orderData = [
//   {
//     "Order#": "311711",
//     "Charged Date": "4/12/2026",
//     "Lead Source": "PPC Direct",
//     "Procured By": "Bill Dawson",
//     "Order Date": "4/12/2026",
//     "Refund Date": "",
//     "Sales Agent": "PPC",
//     "Invoice#": "",
//     "Invoice Link": "",
//     "Order Source": "PPC Direct",
//     "Payment Status": "Charged-stripe",
//     "Brands": "Dell",
//     "Category": "SSD",
//     "part#": "8C3CP",
//     "Qty": 1,
//     "Condition": "Refurb",
//     "Shipping A/C": "Vendor Account",
//     "Bill to address": "3939 Lavista Rd E245 Tucker, Georgia, 30084 USA",
//     "Ship to address": "3939 Lavista Rd E245 Tucker, Georgia, 30084 USA",
//     "City": "Tucker",
//     "State": "Georgia",
//     "Country": "USA",
//     "Carrier": "USPS",
//     "Tracking": "940010810624...",
//     "Status": "Delivered",
//     "Reasons (IF any)": "",
//     "Customer": "Lucien Cook",
//     "Customer Company": "-",
//     "Email": "olb.lhc@live.com",
//     "Phone": "2102102100",
//     "Price": 79.98,
//     "Shipping": 10,
//     "Tax": "",
//     "Vendor": "eBay - unlocked4life",
//     "Vendor order#": "19-14433-08660",
//     "Vendor Part#": "",
//     "CC/Paypal 4%": 2.91,
//     "Charged Vendor": "",
//     "Paid Via": "CC",
//     "Cost": 45,
//     "Vendor Shipping": "",
//     "Vendor Tax": 3.6,
//     "Total Price": 89.98,
//     "Total Cost": 48.6,
//     "Total Cost+4%": 51.51,
//     "Gross Profit": 41.38,
//     "Gross Profit-4%": 38.47,
//     "Profit %": "42.75%",
//     "Check/Invoice": "",
//     "Entry Check": "",
//     "Attached To Order": "",
//     "Entry Reason": "",
//     "Comment": ""
//   },
//   {
//     "Order#": "311712",
//     "Charged Date": "4/12/2026",
//     "Lead Source": "PPC Direct",
//     "Procured By": "Bill Dawson",
//     "Order Date": "4/12/2026",
//     "Refund Date": "",
//     "Sales Agent": "PPC",
//     "Invoice#": "",
//     "Invoice Link": "",
//     "Order Source": "PPC Direct",
//     "Payment Status": "Charged-stripe",
//     "Brands": "D-Link",
//     "Category": "Rouder",
//     "part#": "DAP-2553",
//     "Qty": 1,
//     "Condition": "Refurb",
//     "Shipping A/C": "Vendor Account",
//     "Bill to address": "20360 N 110TH LANE SUN CITY, Arizona, 85373 USA",
//     "Ship to address": "10401 W Thunderbird Blvd, SUN CITY, Arizona, 85351 USA",
//     "City": "SUN CITY",
//     "State": "Arizona",
//     "Country": "USA",
//     "Carrier": "USPS",
//     "Tracking": "943463610619...",
//     "Status": "Delivered",
//     "Reasons (IF any)": "",
//     "Customer": "DEBORAH TESTA",
//     "Customer Company": "-",
//     "Email": "Deborah.testa@gmail.com",
//     "Phone": "4803325454",
//     "Price": 127.18,
//     "Shipping": 194.11,
//     "Tax": "",
//     "Vendor": "eBay - blue_frog_enterprises",
//     "Vendor order#": "11-14448-31542",
//     "Vendor Part#": "",
//     "CC/Paypal 4%": 9.62,
//     "Charged Vendor": "",
//     "Paid Via": "CC",
//     "Cost": 47.99,
//     "Vendor Shipping": 15.25,
//     "Vendor Tax": 15.25,
//     "Total Price": 321.29,
//     "Total Cost": 78.49,
//     "Total Cost+4%": 88.11,
//     "Gross Profit": 242.8,
//     "Gross Profit-4%": 233.18,
//     "Profit %": "72.58%",
//     "Check/Invoice": "",
//     "Entry Check": "",
//     "Attached To Order": "Serial # PVIAU1B7000406",
//     "Entry Reason": "",
//     "Comment": ""
//   },
//   // ... I have added more rows below (shortened for message length)
//   {
//     "Order#": "311717",
//     "Charged Date": "4/12/2026",
//     "Lead Source": "Order Update",
//     "Procured By": "Bill Dawson",
//     "Order Date": "4/12/2026",
//     "Refund Date": "",
//     "Sales Agent": "Frank",
//     "Invoice#": "KOMCQFQH-0001",
//     "Invoice Link": "https://invoice.stripe.com/...",
//     "Order Source": "Order Update",
//     "Payment Status": "Charged-stripe",
//     "Brands": "Brady",
//     "Category": "Printer",
//     "part#": "BBP11-34L",
//     "Qty": 1,
//     "Condition": "Refurb",
//     "Shipping A/C": "Vendor Account",
//     "Bill to address": "W57N14386 Doerr Way East Bldg Cedarburg, WI, Wisconsin, 53012 USA",
//     "Ship to address": "W57N14386 Doerr Way East Bldg Cedarburg, WI, Wisconsin, 53012 USA",
//     "City": "Cedarburg",
//     "State": "Wisconsin",
//     "Country": "USA",
//     "Carrier": "UPS Ground",
//     "Tracking": "1Z78AR120394...",
//     "Status": "Delivered",
//     "Reasons (IF any)": "",
//     "Customer": "Amy Krumbiegel",
//     "Customer Company": "Carlson Tool & Manufacturing Corp",
//     "Email": "akrumbiegel@gmail.com",
//     "Phone": "2623778771",
//     "Price": 199.65,
//     "Shipping": 35.15,
//     "Tax": "",
//     "Vendor": "eBay - solutionsdepot",
//     "Vendor order#": "24-14445-73926",
//     "Vendor Part#": "",
//     "CC/Paypal 4%": 7.11,
//     "Charged Vendor": "",
//     "Paid Via": "CC",
//     "Cost": 180,
//     "Vendor Shipping": "",
//     "Vendor Tax": 9.9,
//     "Total Price": 234.8,
//     "Total Cost": 189.9,
//     "Total Cost+4%": 197.01,
//     "Gross Profit": 44.9,
//     "Gross Profit-4%": 37.79,
//     "Profit %": "16.09%",
//     "Check/Invoice": "",
//     "Entry Check": "",
//     "Attached To Order": "",
//     "Entry Reason": "",
//     "Comment": ""
//   }
//   // Add the remaining orders here (311718, 311719 etc.) in same format
// ];
function OrderListTable() {
  const hotRef = useRef(null);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ marginBottom: '16px' }}>CTS Dashboard - Order Sheet</h2>

      <HotTable
        ref={hotRef}
        data={orderData}
        themeName="ht-theme-main"
        height="auto"
        width="100%"
        stretchH="all"
        rowHeaders={true}
        colHeaders={true}
        licenseKey="non-commercial-and-evaluation"
        formulas={{ engine: HyperFormula }}
        filters={true}
        dropdownMenu={true}
        contextMenu={true}
        manualColumnResize={true}
        manualRowResize={true}
        columnSorting={true}
        fixedColumnsStart={2}           // Freeze first 2 columns
        colWidths={[
          90, 100, 110, 120, 100, 100, 110, 110, 180, 120,
          130, 110, 120, 110, 60, 90, 130, 220, 220, 110,
          90, 80, 110, 140, 100, 200, 140, 140, 180, 120,
          110, 100, 90, 140, 140, 120, 100, 110, 110, 100,
          100, 100, 100, 110, 110, 130, 130, 130, 100, 100,
          120, 120, 140, 200
        ]}
        cells={(row, col) => {
          if (row === 0) {
            return { className: 'htHeader' }; // Bold headers
          }
          // Optional: color negative profits
          if (col === 47 && orderData[row]?.[47] && orderData[row][47] < 0) {
            return { className: 'htNegative' };
          }
          return {};
        }}
      />

      <style jsx>{`
        .htHeader { font-weight: bold; background: #fff2cc; }
        .htNegative { color: red; font-weight: bold; }
      `}</style>
    </div>
  );
}

export default OrderListTable;