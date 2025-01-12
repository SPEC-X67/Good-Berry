import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, MapPin, ShoppingCart, Wallet, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import OrderSuccess from "./success-order";

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState("address");
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [summary, setSummary] = useState({
    subtotal: 2347,
    coupon: 50,
    shipping: 0,
    total: 2347,
  });

  const shippingMethods = [
    {
      id: "free",
      name: "Regular shipment",
      description: "Free delivery",
      date: "17 Oct, 2023",
      price: 0,
    },
    {
      id: "express",
      name: "Express delivery",
      description: "Get your delivery as soon as possible",
      date: "1 Oct, 2023",
      price: 29,
    },
    {
      id: "scheduled",
      name: "Scheduled delivery",
      description: "Pick a date when you want to get your delivery",
      date: "Select Date →",
      price: 15,
    },
  ];

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      street: "2118 Thornridge Cir",
      city: "Syracuse",
      state: "Connecticut",
      zip: "35624",
      country: "United States",
      name: "Thornridge",
      type: "HOME",
      mobile: "9656633324",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddress = {
      id: isEditing || Date.now().toString(),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      country: formData.get("country"),
      name: formData.get("name"),
      type: formData.get("type"),
      mobile: formData.get("mobile"),
    };

    if (isEditing) {
      setAddresses(
        addresses.map((addr) => (addr.id === isEditing ? newAddress : addr))
      );
      setIsEditing(null);
    } else {
      setAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setIsEditing(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const editingAddress = isEditing
    ? addresses.find((addr) => addr.id === isEditing)
    : null;

  const getSelectedAddress = () => {
    return addresses.find((addr) => addr.id === selectedAddress);
  };

  const getSelectedShipping = () => {
    return shippingMethods.find((method) => method.id === selectedShipping);
  };

  useEffect(() => {
    const shippingMethod = getSelectedShipping();
    const shippingPrice = shippingMethod?.price || 0;
    setSummary((prev) => ({
      ...prev,
      shipping: shippingPrice,
      total: prev.subtotal - prev.coupon + shippingPrice,
    }));
  }, [selectedShipping]);

  const handleNext = () => {
    if (activeStep === "address") setActiveStep("shipping");
    else if (activeStep === "shipping") setActiveStep("payment");
  };

  const handleBack = () => {
    if (activeStep === "shipping") setActiveStep("address");
    else if (activeStep === "payment") setActiveStep("shipping");
  };

  const handlePay = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true); // Show success message
    }, 500); // Simulate delay
  };

  if (paymentSuccess) {
    // Render success message
    return <OrderSuccess />;
  }


  const selectedAddressDetails = getSelectedAddress();
  const selectedShippingDetails = getSelectedShipping();

  return (
    <div className="container mx-auto py-10">
      <Tabs
        value={activeStep}
        className="w-full max-w-6xl mx-auto bg-transparent"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent">
          <TabsTrigger
            value="address"
            className="data-[state=active]:shadow-none"
          >
            <span className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep === "address"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Address</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:shadow-none"
          >
            <span className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep === "shipping"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:shadow-none"
          >
            <span className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeStep === "payment"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Wallet className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Payment</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="address">
          <div className="w-full space-y-6 p-5 flex justify-center">
            <Card className="lg:px-6 px-4 w-[900px]">
              <CardHeader className="px-0 flex-row justify-between items-center">
                <h2 className="text-lg font-medium">Shipping Address</h2>
                {!showForm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary-foreground"
                    onClick={() => {
                      setShowForm(true);
                      setIsEditing(null);
                    }}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="px-0">
                {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="text-gray-600">Street Address</Label>
                      <Input
                        name="street"
                        defaultValue={editingAddress?.street}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">City</Label>
                        <Input
                          name="city"
                          defaultValue={editingAddress?.city}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">State</Label>
                        <Input
                          name="state"
                          defaultValue={editingAddress?.state}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Zip Code</Label>
                        <Input
                          name="zip"
                          defaultValue={editingAddress?.zip}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Country</Label>
                        <Input
                          name="country"
                          defaultValue={editingAddress?.country}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <Input
                        name="name"
                        defaultValue={editingAddress?.name}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Type</Label>
                        <Input
                          name="type"
                          defaultValue={editingAddress?.type}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Mobile</Label>
                        <Input
                          name="mobile"
                          defaultValue={editingAddress?.mobile}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">
                        {isEditing ? "Update Address" : "Add Address"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowForm(false);
                          setIsEditing(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <RadioGroup
                    value={selectedAddress}
                    onValueChange={setSelectedAddress}
                    className="space-y-4"
                  >
                    {addresses.map((address) => (
                      <Card key={address.id} className="bg-gray-50 border-0">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={address.id}
                              id={address.id}
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {address.name}
                                </span>
                                <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                                  {address.type}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(address)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(address.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="flex justify-between py-4 px-0">
                <Button variant="outline" disabled>
                  Back
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="w-full space-y-6 p-5 flex justify-center">
            <Card className="lg:px-6 px-4 w-[900px]">
              <CardHeader className="px-0">
                <h2 className="text-lg font-medium">Select Shipping</h2>
              </CardHeader>
              <RadioGroup
                value={selectedShipping}
                onValueChange={setSelectedShipping}
                className="space-y-4"
              >
                {shippingMethods.map((method) => (
                  <Card key={method.id} className="bg-gray-50 border-0">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.name}</span>
                            <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                              {method.price > 0 ? `$${method.price}` : "Free"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {method.description}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>

              <CardFooter className="flex justify-between py-4 px-0">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="w-full space-y-6 p-5 flex justify-center">
            <Card className="lg:px-6 px-4 w-[900px]">
              <CardContent className="p-0 py-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedAddressDetails ? (
                            <>
                              {selectedAddressDetails.street},{" "}
                              {selectedAddressDetails.city},
                              {selectedAddressDetails.state}{" "}
                              {selectedAddressDetails.zip}
                            </>
                          ) : (
                            "No address selected"
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Shipment method
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedShippingDetails?.name ||
                            "No shipping method selected"}
                          {selectedShippingDetails?.price > 0 &&
                            ` - $${selectedShippingDetails.price}`}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${summary.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Coupon</span>
                          <span>-${summary.coupon}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping & Handling</span>
                          <span>${summary.shipping}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${summary.total}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                        className="space-y-4"
                      >
                        {[
                          { id: "cod", name: "Cash on Delivery" },
                          { id: "upi", name: "Pay with UPI" },
                          { id: "card", name: "Credit/Debit" },
                        ].map((payment) => (
                          <Card
                            key={payment.id}
                            className="bg-gray-50 border-0"
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem
                                  value={payment.id}
                                  id={payment.id}
                                />
                                <div className="flex flex-col">
                                  <div className="font-medium">
                                    {payment.name}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button variant="default" onClick={handlePay}>Pay</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
