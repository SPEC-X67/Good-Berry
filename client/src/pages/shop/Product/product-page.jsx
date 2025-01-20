import { Check, Copy, Heart, Maximize, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useParams } from "react-router-dom";
import ProductDetails from "./product-details";
import RelatedProducts from "./related-products";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "@/store/shop-slice";
import ZoomImage from "@/components/ui/zoom-image";
import { Skeleton } from "@/components/ui/skeleton";
import CartSidebar from "../cart/cart-sidebar";
import { addToCart } from "@/store/shop-slice/cart-slice";
import { addToWishlist } from "@/store/shop-slice";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  const { product, pflavors, recomentedProds } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);
  
  const flavors = pflavors || {};

  // Get available flavor keys
  const flavorKeys = Object.keys(flavors);

  const [selectedFlavor, setSelectedFlavor] = useState(flavorKeys[0] || "");

  const [selectedImage, setSelectedImage] = useState(
    flavorKeys.length > 0 ? flavors[selectedFlavor]?.images?.[0] : ""
  );

  const [quantity, setQuantity] = useState(1);
  const [packageSize, setPackageSize] = useState(
    flavorKeys.length > 0 &&
      flavors[selectedFlavor] &&
      flavors[selectedFlavor].packageSizes
      ? flavors[selectedFlavor].packageSizes[0]
      : ""
  );

  const [currentPrice, setCurrentPrice] = useState({
    price: 0,
    salePrice: 0,
  });

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const flavor = flavorKeys.length > 0 ? flavors[selectedFlavor] : null;

  const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const calculateStockStatus = (flavor, packageSize) => {
    if (!flavor || !flavor.packSizePricing) return { status: "OUT STOCK", color: "text-red-600 border-red-600" };
    const pack = flavor.packSizePricing.find(p => p.size === packageSize);
    if (pack && pack.quantity > 0) {
      if (pack.quantity < 20) {
        return { status: `Limited Stock (${pack.quantity})`, color: "text-yellow-600 border-yellow-600" };
      }
      return { status: "IN STOCK", color: "text-[#8CC63F] border-[#8CC63F]" };
    }
    return { status: "OUT STOCK", color: "text-red-600 border-red-600" };
  };

  useEffect(() => {
    if (flavorKeys.length > 0 && !selectedFlavor) {
      setSelectedFlavor(flavorKeys[0]);
      setSelectedImage(flavors[flavorKeys[0]].images[0]);
      setPackageSize(flavors[flavorKeys[0]].packageSizes[0]);

      const initialPricing = flavors[flavorKeys[0]].packSizePricing.find(
        (p) => p.size === flavors[flavorKeys[0]].packageSizes[0]
      );
      setCurrentPrice({
        price: initialPricing?.price || 0,
        salePrice: initialPricing?.salePrice || 0,
      });
    }
  }, [pflavors]);

  const handleFlavorChange = (value) => {
    setSelectedFlavor(value);
    setSelectedImage(flavors[value]?.images[0]);
    const newPackageSize = flavors[value]?.packageSizes[0];
    setPackageSize(newPackageSize);

    const newPricing = flavors[value]?.packSizePricing.find(
      (p) => p.size === newPackageSize
    );
    setCurrentPrice({
      price: newPricing?.price || 0,
      salePrice: newPricing?.salePrice || 0,
    });
  };

  const handlePackageSizeChange = (size) => {
    setPackageSize(size);
    const newPricing = flavor?.packSizePricing.find((p) => p.size === size);
    setCurrentPrice({
      price: newPricing?.price || 0,
      salePrice: newPricing?.salePrice || 0,
    });
  };

  const handleAddToCart = async() => {
    if (stockStatus.status === "OUT STOCK") return;
    setIsAddingToCart(true);
    const cartItem = {
      ...(user && { userId: user._id }),
      productId: product._id,
      name: product.name,
      flavor: flavor.title,
      packageSize,
      quantity,
      price: currentPrice.price,
      salePrice: currentPrice.salePrice,
      image: selectedImage
    };
    
    try {
      await dispatch(addToCart(cartItem));
      setIsAddingToCart(false);
      setAddedToCart(true);
      setIsCartOpen(true);
    
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product._id));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Link copied to clipboard!",
      });
      setShareDialogOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link. Please try again." + err,
      });
    }
  };

  if (!flavor) {
    return (
      <div className="flex flex-row space-x-3 flex justify-center items-center p-10 mt-10">
        <div className="flex flex-row gap-4">
          <Skeleton className="h-[450px] w-[450px] rounded-xl" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <Skeleton className="h-[90px] w-[100px]" />
              <Skeleton className="h-[90px] w-[100px]" />
              <Skeleton className="h-[90px] w-[100px]" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-3 h-[150px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = calculateDiscount(
    currentPrice.price,
    currentPrice.salePrice
  );

  const stockStatus = calculateStockStatus(flavor, packageSize);

  return (
    <div className="container product-page mx-auto px-4 py-6 lg:py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground font-semibold">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-foreground font-semibold">
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 md:grid-cols-2">
        {/* Product Images */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Main Image */}
          <div
            className="relative flex-1 order-1 lg:order-2"
            style={{ maxHeight: "350px" }}
          >
            <div
              className="relative aspect-square overflow-hidden rounded-lg border bg-white"
              style={{ maxWidth: "500px" }}
            >
              <ZoomImage
                src={selectedImage}
                className="object-contain p-4 w-full h-full"
              />
              <div
                className="absolute top-0 right-0 flex items-center justify-center mt-5 mr-5 rounded-full bg-[#83ac2b]"
                style={{ width: "50px", height: "50px" }}
              >
                <span className="text-base text-white">
                  -{discountPercentage}%
                </span>
              </div>
              <button
                className="absolute bottom-4 right-4 rounded-lg bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                onClick={() => {
                  console.log("View in full screen");
                }}
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-5 order-2 lg:order-1">
            {flavor.images.map((image, i) => (
              <button
                key={i}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 rounded-lg border bg-white",
                  selectedImage === image && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${flavor.title} thumbnail ${i + 1}`}
                  className="object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-medium">{product.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {flavor.title.toUpperCase()} STYLE FLAVER
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-[#8CC63F]">
              ₹{currentPrice.salePrice?.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{currentPrice.price?.toFixed(2)}
            </span>
            <span className={`ml-4 text-sm ${stockStatus.color} border px-3 py-1 rounded-full`}>
              {stockStatus.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{flavor.description}</p>

          <div className="space-y-4">
            <div>
              <Select
                value={selectedFlavor}
                onValueChange={(value) => handleFlavorChange(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flavorKeys.map((flavorKey) => (
                    <SelectItem key={flavorKey} value={flavorKey}>
                      {flavors[flavorKey].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium">Package size :</div>
              <div className="flex gap-4">
                {flavor.packageSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePackageSizeChange(size)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition-colors",
                      packageSize === size
                        ? "border-[#8CC63F] bg-[#8CC63F]/10 text-[#8CC63F]"
                        : "hover:bg-muted"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  className="px-3 py-2 hover:bg-muted"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  className="px-3 py-2 hover:bg-muted"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (flavor?.packSizePricing.find(p => p.size === packageSize)?.quantity || 0)}
                >
                  +
                </button>
              </div>
              <Button 
                className="bg-[#8CC63F] px-8 hover:bg-[#7AB32F]"
                onClick={handleAddToCart}
                disabled={isAddingToCart || addedToCart || stockStatus.status === "OUT STOCK"}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Adding...
                  </div>
                ) : addedToCart ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Added!
                  </div>
                ) : (
                  "ADD TO CART"
                )}
              </Button>
            </div>

            <Button 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
              Add to wishlist
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < 4
                        ? "fill-[#8CC63F] text-[#8CC63F]"
                        : "fill-muted text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (1K+ customer review)
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Category:</span>
              <Link
                href="/category/ice-cream"
                className="text-muted-foreground hover:text-foreground"
              >
                Ice Cream
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Share product</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <p className="text-sm text-muted-foreground">
                Copy the link below to share this product
              </p>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <span className="text-sm text-muted-foreground line-clamp-1">
                  {window.location.href}
                </span>
              </div>
            </div>
          </div>
          <Button type="button" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>

      <ProductDetails description={product.description} />
      <RelatedProducts products={recomentedProds} id={product._id} />

      <CartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>

    </div>
  );
}
