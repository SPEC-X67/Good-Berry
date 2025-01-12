import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, MapPin, CreditCard, DollarSign, Edit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchOrders, updateOrderItem } from './moke-data';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    setLoading(true);
    try {
      const orders = await fetchOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateItem(orderId, itemId, updates) {
    try {
      const updatedOrder = await updateOrderItem(orderId, itemId, updates);
      setOrder(updatedOrder);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading order details...</div>;
  }

  if (!order) {
    return <div className="flex items-center justify-center h-screen">Order not found</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          className="mr-4"
          onClick={() => navigate('/admin/orders')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
        <h1 className="text-3xl font-bold text-primary">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><ShoppingBag className="inline-block mr-2" /> <strong>Order ID:</strong> {order.id}</p>
              <p><Calendar className="inline-block mr-2" /> <strong>Date:</strong> {order.orderDate}</p>
              <p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><MapPin className="inline-block mr-2" /> <strong>Address:</strong> {order.address}</p>
              <p><CreditCard className="inline-block mr-2" /> <strong>Payment:</strong> {order.paymentMethod}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingItem({ orderId: order.id, item })}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {order.items.some(item => item.status === 'canceled') && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <h3 className="font-bold text-red-800 mb-2">Canceled Items:</h3>
              {order.items
                .filter(item => item.status === 'canceled')
                .map(item => (
                  <p key={item.id} className="text-red-600">
                    {item.name}: {item.cancelMessage || 'No reason provided'}
                  </p>
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-right">
        <p className="text-2xl font-bold">
          <DollarSign className="inline-block mr-1" />
          Total: ${order.totalAmount.toFixed(2)}
        </p>
      </div>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item Status</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingItem) {
                const updates = { status: editingItem.item.status };
                if (editingItem.item.status === 'canceled') {
                  updates.cancelMessage = editingItem.item.cancelMessage;
                }
                handleUpdateItem(editingItem.orderId, editingItem.item.id, updates);
              }
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right">Status</label>
                  <Select
                    value={editingItem.item.status}
                    onValueChange={(value) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, status: value }
                    })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingItem.item.status === 'canceled' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="cancelMessage" className="text-right">Cancel Reason</label>
                    <Textarea
                      id="cancelMessage"
                      value={editingItem.item.cancelMessage || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, cancelMessage: e.target.value }
                      })}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default OrderDetails;