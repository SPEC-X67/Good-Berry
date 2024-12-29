import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { updateCategory } from "@/store/admin-slice";
import PropTypes from "prop-types";

const EditCategoryModal = ({ category, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(category?.name || "");
  const [status, setStatus] = useState(category?.status || "");
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name.trim() === "") {
      toast({
        title: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await dispatch(updateCategory({ id: category._id, name: name.trim(), status })).unwrap();

      if (data.success) {
        toast({ title: data.message });
        onClose(); // Close modal after successful update
      } else {
        toast({
          title: data.message || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: err.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details for the category below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Category Name"
          />
          <div className="flex items-center space-x-2">
            <label htmlFor="category-status">Status:</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditCategoryModal.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditCategoryModal;
