import { MoreHorizontal, Edit, Trash } from "lucide-react";

const ProductTable = () => {
  const products = [
    {
      id: 1,
      name: "Susop fotyo oo",
      sku: "47514501",
      price: "₹75.00",
      stock: "In Stock",
      category: "Ice Cream",
    },
    {
      id: 2,
      name: "Classic Monochrome",
      sku: "47514501",
      price: "₹35.00",
      stock: "In Stock",
      category: "Juice",
    },
    // Add more sample data
  ];

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search products"
          className="p-2 border rounded-md w-1/3"
        />
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Add Product
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Category</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.sku}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">{product.category}</td>
              <td className="p-2 flex items-center gap-2">
                <button className="text-blue-500">
                  <Edit size={16} />
                </button>
                <button className="text-red-500">
                  <Trash size={16} />
                </button>
                <button className="text-gray-500">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
