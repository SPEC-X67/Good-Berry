import {
  LayoutDashboard,
  Package,
  Users,
  Star,
  Settings,
  Ticket,
  Image,
  ChartNoAxesCombined,
  Tags,
  BaggageClaim,
  ScrollText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useState } from "react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <BaggageClaim />,
  },
  {
    id: "categorys",
    label: "Categorys",
    path: "/admin/categorys",
    icon: <Tags />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <Package />,
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <Users />,
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    icon: <Star />,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: <Settings />,
  },
  {
    id: "sales-report",
    label: "Sales Report",
    path: "/admin/sales-report",
    icon: <ScrollText />,
  },
  {
    id: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
    icon: <Ticket />,
  },
  {
    id: "banner",
    label: "Banner",
    path: "/admin/banner",
    icon: <Image />,
  },
];

const MenuItems = ({ setOpen }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();
  return (
    <nav className="mt-8 pt-1 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            setActiveItem(menuItem.id);
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className={`flex cursor-pointer text-sm items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-800 ${
            activeItem === menuItem.id ? "bg-gray-100 text-gray-800 font-medium" : ""
          }`}
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
};

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside
        className="admin-sidebar hidden w-64 flex-col border-r bg-background p-6 lg:flex fixed"
        style={{
          top: 0,
          left: 0,
          backgroundColor: "#ffffff", // or any other color you prefer
          zIndex: 1000, // or a higher value if needed
        }}
      >
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </>
  );
}

export default AdminSideBar;
