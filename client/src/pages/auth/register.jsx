import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
};

// function AuthRegister() {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState(initialState);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   function onSubmit(event) {
//     event.preventDefault(); // Prevent form reload
//     dispatch(registerUser(formData)).then((data) => {
//       console.log(data);
//       if (data?.payload?.success) {
//         toast({
//           title: data?.payload?.message,
//         });
//         navigate("/auth/login");
//       } else {
//         toast({
//           title: data?.payload?.message
//         });
//       }
//     });
//   }

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Create new account
//         </h1>
//         <p className="mt-2">
//           Already have an account?
//           <Link
//             className="font-medium ml-2 text-primary hover:underline"
//             to="/auth/login"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//       {/* Pass `formData` to CommonForm */}
//       <CommonForm
//         formControls={registerFormControls}
//         formData={formData} // Ensure formData is passed
//         setFormData={setFormData}
//         onSubmit={onSubmit}
//         buttonText={"Sign up"}
//       />
//     </div>
//   );
// }

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
  
    function onSubmit(event) {
      event.preventDefault();
      dispatch(registerUser(formData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      });
    }
  
    console.log(formData);
  
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create new account
          </h1>
          <p className="mt-2">
            Already have an account
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

export default AuthRegister;
