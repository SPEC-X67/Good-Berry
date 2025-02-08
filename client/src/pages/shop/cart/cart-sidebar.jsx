import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/shop-slice/cart-slice";
import { checkQuantity } from "@/store/shop-slice/cart-slice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CartSidebar = ({ isCartOpen, setIsCartOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, quantityLoading } = useSelector((state) => state.cart);
  const { toast } = useToast();
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isCartOpen) {
      setAnimationClass("cart-enter");
    } else {
      setAnimationClass("cart-exit");
    }
  }, [isCartOpen]);

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

    if (isCartOpen && items.length > 0) {
      fetchAllQuantities();
    }
  }, [isCartOpen, items, dispatch]);

  const getAvailableQuantity = (item) => {
    return (
      availableQuantities[
        `${item.productId}-${item.packageSize}-${item.flavor}`
      ] || 0
    );
  };

  const handleQuantityChange = async (item, action) => {
    const currentQuantity = item.quantity;
    const newQuantity =
      action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    const availableQuantity = getAvailableQuantity(item);

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
          itemId: item.productId,
          packageSize: item.packageSize,
          flavor: item.flavor,
          quantity: newQuantity,
        })
      ).unwrap();

      const result = await dispatch(
        checkQuantity({
          productId: item.productId,
          packageSize: item.packageSize,
          flavor: item.flavor,
        })
      ).unwrap();

      setAvailableQuantities((prev) => ({
        ...prev,
        [`${item.productId}-${item.packageSize}-${item.flavor}`]:
          result.quantity,
      }));
    } catch (error) {
      toast({
        title: "Error " + error,
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
    if (items.length === 1) {
      setIsCartOpen(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount =
      subtotal -
      items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    return {
      subtotal,
      discount: discount,
      total: subtotal - discount,
    };
  };

  // if (quantityLoading) {
  //   return (
  //     <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
  //       <SheetContent
  //         side="right"
  //         className={`w-full sm:max-w-sm transition-all ${animationClass}`}
  //       >
  //         <div className="flex items-center justify-center h-full">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8CC63F]"></div>
  //         </div>
  //       </SheetContent>
  //     </Sheet>
  //   );
  // }

  const { subtotal, discount, total } = calculateTotals();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-sm transition-all ${animationClass} flex flex-col`}
      >
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-grow mt-8">
          {items.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.packageSize}-${item.flavor}`}
                  className="flex flex-col space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-20 w-20 rounded-md border bg-white p-2">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.src = "/fallback-image.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleRemoveItem(
                              item.productId,
                              item.packageSize,
                              item.flavor
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.flavor}{" "}
                        {item.packageSize && `- ${item.packageSize}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-[#8CC63F]">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item, "decrease")
                            }
                            disabled={item.quantity <= 1 || quantityLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 flex items-center justify-center">
                            {quantityLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item, "increase")
                            }
                            disabled={
                              item.quantity >= getAvailableQuantity(item) ||
                              item.quantity >= 5 ||
                              quantityLoading
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Your cart is empty
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="mt-auto">
          <div className="grid w-full gap-4">
            {items.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            )}
            {items.length > 0 && (
              <Button
                className="w-full bg-[#8CC63F] hover:bg-[#7AB32F]"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/shop/cart");
                }}
              >
                Complete Your Purchase
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsCartOpen(false);
                navigate("/shop");
              }}
            >
              {items.length > 0 ? "Continue Shopping" : "Start Shopping"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

CartSidebar.propTypes = {
  isCartOpen: PropTypes.bool.isRequired,
  setIsCartOpen: PropTypes.func.isRequired,
};

export default CartSidebar;
