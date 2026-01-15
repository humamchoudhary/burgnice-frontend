import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import {
  Package,
  ChefHat,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Receipt,
  Eye,
  ShoppingBag,
  Pizza,
  UtensilsCrossed,
  Coffee,
  Sandwich,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  orderAPI,
  Order as ApiOrder,
  OrderWithTracking,
} from "../services/api";

// Types for orders
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  specialInstructions?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "preparing" | "ready" | "delivered" | "cancelled" | "on-the-way";
  items: OrderItem[];
  totalAmount: number;
  estimatedReadyTime?: string;
  deliveryAddress: string;
  orderType: "delivery" | "pickup";
  paymentMethod: string;
}

// Helper function to convert API order to frontend order format
const convertApiOrderToFrontendOrder = (apiOrder: OrderWithTracking): Order => {
  const statusMap: Record<string, Order["status"]> = {
    pending: "preparing",
    preparing: "preparing",
    completed: "delivered",
    cancelled: "cancelled",
    delivered: "delivered",
    "on-the-way": "on-the-way",
    ready: "ready",
  };

  const items: OrderItem[] = apiOrder.items.map((item, index) => ({
    id: `${apiOrder._id}-${index}`,
    name: item.name || "Item",
    quantity: item.quantity,
    price: item.price,
    category: "Unknown",
    specialInstructions: apiOrder.notes || "",
  }));

  const orderNumber =
    apiOrder.orderNumber ||
    `FF-${new Date(apiOrder.createdAt || Date.now()).getFullYear()}-${apiOrder._id.slice(-4).toUpperCase()}`;
  const hasDeliveryAddress =
    apiOrder.deliveryAddress && apiOrder.deliveryAddress.trim().length > 0;
  const orderType: "delivery" | "pickup" = hasDeliveryAddress
    ? "delivery"
    : "pickup";

  return {
    id: apiOrder._id,
    orderNumber,
    date: apiOrder.createdAt || new Date().toISOString(),
    status: statusMap[apiOrder.status] || "preparing",
    items,
    totalAmount: apiOrder.total || 0,
    deliveryAddress: apiOrder.deliveryAddress || "Not specified",
    orderType,
    paymentMethod: apiOrder.paymentMethod || "Not specified",
  };
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch orders from API - OPTIMIZED
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching orders for user:", user?.id);

        // Use the optimized endpoint that fetches orders directly
        const response = await orderAPI.getOrderHistory();

        console.log("📦 API Response received:", response);

        if (response && response.orders && Array.isArray(response.orders)) {
          const ordersData = response.orders.map(
            convertApiOrderToFrontendOrder,
          );
          console.log(`✅ Converted ${ordersData.length} orders from API`);

          setOrders(ordersData);
          setFilteredOrders(ordersData);
        } else {
          console.log("❌ No orders found in response");
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error: any) {
        console.error("❌ Error fetching orders:", error);
        console.error("Error details:", error.response?.data);

        setOrders([]);
        setFilteredOrders([]);

        if (error.response?.status === 401) {
          toast.error("Please login to view orders");
        } else {
          toast.error("Failed to load orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
      setFilteredOrders([]);
    }
  }, [user]); // Removed statusFilter from dependencies since it's not used in fetching

  // Filter orders based on search and status
  useEffect(() => {
    let result = orders;

    if (activeTab !== "all") {
      result = result.filter((order) => order.status === activeTab);
    }

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredOrders(result);
  }, [orders, activeTab, searchTerm]);

  const getStatusBadge = (status: Order["status"]) => {
    const config = {
      preparing: {
        label: "Preparing",
        icon: ChefHat,
        color: "text-orange-600 bg-orange-50 border-orange-200",
      },
      "on-the-way": {
        label: "On The Way",
        icon: Package,
        color: "text-blue-600 bg-blue-50 border-blue-200",
      },
      ready: {
        label: "Ready for Pickup",
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
      },
      delivered: {
        label: "Delivered",
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200",
      },
    };

    const { label, icon: Icon, color } = config[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
      >
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getItemIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "pizza":
        return <Pizza className="h-4 w-4 text-orange-500" />;
      case "burgers":
        return <Sandwich className="h-4 w-4 text-amber-500" />;
      case "drinks":
        return <Coffee className="h-4 w-4 text-blue-500" />;
      case "sides":
        return <UtensilsCrossed className="h-4 w-4 text-gray-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${formatTime(dateString)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${formatTime(dateString)}`;
    } else {
      return date.toLocaleDateString() + " at " + formatTime(dateString);
    }
  };

  const getTimeRemaining = (estimatedTime?: string) => {
    if (!estimatedTime) return null;
    const now = new Date();
    const estimated = new Date(estimatedTime);
    const diff = estimated.getTime() - now.getTime();

    if (diff <= 0) return "Ready now";

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const timeRemaining = getTimeRemaining(order.estimatedReadyTime);

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {getItemIcon(item.category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>Qty: {item.quantity}</span>
                            {item.specialInstructions && (
                              <span className="text-orange-600">
                                • Special instructions
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 pl-13">
                      + {order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Actions & Info */}
              <div className="flex flex-col gap-3 md:w-64">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {timeRemaining &&
                    order.status !== "delivered" &&
                    order.status !== "cancelled" && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Estimated Ready
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            order.status === "ready"
                              ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                              : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {timeRemaining}
                        </span>
                      </div>
                    )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Payment
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {order.orderType === "delivery" && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Delivery to
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  {order.status === "ready" && order.orderType === "pickup" && (
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm">
                      Picked Up
                    </button>
                  )}
                  {(order.status === "preparing" ||
                    order.status === "on-the-way") && (
                    <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                      <Receipt className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Special instructions section */}
          {order.items.some((item) => item.specialInstructions) && (
            <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Special Instructions:</span>{" "}
                {order.items
                  .filter((item) => item.specialInstructions)
                  .map((item) => item.specialInstructions)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div className="p-6">
              <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  const tabs = [
    { value: "all", label: "All Orders" },
    { value: "preparing", label: "Preparing" },
    { value: "on-the-way", label: "On The Way" },
    { value: "ready", label: "Ready" },
  ];

  const statusOptions = [
    { value: "all", label: "All Orders", icon: null },
    {
      value: "preparing",
      label: "Preparing",
      icon: <ChefHat className="h-4 w-4 mr-2 text-orange-500" />,
    },
    {
      value: "on-the-way",
      label: "On The Way",
      icon: <Package className="h-4 w-4 mr-2 text-blue-500" />,
    },
    {
      value: "ready",
      label: "Ready for Pickup",
      icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />,
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />,
    },
  ];

  // Calculate order stats for display
  const orderStats = {
    total: orders.length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    onTheWay: orders.filter((o) => o.status === "on-the-way").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your food orders and view order history
            </p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Order Again
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orderStats.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Preparing
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orderStats.preparing}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ready
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orderStats.ready}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    On The Way
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orderStats.onTheWay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by order number or item..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filter by Status
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-10">
              <div className="py-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActiveTab(option.value);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Tabs */}
      <div className="mb-6">
        <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                <ChefHat className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || activeTab !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors mx-auto"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
