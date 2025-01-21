import { useEffect, useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PriceFilter,
  CategoryFilter,
  FlavorFilter,
  StatusFilter,
  MobileFilters,
} from "@/components/ui/filters";
import { cn } from "@/lib/utils";
import ProductCard from "./product-card";
import { FiGrid } from "react-icons/fi";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "@/store/shop-slice";

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Average Rating' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' }
];

export default function ShopPage() {
  const [view, setView] = useState("grid-4");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 8200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const dispatch = useDispatch();

  const { products, pagination, categories } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategories(categories.map(category => category._id));
    }
  }, [categories]);

  useEffect(() => {
    dispatch(getProducts({ 
      page: currentPage, 
      limit: 10, 
      sort,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categories: selectedCategories,
    }));
  }, [dispatch, currentPage, sort, selectedCategories]);

  const handlePriceFilter = () => {
    dispatch(getProducts({ 
      page: currentPage, 
      limit: 10, 
      sort, 
      search: '', 
      minPrice: priceRange[0], 
      maxPrice: priceRange[1],
      categories: selectedCategories,
    }));
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto  max-w-[1400px] px-4 lg:pt-16 md:pt-10 pt-4">
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 ">
            <div className="hidden lg:block space-y-8">
              <PriceFilter
                value={priceRange}
                onValueChange={setPriceRange}
                onFilter={handlePriceFilter}
              />
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={(categoryId) => {
                  setSelectedCategories((prev) =>
                    prev.includes(categoryId)
                      ? prev.filter((id) => id !== categoryId)
                      : [...prev, categoryId]
                  );
                }}
              />
              <FlavorFilter
                selectedFlavors={selectedFlavors}
                onFlavorChange={(flavorId) => {
                  setSelectedFlavors((prev) =>
                    prev.includes(flavorId)
                      ? prev.filter((id) => id !== flavorId)
                      : [...prev, flavorId]
                  );
                }}
              />
              <StatusFilter
                selectedStatuses={selectedStatuses}
                onStatusChange={(statusId) => {
                  setSelectedStatuses((prev) =>
                    prev.includes(statusId)
                      ? prev.filter((id) => id !== statusId)
                      : [...prev, statusId]
                  );
                }}
              />
            </div>

            {/* Products */}
            <div>
              {/* Toolbar */}
              <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MobileFilters
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedFlavors={selectedFlavors}
                    setSelectedFlavors={setSelectedFlavors}
                    selectedStatuses={selectedStatuses}
                    setSelectedStatuses={setSelectedStatuses}
                    handlePriceFilter={handlePriceFilter}
                  />
                  <Button
                    variant={view === "menu" ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => setView("menu")}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "grid-2" ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => setView("grid-2")}
                    className="grid place-items-center"
                  >
                    <FiGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "grid-3" ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => setView("grid-3")}
                    className="grid place-items-center"
                  >
                    <BiSolidGrid style={{ height: "20px", width: "20px" }} />
                  </Button>
                  <Button
                    variant={view === "grid-4" ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => setView("grid-4")}
                    className="grid place-items-center"
                  >
                    <TfiLayoutGrid4Alt
                      style={{ height: "16px", width: "16px" }}
                    />
                  </Button>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-gray-500">
                  Showing {pagination.start}-{pagination.end} of{" "}
                  {pagination.total} results
                </p>
              </div>

              {/* Product grid */}
              <div
                className={cn(
                  "grid gap-6 lg:pt-4 pt-2 lg:pl-4 pl-2",
                  view === "grid-4" &&
                    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                  view === "grid-3" &&
                    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                  view === "grid-2" && "grid-cols-1 sm:grid-cols-2",
                  view === "menu" && "grid-cols-1"
                )}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} id={product._id}/>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav
                  className="flex items-center gap-2"
                  aria-label="Pagination"
                >
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
