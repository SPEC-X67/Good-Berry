import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {MoreHorizontal, Search, Filter } from 'lucide-react'

const productsData = [
  {
    id: 1,
    image: "/placeholder.svg",
    name: "Snow Icetys oo",
    sku: "47514501",
    price: "₹75.00",
    stock: "In Stock",
    category: "Ice Cream",
  },
  {
    id: 2,
    image: "/placeholder.svg",
    name: "Classic Monochrome",
    sku: "47514501",
    price: "₹35.00",
    stock: "In Stock",
    category: "Juice",
  },
  // Add more product data here...
];

const categories = [
  { id: 1, name: "Ice Cream", status: "Active" },
  { id: 2, name: "Juice", status: "Inactive" },
  // Add more category data here...
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(productsData)
  const [filteredCategories, setFilteredCategories] = useState(categories)

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    
    const filteredProds = productsData.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.sku.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
    setFilteredProducts(filteredProds)

    const filteredCats = categories.filter(category =>
      category.name.toLowerCase().includes(term)
    )
    setFilteredCategories(filteredCats)
  }

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              <Button>
                Add Product
              </Button>
            </div>
          </div>
        </div>
        <div className="border rounded-lg mx-4 mb-4" style={{ height: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
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
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Button>
              New Category
            </Button>
          </div>
        </div>
        <div className="border rounded-lg mx-4 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>List/Unlist</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Switch checked={category.status === "Active"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
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

