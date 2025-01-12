import { useState } from "react";
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
import { logodark } from "@/assets/images";

const dummyOrder = {
  orderNumber: "ORD-12345",
  orderDate: "2023-06-15",
  orderTotal: 239.97,
  products: [
    {
      id: 1,
      name: "Wireless Noise-Cancelling Headphones",
      price: 149.99,
      quantity: 1,
      status: "Shipped",
      image: logodark,
    },
    {
      id: 2,
      name: "Smart Home Security Camera",
      price: 79.99,
      quantity: 1,
      status: "Processing",
      image: logodark,
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      quantity: 1,
      status: "Delivered",
      image: logodark,
    },
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
  },
  paymentInfo: {
    cardType: "Visa",
    lastFourDigits: "4321",
  },
  estimatedDelivery: "2023-06-22",
};

export default function OrderView() {
  const [orderProducts, setOrderProducts] = useState(dummyOrder.products);

  const handleCancel = (productId) => {
    setOrderProducts(
      orderProducts.map((product) =>
        product.id === productId ? { ...product, status: "Cancelled" } : product
      )
    );
  };

  const handleReturn = (productId) => {
    setOrderProducts(
      orderProducts.map((product) =>
        product.id === productId ? { ...product, status: "Returned" } : product
      )
    );
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

  const getOrderStatus = (products) => {
    if (products.every((product) => product.status === "Cancelled")) {
      return "Cancelled";
    } else if (
      products.every((product) =>
        ["Delivered", "Returned", "Cancelled"].includes(product.status)
      )
    ) {
      return "Delivered";
    } else if (products.some((product) => product.status === "Shipped")) {
      return "Shipped";
    } else {
      return "Processing";
    }
  };

  const orderStatus = getOrderStatus(orderProducts);

  return (
    <div className="container mx-auto px-4 py-8 lg:my-8 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Order <span className="text-[#92c949]">#{dummyOrder.orderNumber}</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p className="text-sm text-muted-foreground">
                Order Date: {dummyOrder.orderDate}
              </p>
              <p className="text-sm text-muted-foreground">
                Estimated Delivery: {dummyOrder.estimatedDelivery}
              </p>
              <p className="text-lg font-semibold mt-2">
                Total: <span className="text-[#92c949]">${dummyOrder.orderTotal.toFixed(2)}</span>
              </p>
              <Badge variant="outline" className="mt-2">
                {getStatusIcon(orderStatus)}
                <span className="ml-1">Order Status: {orderStatus}</span>
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm">{dummyOrder.shippingAddress.name}</p>
              <p className="text-sm">{dummyOrder.shippingAddress.street}</p>
              <p className="text-sm">
                {dummyOrder.shippingAddress.city},{" "}
                {dummyOrder.shippingAddress.state}{" "}
                {dummyOrder.shippingAddress.zip}
              </p>
              <p className="text-sm">{dummyOrder.shippingAddress.country}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-6">
            {orderProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {product.quantity} | Price: <span className="text-[#92c949] font-semibold">$
                    {product.price.toFixed(2)}</span>
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{product.status}</span>
                  </Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {product.status === "Processing" && (
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
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(product.id)}
                          >
                            Yes, cancel it
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {product.status === "Delivered" && (
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
                            onClick={() => handleReturn(product.id)}
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
                  {dummyOrder.paymentInfo.cardType} ending in{" "}
                  {dummyOrder.paymentInfo.lastFourDigits}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about your order, please contact our
                customer support at 1-800-123-4567 or support@example.com.
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
