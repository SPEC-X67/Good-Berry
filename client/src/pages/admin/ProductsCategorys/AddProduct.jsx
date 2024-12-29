import CommonForm from "@/components/common/form";
import { addProductFormControls } from "@/config";
import { useState } from "react";

const initialState = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: null,
};

function AddProduct() {
  const [formData, setFormData] = useState(initialState);

  function onSubmit(event) {
    event.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-center">Add Product</h1>
      <CommonForm
        formControls={addProductFormControls}
        buttonText={"Add Product"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AddProduct;