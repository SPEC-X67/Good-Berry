import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";
import AdminBreadcrumbs from "./bread-crumbs";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className=" flex min-h-screen w-full">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar}  />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="admin-layout flex flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
        <AdminBreadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
