import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, unlistProduct } from '@/store/admin-slice';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch all products on component mount
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  console.log(products)

  // Calculate filtered fields using useMemo
  const filteredFields = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    
    return products
      .filter((product) => product.category.status == 'Active')
      .map((product) => {
        const totalStock = Array.isArray(product.variants)
          ? product.variants.reduce((acc, variant) => acc + (Number(variant.availableQuantity) || 0), 0)
          : 0;
          
        return {
          id: product._id,
          image: product.variants?.[0]?.images?.[0] || '',
          name: product.name || '',
          salePrice: product.variants?.[0]?.packSizePricing?.[0]?.salePrice || 0,
          variants: Array.isArray(product.variants) ? product.variants.length : 0,
          stock: totalStock,
          category: product.category.name || '',
          status: product.unListed ? 'Unlisted' : 'Listed',
        };
      });
  }, [products]);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return filteredFields;
    
    const term = searchTerm.toLowerCase();
    return filteredFields.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.salePrice.toString().includes(term) ||
        (typeof product.category === 'string' && product.category.toLowerCase().includes(term))
    );
  }, [searchTerm, filteredFields]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleUnlist = async(id) => {
    const data = await dispatch(unlistProduct(id));

    if (data.payload.success) {
       toast({
          title: data.payload.message,
        });
    } else {
      toast({
        title: data.payload.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 pr-4 py-2 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={20} />
              </Button>
              <Button onClick={() => navigate('/admin/products/add')}>
                Add Product
              </Button>
            </div>
          </div>
        </div>
        <div
          className="border rounded-lg mx-4 mb-4"
          style={{ height: '400px', overflowY: 'auto' }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>List/Unlist</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg border p-1"
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5">₹{product.salePrice}</TableCell>
                  <TableCell className="px-5">{product.variants}</TableCell>
                  <TableCell className="px-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      product.stock < 1 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="px-5">{product.category}</TableCell>
                  <TableCell className="pl-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      product.status === 'Unlisted' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)} >Edit</DropdownMenuItem>
                        <DropdownMenuItem className={`${product.status === 'Unlisted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`} onClick={() => handleUnlist(product.id)}>
                          {product.status === 'Unlisted' ? 'List' : 'Unlist'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}