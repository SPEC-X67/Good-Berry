import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ProductSlider({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group pb-10"> {/* Moved group class here */}
      <div ref={emblaRef}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {products?.map((product, i) => (
            <Link to={`shop/product/${product._id}`} key={i}>
            <div
              className="flex flex-col items-center group cursor-pointer hover:scale-105 rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-[#ffffff]"
            >
              <div className="relative mb-4 w-full aspect-square">
                <img
                  src={product.firstVariant.images}
                  alt="Decorative leaf"
                  className="mx-auto h-full object-cover w-full"
                />
              </div>
              <h3 className="text-sm font-medium mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>
              <p className="text-sm font-medium text-[#8CC63F] mb-3">
                ${product.firstVariant.salePrice}
              </p>
            </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="slider-controls">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
