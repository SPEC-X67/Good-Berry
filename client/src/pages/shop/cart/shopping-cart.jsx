import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  checkQuantity,
} from "@/store/shop-slice/cart-slice";
import { applyCoupon, checkCoupon } from "@/store/shop-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CouponList from "./coupon-list";

export default function ShoppingCart() {
  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { coupon } = useSelector((state) => state.shop);
  const { items } = useSelector(
    (state) => state.cart
  );

  const couponDiscount = coupon?.discount || 0;

  const clearCoupon = () => {
    setCouponCode("");
    dispatch({ type: "shop/applyCoupon/fulfilled", payload: {} });
  };

  useEffect(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item?.price * item?.quantity,
      0
    );
    const discount =
      newSubtotal -
      items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    setDiscount(discount);
    setSubtotal(newSubtotal);

    const subtotalAfterDiscount = newSubtotal - discount;
    setTotalAfterDiscount(subtotalAfterDiscount);
    setTotal(subtotalAfterDiscount - (coupon?.discount || 0));

    if (coupon?.discount && subtotalAfterDiscount < 1000) {
      clearCoupon();
      toast({
        title: "Coupon Removed",
        description:
          "Cart total after discount is below the minimum required amount.",
        variant: "destructive",
      });
    }
  }, [items, discount, coupon]);

  useEffect(() => {
    if (couponCode && !coupon.discount) {
      dispatch(checkCoupon({ code: couponCode, total: totalAfterDiscount }));
    }
  }, [dispatch, couponCode, totalAfterDiscount]);

  useEffect(() => {
    const fetchAllQuantities = async () => {
      const quantities = {};
      for (const item of items) {
        try {
          const result = await dispatch(
            checkQuantity({
              productId: item.productId,
              packageSize: item.packageSize,
              flavor: item.flavor,
            })
          ).unwrap();
          quantities[`${item.productId}-${item.packageSize}-${item.flavor}`] =
            result.quantity;
        } catch (error) {
          console.error("Error fetching quantity:", error);
        }
      }
      setAvailableQuantities(quantities);
    };

    if (items.length > 0) {
      fetchAllQuantities();
    }
  }, [items, dispatch]);

  const getAvailableQuantity = (item) => {
    return (
      availableQuantities[
        `${item.productId}-${item.packageSize}-${item.flavor}`
      ] || 0
    );
  };

  const handleQuantityChange = async (
    productId,
    currentQuantity,
    packageSize,
    flavor,
    action
  ) => {
    const newQuantity =
      action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    const availableQuantity = getAvailableQuantity({
      productId,
      packageSize,
      flavor,
    });

    if (newQuantity <= 0) return;

    if (newQuantity > 5) {
      toast({
        title: "Quantity Limit Reached",
        description: "You can only add a maximum of 5 items to the cart.",
      });
      return;
    }

    if (newQuantity > availableQuantity) {
      toast({
        title: "Quantity Limit Reached",
        description: `Only ${availableQuantity} items are available in stock.`,
      });
      return;
    }

    try {
      await dispatch(
        updateCartItemQuantity({
          itemId: productId,
          packageSize,
          flavor,
          quantity: newQuantity,
        })
      ).unwrap();

      const result = await dispatch(
        checkQuantity({
          productId,
          packageSize,
          flavor,
        })
      ).unwrap();

      setAvailableQuantities((prev) => ({
        ...prev,
        [`${productId}-${packageSize}-${flavor}`]: result.quantity,
      }));
    } catch (err) {
      toast({
        title: "Error" + err,
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (productId, packageSize, flavor) => {
    await dispatch(
      removeFromCart({
        itemId: productId,
        packageSize,
        flavor,
      })
    );
    const remainingItems = items.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.packageSize === packageSize &&
          item.flavor === flavor
        )
    );
    const newSubtotal = remainingItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newDiscount =
      newSubtotal -
      remainingItems.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
      );
    const newTotalAfterDiscount = newSubtotal - newDiscount;

    if (remainingItems.length === 0 || newTotalAfterDiscount < 1000) {
      clearCoupon();
      if (newTotalAfterDiscount < 1000 && remainingItems.length > 0) {
        toast({
          title: "Coupon Removed",
          description:
            "Cart total after discount is below the minimum required amount.",
          variant: "destructive",
        });
      }
    }
  };

  const handleApplyCoupon = async (code = couponCode) => {
    try {
      const response = await dispatch(
        applyCoupon({ code, total: totalAfterDiscount })
      ).unwrap();
      if (response.success) {
        toast({
          title: `Coupon applied successfully`,
          description: response.message,
        });
        setCouponCode(code);
      } else {
        toast({
          title: `Error applying coupon`,
          description: response.message,
          variant: "destructive",
        });
        setCouponCode("");
      }
    } catch (error) {
      toast({
        title: `Error applying coupon`,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 md:px-12">
      <h2 className="text-xl font-medium my-2 md:px-8 px-4">Your cart</h2>

      <div className="flex flex-wrap gap-4 md:p-8 p-4">
        <div className="space-y-4 sm:w-full lg:w-2/3">
          {items.length === 0 ? (
            <p className="italic text-muted-foreground">No items in cart</p>
          ) : (
            items.map((item) => (
              <Card
                key={item.productId}
                className="w-full border-none border-b"
              >
                <CardContent className="flex flex-wrap items-center justify-between p-4 cursor-pointer">
                  <div
                    className="flex items-center gap-4"
                    onClick={() => navigate(`/shop/product/${item.productId}`)}
                  >
                    <img
                      src={item?.image || "/placeholder.svg"}
                      alt={item?.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div
                      onClick={() =>
                        navigate(`/shop/product/${item.productId}`)
                      }
                    >
                      <h3 className="font-medium">{item?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item?.flavor} - {item.packageSize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center rounded-md border">
                      <button
                        className="px-3 py-2 hover:bg-muted"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity,
                            item.packageSize,
                            item.flavor,
                            "decrease"
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item?.quantity}</span>
                      <button
                        className="px-3 py-2 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity,
                            item.packageSize,
                            item.flavor,
                            "increase"
                          )
                        }
                        disabled={
                          item.quantity >= getAvailableQuantity(item) ||
                          item.quantity >= 5
                        }
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-medium text-[#8CC63F]">
                      ₹{item?.price.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.packageSize,
                          item.flavor
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="sm:w-full lg:w-[400px]">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Do you have any coupon?{" "}
                <CouponList onSelectCoupon={setCouponCode} />
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  disabled={coupon.discount}
                />
                <Button
                  variant="outline"
                  className="text-[#8AB446]"
                  onClick={() => handleApplyCoupon()}
                  disabled={!couponCode || coupon.discount}
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-₹{discount?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Total after discount</span>
                <span>₹{totalAfterDiscount?.toFixed(2)}</span>
              </div>

              {coupon.discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Coupon</span>
                  <span>-₹{couponDiscount?.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-4 border-t">
                <span>Total</span>
                <span>₹{total?.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-[#8AB446] hover:bg-[#8AB446]/90"
              onClick={() => navigate("/shop/cart/checkout")}
              disabled={items.length === 0}
            >
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
