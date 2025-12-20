import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sandwich
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { orderAPI, Order as ApiOrder, OrderWithTracking } from "../services/api";

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
  status: 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'on-the-way';
  items: OrderItem[];
  totalAmount: number;
  estimatedReadyTime?: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: string;
}

// Helper function to convert API order to frontend order format
const convertApiOrderToFrontendOrder = (apiOrder: OrderWithTracking): Order => {
  // Determine status mapping
  const statusMap: Record<string, Order['status']> = {
    'pending': 'preparing',
    'preparing': 'preparing',
    'completed': 'delivered',
    'cancelled': 'cancelled',
    'delivered': 'delivered',
    'on-the-way': 'on-the-way',
    'ready': 'ready'
  };

  // Convert items
  const items: OrderItem[] = apiOrder.items.map((item, index) => ({
    id: `${apiOrder._id}-${index}`,
    name: item.name || 'Item',
    quantity: item.quantity,
    price: item.price,
    category: 'Unknown',
    specialInstructions: apiOrder.notes || ''
  }));

  // Generate order number if not provided
  const orderNumber = apiOrder.orderNumber || `FF-${new Date(apiOrder.createdAt || Date.now()).getFullYear()}-${apiOrder._id.slice(-4).toUpperCase()}`;

  // Determine order type based on delivery address
  const hasDeliveryAddress = apiOrder.deliveryAddress && apiOrder.deliveryAddress.trim().length > 0;
  const orderType: 'delivery' | 'pickup' = hasDeliveryAddress ? 'delivery' : 'pickup';

  return {
    id: apiOrder._id,
    orderNumber,
    date: apiOrder.createdAt || new Date().toISOString(),
    status: statusMap[apiOrder.status] || 'preparing',
    items,
    totalAmount: apiOrder.total || 0,
    deliveryAddress: apiOrder.deliveryAddress || 'Not specified',
    orderType,
    paymentMethod: apiOrder.paymentMethod || 'Not specified'
  };
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching orders for user:", user?.id);

        // Use the correct order history endpoint
        const response = await orderAPI.getOrderHistory();
        
        console.log("📦 API Response received:", response);

        if (response && response.orders && Array.isArray(response.orders)) {
          const ordersData = response.orders.map(convertApiOrderToFrontendOrder);
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
        
        // Show empty state instead of mock data
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
  }, [user, statusFilter]);

  // Filter orders based on search and status
  useEffect(() => {
    let result = orders;

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter(order => order.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(result);
  }, [orders, activeTab, searchTerm]);

  const getStatusBadge = (status: Order['status']) => {
    const config = {
      preparing: { 
        label: "Preparing", 
        variant: "secondary" as const,
        icon: ChefHat,
        color: "text-orange-600 bg-orange-50 border-orange-200"
      },
      'on-the-way': { 
        label: "On The Way", 
        variant: "secondary" as const,
        icon: Package,
        color: "text-blue-600 bg-blue-50 border-blue-200"
      },
      ready: { 
        label: "Ready for Pickup", 
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200"
      },
      delivered: { 
        label: "Delivered", 
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200"
      },
      cancelled: { 
        label: "Cancelled", 
        variant: "secondary" as const,
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200"
      }
    };

    const { label, icon: Icon, color } = config[status];
    return (
      <Badge variant="outline" className={`gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getItemIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'pizza': return <Pizza className="h-4 w-4 text-orange-500" />;
      case 'burgers': return <Sandwich className="h-4 w-4 text-amber-500" />;
      case 'drinks': return <Coffee className="h-4 w-4 text-blue-500" />;
      case 'sides': return <UtensilsCrossed className="h-4 w-4 text-gray-500" />;
      default: return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      return date.toLocaleDateString() + ' at ' + formatTime(dateString);
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
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <Badge variant="outline" className="text-xs">
                        {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center">
                          {getItemIcon(item.category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            {item.specialInstructions && (
                              <span className="text-orange-600">• Special instructions</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground pl-13">
                      + {order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Actions & Info */}
              <div className="flex flex-col gap-3 md:w-64">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {timeRemaining && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimated Ready</span>
                      <Badge variant={order.status === 'ready' ? "default" : "outline"} 
                             className={order.status === 'ready' ? "bg-green-500 hover:bg-green-600" : ""}>
                        {timeRemaining}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  
                  {order.orderType === 'delivery' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivery to</p>
                      <p className="text-sm font-medium truncate">{order.deliveryAddress}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {order.status === 'ready' && order.orderType === 'pickup' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Picked Up
                    </Button>
                  )}
                  {(order.status === 'preparing' || order.status === 'on-the-way') && (
                    <Button size="sm" variant="outline" className="px-3">
                      <Receipt className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Special instructions section */}
          {order.items.some(item => item.specialInstructions) && (
            <div className="px-6 py-3 bg-amber-50 border-t">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Special Instructions:</span> {
                  order.items
                    .filter(item => item.specialInstructions)
                    .map(item => item.specialInstructions)
                    .join(', ')
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground mt-2">
              Track your food orders and view order history
            </p>
          </div>
          <Button onClick={() => navigate("/menu")} className="gap-2 bg-orange-600 hover:bg-orange-700">
            <ShoppingBag className="h-4 w-4" />
            Order Again
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preparing</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'preparing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ready</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'ready').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">On The Way</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'on-the-way').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by order number or item..."
            className="pl-9 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 gap-2">
              <Filter className="h-4 w-4" />
              Filter by Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("preparing")}>
              <ChefHat className="h-4 w-4 mr-2 text-orange-500" />
              Preparing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("on-the-way")}>
              <Package className="h-4 w-4 mr-2 text-blue-500" />
              On The Way
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("ready")}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Ready for Pickup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Delivered
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="border-0 p-1 bg-secondary/20 rounded-lg">
          <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white">
            All Orders
          </TabsTrigger>
          <TabsTrigger value="preparing" className="rounded-md data-[state=active]:bg-white">
            Preparing
          </TabsTrigger>
          <TabsTrigger value="on-the-way" className="rounded-md data-[state=active]:bg-white">
            On The Way
          </TabsTrigger>
          <TabsTrigger value="ready" className="rounded-md data-[state=active]:bg-white">
            Ready
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                <ChefHat className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || activeTab !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              <Button onClick={() => navigate("/menu")} className="gap-2 bg-orange-600 hover:bg-orange-700">
                <ShoppingBag className="h-4 w-4" />
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;