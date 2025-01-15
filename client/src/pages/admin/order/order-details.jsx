import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, MapPin, CreditCard, Edit, ArrowLeft, Phone} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '@/store/admin-slice/order-slice';
import axios from 'axios';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderDetails, isLoading, error } = useSelector((state) => state.adminOrder);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  console.log("orderDetails", orderDetails);

  async function handleUpdateItem(orderId, itemId, updates) {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/items/${itemId}`, updates, { withCredentials: true });
      dispatch(fetchOrderById(orderId));
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
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  let paymentMethodName = "";

  if (orderDetails && orderDetails.paymentMethod === "cod") {
    paymentMethodName = "Cash on Delivery";
  } else if (orderDetails && orderDetails.paymentMethod === "card") {
    paymentMethodName = "Credit Card";
  } else if (orderDetails && orderDetails.paymentMethod === "upi") {
    paymentMethodName = "Payed with UPI";
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading order details...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error fetching order details: {error}</div>;
  }

  if (!orderDetails) {
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
              <p><ShoppingBag className="inline-block mr-2" /> <strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><Calendar className="inline-block mr-2" /> <strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
              <p><CreditCard className="inline-block mr-2" /> <strong>Payment:</strong> {paymentMethodName}</p>
              <p>
                <Badge className={getStatusColor(orderDetails.status)}>
                  {orderDetails.status}
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
              <p><strong>Name:</strong> {orderDetails.userId.username}</p>
              <p><MapPin className="inline-block mr-2" /> <strong>Address:</strong> {orderDetails.addressId.street}, <br />{orderDetails.addressId.city}, {orderDetails.addressId.state}, {orderDetails.addressId.zip}, {orderDetails.addressId.country}</p>
              <p><Phone className='inline-block mr-2 w-5'/> <strong>Phone:</strong>+91 {orderDetails.addressId.mobile}</p>
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
              {orderDetails.items.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingItem({ orderId: orderDetails._id, item })}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orderDetails.items.some(item => item.status === 'cancelled') && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <h3 className="font-bold text-red-800 mb-2">Cancelled Items:</h3>
              {orderDetails.items
                .filter(item => item.status === 'cancelled')
                .map(item => (
                  <p key={item._id} className="text-red-600">
                    {item.name}: {item.cancellationReason || 'No reason provided'}
                  </p>
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-right">
        <p className="text-2xl font-bold">
          Total: ₹{orderDetails.total.toFixed(2)}
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
                if (editingItem.item.status === 'cancelled') {
                  updates.cancellationReason = editingItem.item.cancellationReason;
                }
                handleUpdateItem(editingItem.orderId, editingItem.item._id, updates);
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
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingItem.item.status === 'cancelled' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="cancellationReason" className="text-right">Cancel Reason</label>
                    <Textarea
                      id="cancellationReason"
                      value={editingItem.item.cancellationReason || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, cancellationReason: e.target.value }
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