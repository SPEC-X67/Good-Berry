import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderById, cancelOrderItem } from "@/store/shop-slice/order-slice";
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

export default function OrderView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading, error } = useSelector((state) => state.order);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = (productId) => {
    dispatch(cancelOrderItem({ orderId: id, productId, reason: cancelReason }))
      .unwrap()
      .then(() => {
        toast({
          title: "Item Cancelled",
          description: "The item has been successfully cancelled."
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message
        });
      });
  };

  const handleReturn = (productId) => {
    console.log("Return item:", productId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <RefreshCcw className="h-4 w-4 text-[#92c949]" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-[#92c949]" />;
      case "Delivered":
        return <Package className="h-4 w-4 text-[#92c949]" />;
      case "Cancelled":
      case "Returned":
        return <AlertCircle className="h-4 w-4 text-[#92c949]" />;
      default:
        return <AlertCircle className="h-4 w-4 text-[#92c949]" />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  let paymentMethodName = "";

  if(order.paymentMethod === "cod"){
    paymentMethodName = "Cash on Delivery";
  } else if(order.paymentMethod === "card"){
    paymentMethodName = "Credit Card";
  } else if(order.paymentMethod === "upi"){
    paymentMethodName = "Payed with UPI";
  } 

  return (
    <div className="container mx-auto px-4 py-8 lg:my-8 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Order <span className="text-[#92c949]">#{order.orderId}</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p className="text-sm text-muted-foreground">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold mt-2">
                Total: <span className="text-[#92c949]">${order.total.toFixed(2)}</span>
              </p>
              <Badge variant="outline" className="mt-2">
                {getStatusIcon(order.status)}
                <span className="ml-1">Order Status: {order.status}</span>
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm">{order.addressId.name}</p>
              <p className="text-sm">{order.addressId.street}</p>
              <p className="text-sm">
                {order.addressId.city},{" "}
                {order.addressId.state}{" "}
                {order.addressId.zip}
              </p>
              <p className="text-sm">{order.addressId.country}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-6">
            {order.items.map((product) => (
              <div
                key={product._id}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md"
                  onClick={() => navigate(`/shop/product/${product.productId}`)}
                />
                <div className="flex-grow" onClick={() => navigate(`/shop/product/${product.productId}`)}>
                  <h3 className="font-semibold">{product.name} - <span> {product.packageSize}</span></h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {product.quantity} | Price: <span className="text-[#92c949] font-semibold">$
                    {product.price.toFixed(2)}</span>
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{product.status}</span>
                  </Badge>
                    {product.status === "cancelled" && <p className="mt-1 text-xs text-red-400">{product.cancellationReason}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  {product.status === "processing" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to cancel this item?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            cancel your order for this item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <input
                          type="text"
                          placeholder="Reason for cancellation"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="mt-2 p-2 border rounded"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(product._id)}
                          >
                            Yes, cancel it
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {product.status === "delivered" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Return
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to return this item?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will initiate the return process for this item.
                            Please make sure you have the item in its original
                            condition.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReturn(product._id)}
                          >
                            Yes, return it
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Payment Information
              </h3>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                 <p className="text-sm">
                  {paymentMethodName}
                  </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about your order, please contact our
                customer support at +91 96566 33324 or goodberry@support.com.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Thank you for shopping with us! We appreciate your business.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
