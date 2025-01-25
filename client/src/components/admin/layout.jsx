import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";
import AdminBreadcrumbs from "./bread-crumbs";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full relative">
      {/* admin sidebar */}
      <div className="z-10 lg:flex">
        <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      </div>
      <div className="flex-1 flex flex-col z-0">
        {/* admin header */}
        <div className="z-10">
          <AdminHeader setOpen={setOpenSidebar} />
        </div>
        <main className="admin-layout flex flex-1 flex-col flex bg-muted/40 p-4 md:p-6 z-0">
          <AdminBreadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
