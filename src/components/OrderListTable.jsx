import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { useDispatch, useSelector } from 'react-redux';
import autoTable from 'jspdf-autotable';   // ← Changed import
import EditOrderDetailModal from './EditOrderDetailModal';
import { fetchOrdersAdmin, fetchOrders } from '../store/usersSlice';
import { columnsOfSheet } from '../utils/constant';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

function OrderListTable() {
  const hotRef = useRef(null);
  const dispatch = useDispatch();
  const { Orders, orderloading } = useSelector((state) => state.users);
  const { token, storeId, user: authUser } = useSelector((state) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const exportToExcel = () => {
    if (!Orders || Orders.length === 0) return alert("No data to export");

    const ws = XLSX.utils.json_to_sheet(Orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `CTS_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToPDF = () => {
    if (!Orders || Orders.length === 0) {
      return alert("No data to export");
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a1'   // Use bigger paper size for many columns
    });

    doc.setFontSize(14);
    doc.text("CTS Dashboard - Order Sheet", 14, 20);

    const tableColumn = columnsOfSheet.map(col => col.title);
    const tableRows = Orders.map(order =>
      columnsOfSheet.map(col => {
        let value = order[col.data] ?? "";
        // Clean long text
        if (typeof value === 'string' && value.length > 30) {
          value = value.substring(0, 27) + "...";
        }
        return value;
      })
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 7,           // Smaller font
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [27, 81, 239],
        fontSize: 8,
        textColor: 255
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 25, right: 10, bottom: 15, left: 10 },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 25 },   // Order#
        17: { cellWidth: 40 },  // Bill to address
        18: { cellWidth: 40 },  // Ship to address
        28: { cellWidth: 35 },  // Email
        // Add more if needed
      }
    });

    doc.save(`CTS_Orders_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  // Add this handler
  const handleOrderClick = (rowIndex) => {
    // rowIndex from Handsontable is 0-based (header is row 0)
    const actualDataIndex = rowIndex;
    const clickedOrder = Orders[actualDataIndex];

    if (clickedOrder) {
      setSelectedOrder(clickedOrder);
    }
  };
  useEffect(() => {
    if (authUser?.role_id === 1 || authUser?.role_id === 2) {
      dispatch(fetchOrdersAdmin(storeId?.sheet_id));
    } else {
      dispatch(fetchOrders());
    }
  }, [authUser?.role_id, dispatch, storeId?.sheet_id]);

  if (orderloading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>CTS Dashboard - Order Sheet</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '60px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #1b51ef',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ fontSize: '16px', color: '#666' }}>Loading orders...</p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <React.Fragment>
      {selectedOrder && (
        <EditOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={(updatedOrder) => {
            // Dispatch update action here if needed
            console.log("Updated Order:", updatedOrder);
            // Example: dispatch(updateOrder(updatedOrder));
          }}
        />
      )}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>CTS Dashboard - Order Sheet</h2>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={exportToExcel}
              style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Download Excel
            </button>
            <button
              onClick={exportToPDF}
              style={{ padding: '8px 16px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* ← Add this div with higher z-index control */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          <HotTable
            ref={hotRef}
            data={Orders || []}
            columns={columnsOfSheet}
            style={{ zIndex: 10 }}
            colHeaders={true}
            rowHeaders={true}
            stretchH="all"
            height="auto"
            width="100%"
            licenseKey="non-commercial-and-evaluation"
            filters={true}
            dropdownMenu={true}
            contextMenu={true}
            manualColumnResize={true}
            columnSorting={true}
            fixedColumnsStart={2}
            readOnly={true}
            disableVisualSelection={true}
            // In HotTable props:
            afterOnCellMouseDown={(event, coords) => {
              if (coords.col === 0 && coords.row >= 1) {   // Only when clicking Order# column
                handleOrderClick(coords.row);
                // // Optional: Clear selection after click
                // if (hotRef.current) {
                //   hotRef.current.hotInstance.deselectCell();
                // }
              }
            }}
            emptyDataMessage="No orders found"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default OrderListTable;