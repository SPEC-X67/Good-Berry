import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "@/store/admin-slice";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCategoryModal from "./EditCategoryModal";
import AddCategoryModal from "./AddCategoryModal";
import { toast } from "@/hooks/use-toast";

function Categorys() {
  const { categories } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null); // Track the category for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control edit modal visibility

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const data = await dispatch(deleteCategory(id));
    console.log(data.payload);
    if (data.payload.success) {
      toast({ title: data.payload.message });
    } else {
      toast({
        title: data.payload.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <AddCategoryModal />
        </div>
      </div>
      <div
        className="border rounded-lg mx-4 mb-4"
        style={{ height: "450px", overflowY: "auto" }}
      >
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
            {categories.map((category, index) => (
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          handleEditClick(category);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(category._id)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Render the EditCategoryModal dynamically */}
      {isEditModalOpen && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => setIsEditModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
}

export default Categorys;
