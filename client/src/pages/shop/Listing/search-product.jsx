import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Sleek Laptop",
    category: "Electronics",
    price: 999.99,
    description: "High-performance laptop with the latest features.",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: 2,
    name: "Cozy Sweater",
    category: "Clothing",
    price: 59.99,
    description: "Warm and comfortable sweater for cold days.",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 129.99,
    description: "True wireless earbuds with noise cancellation.",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: 4,
    name: "Stylish Watch",
    category: "Accessories",
    price: 199.99,
    description: "Elegant watch suitable for any occasion.",
    image: "/placeholder.svg?height=200&width=200"
  },
  {
    id: 5,
    name: "Yoga Mat",
    category: "Sports",
    price: 29.99,
    description: "High-quality yoga mat for your daily practice.",
    image: "/placeholder.svg?height=200&width=200"
  }
];

export default function SearchProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  return (
    <div className="container mx-auto lg:p-10 ">
      <h1 className="text-2xl font-bold mb-4 lg:px-5">Search Products</h1>
      <div className="mb-4 lg:px-5">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1  lg:px-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-4 md:justify-items-center">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="w-full md:max-w-[430px]">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="mb-2 rounded-md"
              />
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="font-semibold">Category: {product.category}</p>
            </CardContent>
            <CardFooter>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
