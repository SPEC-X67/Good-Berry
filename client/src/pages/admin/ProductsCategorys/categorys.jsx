import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "@/store/admin-slice";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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
import EditCategoryModal from "./edit-category";
import AddCategoryModal from "./add-category";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function Categorys() {
  const { categories,  totalPages, currentPage } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [itemsPerPage] = useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = useCallback(
      (page = 1) => {
        dispatch(
          getAllCategories({
            page,
            limit: itemsPerPage,
          })
        );
      },
      [dispatch, itemsPerPage]
    );

  const handlePageChange = (newPage) => {
    loadCategories(newPage);
  };

  useEffect(() => {
    loadCategories(1);
  }, [loadCategories]);


  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const data = await dispatch(deleteCategory(categoryToDelete._id));
    setIsDeleteDialogOpen(false);
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
    <div className="rounded-lg shadow-sm bg-white pb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <AddCategoryModal />
        </div>
      </div>
      <div
        className="border rounded-lg mx-4 mb-4"
        style={{ height: "450px" }}
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
                <TableCell>
                <div className="flex items-center gap-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg border p-1"
                      />
                      <span>{category.name}</span>
                </div>
                </TableCell>
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
                        onClick={() => handleDeleteClick(category)}
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
      {
        totalPages > 1 && (
          <div className="flex items-center justify-end mt-5 mr-4 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        )
      }

      {isEditModalOpen && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">Are you sure you want remove this category?</DialogTitle>
              <DialogDescription>
              This action cannot be undone. This will permanently remove your category for this item.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                No, keep it
              </Button>
              <Button onClick={confirmDelete}>
                Yes, remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Categorys;
