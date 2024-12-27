import { Edit, Trash } from "lucide-react";

const CategoryTable = () => {
  const categories = [
    { id: 1, name: "Ice Cream", status: true },
    { id: 2, name: "Fruit Jam", status: false },
    // Add more sample data
  ];

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Add Category
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{category.name}</td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={category.status}
                  className="toggle-checkbox"
                  readOnly
                />
              </td>
              <td className="p-2 flex items-center gap-2">
                <button className="text-blue-500">
                  <Edit size={16} />
                </button>
                <button className="text-red-500">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
