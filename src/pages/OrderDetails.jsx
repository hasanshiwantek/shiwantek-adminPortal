import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import OrderTab from "../components/OrderDetails/OrderTab";
import InvoiceTab from "../components/OrderDetails/InvoiceTab";
import CustomerTab from "../components/OrderDetails/CustomerTab";
import VendorTab from "../components/OrderDetails/VendorTab";
import TotalPriceProfitTab from "../components/OrderDetails/TotalPriceProfitTab";
import { useDispatch, useSelector } from "react-redux";
import NotAllowed from "../components/notallowed/NotAllowed";
import { fetchSingleOrder, fetchSingleOrderAdmin } from "../store/usersSlice";
import { AlertTriangle } from "lucide-react";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const { singleOrder, orderloading, error: usersError } = useSelector((state) => state.users);
    const { storeId,user:authUser } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state?.auth);

  const [activeTab, setActiveTab] = useState("order");
   const hasDash = singleOrder?.order_id?.includes("-");
  // Format order data
  const formattedOrder = singleOrder?.data ? {
    orderId: singleOrder.data["Order#"],
    chargedDate: singleOrder.data["Charged Date"],
    chargedVendor: singleOrder.data["Charged Vendor"],
    leadSource: singleOrder.data["Lead Source"],
    procuredBy: singleOrder.data["Procured By"],
    orderDate: singleOrder.data["Order Date"],
    refundDate: singleOrder.data["Refund Date"],
    salesAgent: singleOrder.data["Sales Agent"],
    invoiceNo: singleOrder.data["Invoice#"],
    orderSource: singleOrder.data["Order Source"],
    paymentStatus: singleOrder.data["Payment Status"],
    brand: singleOrder.data["Brands"],
    category: singleOrder.data["Category"],
    partNumber: singleOrder.data["part#"],
    condition: singleOrder.data["Condition"],
    shippingAccount: singleOrder.data["Shipping A/C"],
    billTo: singleOrder.data["Bill to address"],
    shipTo: singleOrder.data["Ship to address"],
    city: singleOrder.data["City"],
    state: singleOrder.data["State"],
    country: singleOrder.data["Country"],
    carrier: singleOrder.data["Carrier"],
    tracking: singleOrder.data["Tracking #"],
    status: singleOrder.data["Status"],
    reason: singleOrder.data["Reasons (IF any)"],
    customerName: singleOrder.data["Customer"],
    customerCompany: singleOrder.data["Customer Company"],
    customerEmail: singleOrder.data["Email"],
    customerPhone: singleOrder.data["Phone"],
    paidVia: singleOrder.data["Paid Via"],
    ccPaypal: singleOrder.data["CC/Paypal 4%"],
    qty: singleOrder.data["Qty"],
    price: singleOrder.data["Price"],
    shipping: singleOrder.data["Shipping"],
    tax: singleOrder.data["Tax"],
    cost: singleOrder.data["Cost"],
    vendorShipping: singleOrder.data["Vendor Shipping"],
    vendorTax: singleOrder.data["Vendor Tax"],
    totalPriceValue: singleOrder.data["Total Price"],
    vendor: singleOrder.data["Vendor"],
    vendorOrder: singleOrder.data["Vendor order#"],
    vendorPart: singleOrder.data["Vendor Part#"],
    entryReason: singleOrder.data["Entry Reason"],
    comment: singleOrder.data["Comment"],
    attachedOrder: singleOrder.data["Attached To Order"],

      // ---- totals and profits ----
  totalPrice: singleOrder.total_price?.total_price,
  totalPricePrice: singleOrder.total_price?.price,
  totalPriceTax: singleOrder.total_price?.tax,

  totalCost: singleOrder.total_cost?.total_cost,
  totalCostValue: singleOrder.total_cost?.Cost,
  totalCostVendorTax: singleOrder.total_cost?.["Vendor Tax"],

  totalCostWith4Percent: singleOrder["total_cost + 4%"]?.total_cost_4,
  totalCost4Percent: singleOrder["total_cost + 4%"]?.total_Cost,
  ccPaypal4Percent: singleOrder["total_cost + 4%"]?.["CC/Paypal 4%"],

  grossProfit: singleOrder.gross_profit?.gross_profit,
  grossProfitTotalPrice: singleOrder.gross_profit?.total_price,
  grossProfitTotalCost: singleOrder.gross_profit?.total_cost,

  grossProfitMinus4: singleOrder["gross_profit - 4%"]?.["gross_profit+4"],
  grossProfitMinus4TotalPrice: singleOrder["gross_profit - 4%"]?.total_price,
  grossProfitMinus4TotalCost: singleOrder["gross_profit - 4%"]?.["total_cost+4%"],

  profit: singleOrder.profit?.gross_profit,
  profitTotalPrice: singleOrder.profit?.total_price,
  profitTotalCostMinus4: singleOrder.profit?.["total_cost-4%"],
  } : null;
  // User access logic
  const userAccess = user?.page_access?.page_name
    ? Array.isArray(user.page_access.page_name)
      ? user.page_access.page_name
      : Object.values(user.page_access.page_name)
    : [];
  
  const roleId = user?.role_id;
  console.log("Formatted Order:", formattedOrder);

  // Fetch order on mount
  useEffect(() => {
  if(authUser?.role_id === 1 || authUser?.role_id === 2){
dispatch(fetchSingleOrderAdmin({ orderId:orderId, sheetId: storeId?.sheet_id }));
  }
  else{
    dispatch(fetchSingleOrder())
  }
  }, [authUser?.role_id , dispatch, orderId]);

  const hasAccess = (page) => {
    if (roleId === 1 || roleId === 2) return true;
    return userAccess.includes(page);
  };

  // Handle field update
  const handleUpdateField = async (field, value) => {
    // try {
    //   await fetch(`http://127.0.0.1:5000/api/dashboard/update/${orderId}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ [field]: value }),
    //   });
    // } catch (err) {
    //   console.error("Update failed:", err);
    // }
  };

  // Single loading check
  if (orderloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading order...</div>
      </div>
    );
  }

  // Error check
  if (usersError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">
          Error loading order: {usersError}
        </div>
      </div>
    );
  }

  // Order not found check
  if (!formattedOrder) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Order not found.</div>
      </div>
    );
  }

  const tabs = [
    { label: "Order", path: "order" },
    { label: "Invoice", path: "invoice" },
    { label: "Customer", path: "customer" },
    { label: "Vendor", path: "vendor" },
    { label: "Total price & Profit", path: "total-price-profit" },
  ];

  const handleTabClick = (tabPath) => {
    const tabKey = tabPath === "total-price-profit" ? "total price & profit" : tabPath;
    setActiveTab(tabKey);
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
        <h1 className={`text-2xl font-semibold flex items-center gap-2 ${hasDash ? "text-red-600" : "text-gray-700"}`}>
  Order #{singleOrder?.order_id || 0}
  {hasDash && <AlertTriangle size={20} className="text-red-600" />}
</h1>
        </div>

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-gray-400" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {formattedOrder?.procuredBy || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {formattedOrder?.salesAgent || "Sales Agent"}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => {
            const tabKey = tab.path === "total-price-profit" ? "total price & profit" : tab.path;
            return (
            <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                  activeTab === tabKey
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
                {tab.label}
            </button>
            );
          })}
          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-md">
            • {formattedOrder?.status || "Pending"}
          </span>
        </div>

        {/* === ORDER TAB === */}
        {activeTab === "order" && (
          hasAccess("Order") 
          ? <OrderTab orderData={formattedOrder} handleUpdateField={handleUpdateField} />
          : <NotAllowed/>
        )}

        {/* === INVOICE TAB === */}
        {activeTab === "invoice" && (
           hasAccess("Invoice") 
           ? <InvoiceTab orderData={formattedOrder} handleUpdateField={handleUpdateField} />
           : <NotAllowed/>
        )}

        {/* === CUSTOMER TAB === */}
        {activeTab === "customer" && (
          hasAccess("Customer") 
          ? <CustomerTab orderData={formattedOrder} />
          : <NotAllowed/>
        )}

        {/* === VENDOR TAB === */}
        {activeTab === "vendor" && (
          hasAccess("Vendor") 
          ? <VendorTab orderData={formattedOrder} />
          : <NotAllowed/>
        )}

 
        {/* === TOTAL PRICE & PROFIT TAB === */}
        {activeTab === "total price & profit" && (
          hasAccess("Total price & Profit")
          ? <TotalPriceProfitTab orderData={formattedOrder} handleUpdateField={handleUpdateField} />
          : <NotAllowed/>
        )}
      </div>
    </>
  );
};

export default OrderDetails;
