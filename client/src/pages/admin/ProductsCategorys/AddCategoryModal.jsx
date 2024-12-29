import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { addCategory } from "@/store/admin-slice";

const AddCategoryModal = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); // Control dialog open/close
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("Active");
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (categoryName.trim() === "") {
      toast({
        title: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newCategory = { name: categoryName, status: categoryStatus };

    try {
      const data = await dispatch(addCategory(newCategory)).unwrap();

      console.log("Hello", data)
      if (data.success) {
        toast({ title: data.message });
        setCategoryName("");
        setCategoryStatus("Active");
        setIsOpen(false); // Close dialog on success
      } else {
        toast({
          title: data.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: err,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Enter the details for the new category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            aria-label="Category Name"
          />
          <div className="flex items-center space-x-2">
            <label htmlFor="category-status">Status:</label>
            <Select
              value={categoryStatus}
              onValueChange={(value) => setCategoryStatus(value)}
              id="category-status"
            >
              <SelectTrigger className="w-full px-4 py-2 border rounded">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
