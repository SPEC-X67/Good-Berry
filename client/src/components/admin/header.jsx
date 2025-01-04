import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header
      className=" top-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-b fixed"
      style={{ top: 0, left: 0, right: 0, backgroundColor: "#ffffff", zIndex: 999, }}
    >
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium outline outline-1"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
