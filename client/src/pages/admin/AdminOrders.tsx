import AdminLayout from "@/components/layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  SearchIcon,
  CalendarIcon,
  OrdersIcon,
  EyeIcon
} from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock orders data since we don't have a direct API endpoint for all orders
  // In a real application, you would fetch this from an API endpoint
  const mockOrders = [
    {
      id: 1,
      customerName: "John Doe",
      email: "john.doe@example.com",
      total: 129.99,
      status: "completed",
      date: "2023-05-15T08:30:00Z",
      items: [
        { id: 1, name: "Mixed Premium Nuts", price: 29.99, quantity: 2 },
        { id: 2, name: "Organic Almonds", price: 24.99, quantity: 1 },
        { id: 3, name: "Raw Cashews", price: 19.99, quantity: 2 }
      ]
    },
    {
      id: 2,
      customerName: "Jane Smith",
      email: "jane.smith@example.com",
      total: 75.98,
      status: "processing",
      date: "2023-05-16T10:15:00Z",
      items: [
        { id: 4, name: "Honey Granola", price: 12.99, quantity: 2 },
        { id: 5, name: "Protein Bars Variety Pack", price: 24.99, quantity: 2 }
      ]
    },
    {
      id: 3,
      customerName: "Robert Johnson",
      email: "robert.j@example.com",
      total: 45.99,
      status: "completed",
      date: "2023-05-14T14:45:00Z",
      items: [
        { id: 6, name: "Organic Chia Seeds", price: 15.99, quantity: 1 },
        { id: 7, name: "Quinoa Crisps", price: 9.99, quantity: 3 }
      ]
    },
    {
      id: 4,
      customerName: "Emily Wilson",
      email: "emily.w@example.com",
      total: 89.97,
      status: "shipped",
      date: "2023-05-13T09:20:00Z",
      items: [
        { id: 8, name: "Trail Mix", price: 18.99, quantity: 3 },
        { id: 9, name: "Dark Chocolate Covered Almonds", price: 16.99, quantity: 2 }
      ]
    },
    {
      id: 5,
      customerName: "Michael Brown",
      email: "michael.b@example.com",
      total: 64.95,
      status: "cancelled",
      date: "2023-05-12T16:10:00Z",
      items: [
        { id: 10, name: "Goji Berries", price: 21.99, quantity: 1 },
        { id: 11, name: "Dried Mango Slices", price: 14.99, quantity: 1 },
        { id: 12, name: "Coconut Flakes", price: 9.99, quantity: 1 },
        { id: 13, name: "Brazil Nuts", price: 17.98, quantity: 1 }
      ]
    }
  ];

  const { isLoading } = useQuery({ 
    queryKey: ['/api/products'], 
  });

  const filteredOrders = mockOrders.filter((order) => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge style based on order status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Order Management | NatureNutri Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search orders by customer name, email, status or order ID..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewOrder(order)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Details</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Order ID:</span>
                      <span>#{selectedOrder.id}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${selectedOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}