import { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getAllCategories } from "@/store/admin-slice";

export default function AddProduct() {
  const dispatch = useDispatch();
 useEffect(() => {
     dispatch(getAllCategories());
   }, [dispatch]);

  const { categories } = useSelector((state) => state.admin);
  const nCategories = categories.map((category) => category.name);

  const [selectedImages, setSelectedImages] = useState([]);
  const [flavors, setFlavors] = useState(["Choco", "Vanilla", "Strawberry"]);
  const [packSizes, setPackSizes] = useState(["300ml", "500ml", "850ml"]);
  const [newItemType, setNewItemType] = useState("flavor");
  const [newItemValue, setNewItemValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleImageUpload = (e) => {
    setSelectedImages(Array.from(e.target.files));
};

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewItem = () => {
    if (!newItemValue) return;
    switch (newItemType) {
      case "flavor":
        setFlavors((prev) => [...prev, newItemValue]);
        break;
      case "packSize":
        setPackSizes((prev) => [...prev, newItemValue]);
        break;
    }
    setNewItemValue("");
  };

  const removeItem = (item, itemType) => {
    switch (itemType) {
      case "flavor":
        setFlavors((prev) => prev.filter((flavor) => flavor !== item));
        break;
      case "packSize":
        setPackSizes((prev) => prev.filter((size) => size !== item));
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("title").value);
    formData.append("sku", document.getElementById("sku").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("quantity").value);
    formData.append("category", selectedCategory);
    formData.append("description", document.getElementById("description").value);
    formData.append("packSizes", JSON.stringify(packSizes)); // Array to JSON
    formData.append("flavors", JSON.stringify(flavors)); // Array to JSON
    
    selectedImages.forEach(file => {
      formData.append('images', file); // Ensure the key matches the server-side
  });
    console.log(selectedImages)
    try {
        const result = await dispatch(addProduct(formData)).unwrap();
        if (result.success) {
            alert('Product added successfully');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error submitting product:', error);
    }
};

  

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-md">
        <div className="p-6 sm:rounded-lg">
          <h1 className="text-xl font-semibold mb-6">Add Product</h1>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Regular Price</Label>
                <Input id="price" type="number" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="quantity">Available quantity</Label>
                <Input id="quantity" type="number" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {nCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" className="mt-1" rows={4} />
            </div>

            <div>
              <Label>Images</Label>
              <div className="mt-1">
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="images"
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 mt-2 outline-1 outline-dashed outline-offset-4 outline-gray-300 rounded-md p-2"
                  >
                    <Upload className="w-5 h-5" />
                    Choose product images
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover border rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Flavors</Label>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 16v-4M12 8h.01"
                    />
                  </svg>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewItemType("flavor")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Flavor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add New{" "}
                        {newItemType.charAt(0).toUpperCase() +
                          newItemType.slice(1)}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder={`Enter new ${newItemType}`}
                      />
                      <Button onClick={addNewItem}>Add</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {flavors.map((flavor) => (
                  <span
                    key={flavor}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100"
                  >
                    {flavor}
                    <button
                      onClick={() => removeItem(flavor, "flavor")}
                      aria-label={`Remove ${flavor} flavor`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Pack Sizes</Label>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 16v-4M12 8h.01"
                    />
                  </svg>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewItemType("packSize")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Size
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add New{" "}
                        {newItemType.charAt(0).toUpperCase() +
                          newItemType.slice(1)}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder={`Enter new ${newItemType}`}
                      />
                      <Button onClick={addNewItem}>Add</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {packSizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100"
                  >
                    {size}
                    <button
                      onClick={() => removeItem(size, "packSize")}
                      aria-label={`Remove ${size} pack size`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={(e) => handleSubmit(e)}>
                Save Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
