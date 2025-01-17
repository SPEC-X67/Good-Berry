import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { getProducts } from '@/store/shop-slice';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;

export default function SearchProduct() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    start: 0,
    end: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentPage, sortOption]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(getProducts({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortOption,
        search: searchTerm
      })).unwrap();

      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4 lg:p-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Search Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="new-arrivals">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card key={product._id} className="flex flex-col h-full">
                <CardContent className="flex-grow cursor-pointer" onClick={ () => navigate(`/shop/product/${product._id}`)}>
                  <div className="aspect-square relative my-4">
                    <img
                      src={product.firstVariant?.images || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover w-full h-full rounded-md"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                        New
                      </span>
                    )}
                  </div>
                  <p className='font-semibold'>{product.name}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-lg font-bold">
                    ${product.firstVariant?.salePrice.toFixed(2)}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === pagination.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}