import PropTypes from "prop-types";
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

const AddCategoryModal = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("Active");

  const handleAddCategory = () => {
    if (categoryName.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }

    const newCategory = {
      name: categoryName,
      status: categoryStatus,
    };

    onAddCategory(newCategory);
    setCategoryName("");
    setCategoryStatus("Active");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Category</Button>
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
          />
          <div className="flex items-center space-x-2">
            <label>Status:</label>
            <Select
              value={categoryStatus}
              onValueChange={(value) => setCategoryStatus(value)}
            >
              <SelectTrigger className="border h-100 w-100 px-5 py-5 rounded px-2 py-1">
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

AddCategoryModal.propTypes = {
  onAddCategory: PropTypes.func.isRequired,
};

export default AddCategoryModal;
