import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderById, cancelOrderItem, returnOrderItem } from "@/store/shop-slice/order-slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CreditCard,
  Package,
  RefreshCcw,
  Truck,
  ShoppingBag,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";
import axios from "axios";

const OrderStatusBadge = ({ status, icon }) => (
  <Badge variant={status === "cancelled" ? "destructive" : "outline"} className="mt-2">
    {icon}
    <span className="ml-1">{status}</span>
  </Badge>
);


const CancellationDialog = ({ onCancel, cancelReason, setCancelReason, item }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" size="sm">
        Cancel Item
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Cancel Order Item</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to cancel {item.name} ({item.packageSize}
          {item.flavor && `, ${item.flavor}`})? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Reason for Cancellation</h4>
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-md"
            placeholder="Please provide a reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Item</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onCancel(item._id)}
          disabled={!cancelReason.trim()}
        >
          Cancel Item
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ReturnDialog = ({ onReturn, returnReason, setReturnReason, item }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" size="sm">
        Return Item
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Return Order Item</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to return {item.name} ({item.packageSize}
          {item.flavor && `, ${item.flavor}`})? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Reason for Return</h4>
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-md"
            placeholder="Please provide a reason for return..."
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Item</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onReturn(item._id)}
          disabled={!returnReason.trim()}
        >
          Return Item
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const OrderItem = ({ item, onCancel, cancelReason, setCancelReason, onReturn, returnReason, setReturnReason, navigate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <RefreshCcw className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "failed":
        return <Info className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div 
        className="relative cursor-pointer group"
        onClick={() => navigate(`/shop/product/${item.productId}`)}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-md transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-md transition-opacity" />
      </div>
      
      <div className="flex-grow">
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/shop/product/${item.productId}`)}
        >
          <h3 className="font-semibold text-lg">
            {item.name}
            {item.flavor && <span className="text-gray-600"> - {item.flavor}</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Size: {item.packageSize}</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm">Quantity: {item.quantity}</p>
            <p className="text-sm font-medium">
              Price: <span className="text-[#92c949]">₹{(item.price * item.quantity).toFixed(2)}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <OrderStatusBadge 
            status={item.status} 
            icon={getStatusIcon(item.status)} 
          />
          {item.status === "cancelled" && (
            <p className="text-sm text-red-500 italic">
              {item.cancellationReason}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-[100px]">
        {item.status === "processing" && (
          <CancellationDialog
            onCancel={onCancel}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            item={item}
          />
        )}
        {item.status === "shipped" && (
          <CancellationDialog
            onCancel={onCancel}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            item={item}
          />
        )}
        {item.status === "delivered" && (
          <ReturnDialog
            onReturn={onReturn}
            returnReason={returnReason}
            setReturnReason={setReturnReason}
            item={item}
          />
        )}
      </div>
    </div>
  );
};

const OrderSummary = ({ order }) => (
  <div className="grid gap-6 md:grid-cols-2 mt-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>₹{order.subtotal?.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span>₹{order.shippingCost?.toFixed(2)}</span>
        </p>
        {order.couponDiscount > 0 && (
          <p className="flex justify-between text-[#92c949]">
            <span>Coupon:</span>
            <span>-₹{order.couponDiscount?.toFixed(2)}</span>
          </p>
        )}
        {order.discount > 0 && (
          <p className="flex justify-between text-[#92c949]">
            <span>Discount:</span>
            <span>-₹{order.discount?.toFixed(2)}</span>
          </p>
        )}
        <Separator className="my-2" />
        <p className="flex justify-between font-semibold">
          <span>Total:</span>
          <span className="text-[#92c949]">₹{order.total?.toFixed(2)}</span>
        </p>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
      <div className="space-y-2">
        <p className="font-medium">{order.addressId?.name}</p>
        <p className="text-gray-600">{order.addressId?.street}</p>
        <p className="text-gray-600">
          {order.addressId?.city}, {order.addressId?.state} {order.addressId?.zip}
        </p>
        <p className="text-gray-600">{order.addressId?.country}</p>
      </div>
    </div>
  </div>
);

export default function OrderView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { order, isLoading, error } = useSelector((state) => state.order);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async (itemId) => {
    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(cancelOrderItem({ 
        orderId: id, 
        itemId, 
        reason: cancelReason 
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Item has been cancelled successfully",
      });
      setCancelReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel item",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (itemId) => {
    if (!returnReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for return",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(returnOrderItem({ 
        orderId: id, 
        itemId, 
        reason: returnReason 
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Item has been return requsted successfully",
      });
      setReturnReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to return item",
        variant: "destructive",
      });
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handleRepay = async () => {
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        toast({
          title: 'Razorpay SDK failed to load',
          variant: 'destructive',
        });
        return;
      }

      const razorpayOrder = await axios.post('http://localhost:5000/api/user/create-razorpay-order', {
        orderId: order._id
      }, {
        withCredentials: true
      });

      const options = {
        key: 'rzp_test_CS2mGJMpuRbxFh', // Your Razorpay key
        amount: razorpayOrder.data.amount,
        currency: razorpayOrder.data.currency,
        name: "Good Berry",
        description: `Order ${order.orderId}`,
        order_id: razorpayOrder.data.orderId,
        handler: async function (response) {
          try {
            const { data } = await axios.post('http://localhost:5000/api/user/verify-payment', {
              orderCreationId: razorpayOrder.data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderData: order
            }, {
              withCredentials: true
            });

            toast({
              title: 'Payment successful',
              description: `Order ID: ${data.orderId}`,
            });
            dispatch(fetchOrderById(id)); 
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast({
              title: 'Payment verification failed',
              description: error.response?.data?.message || 'Please contact support',
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await axios.post('http://localhost:5000/api/user/payment-failure', {
                orderId: order._id
              }, {
                withCredentials: true
              });
              toast({
                title: 'Payment cancelled',
                description: 'Your payment was cancelled. Please try again.',
                variant: 'destructive',
              });
            } catch (error) {
              console.error("Error handling payment failure:", error);
              toast({
                title: 'Error handling payment failure',
                description: error.message || 'Please contact support',
                variant: 'destructive',
              });
            }
          }
        },
        prefill: {
          name: order.addressId?.name,
          email: "", 
          contact: order.addressId?.mobile,
        },
        notes: {
          address: "Good Berry Store Order"
        },
        theme: {
          color: "#8AB446"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      toast({
        title: 'Error initiating payment',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>Error loading order: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <p>Order not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:my-8 max-w-7xl">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                Order <span className="text-[#92c949]">#{order.orderId}</span>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            {order.status === 'failed' ? (
                <Button 
                  variant="outline" 
                  onClick={handleRepay}
                >
                  Repay
                </Button>
              ) : (<OrderStatusBadge 
                status={order.status} 
                icon={<Package className="h-4 w-4" />} 
              />)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <OrderItem
                key={item._id}
                item={item}
                onCancel={handleCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                onReturn={handleReturn}
                returnReason={returnReason}
                setReturnReason={setReturnReason}
                navigate={navigate}
              />
            ))}
          </div>

          <Separator />
          
          <OrderSummary order={order} />

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Payment Information
              </h3>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <p className="text-gray-600">
                  {order.paymentMethod === "cod" && "Cash on Delivery"}
                  {order.paymentMethod === "card" && "Credit Card"}
                  {order.paymentMethod === "upi" && "UPI Payment"}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Payment Status: <span className="font-medium">{order.paymentStatus}</span>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                If you have any questions about your order, please contact our
                customer support at <span className="font-medium">+91 96566 33324</span> or{" "}
                <span className="font-medium">goodberry@support.com</span>
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <p className="text-sm text-gray-600 pt-4">
            Thank you for shopping with us! We appreciate your business.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}


OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

CancellationDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  cancelReason: PropTypes.string.isRequired,
  setCancelReason: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageSize: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

ReturnDialog.propTypes = {
  onReturn: PropTypes.func.isRequired,
  returnReason: PropTypes.string.isRequired,
  setReturnReason: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    packageSize: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    packageSize: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    cancellationReason: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelReason: PropTypes.string.isRequired,
  setCancelReason: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  returnReason: PropTypes.string.isRequired,
  setReturnReason: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

OrderSummary.propTypes = {
  order: PropTypes.shape({
    subtotal: PropTypes.number,
    shippingCost: PropTypes.number,
    discount: PropTypes.number,
    couponDiscount: PropTypes.number,
    total: PropTypes.number.isRequired,
    addressId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

OrderView.propTypes = {
  id: PropTypes.string,
};
