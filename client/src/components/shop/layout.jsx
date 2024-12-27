import { Outlet } from "react-router-dom";
import ShopHeader from "../../components/shop/header";

function ShopLayout() {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <ShopHeader/>
            <main className="flex flex-col w-full">
            <Outlet />
            </main>
        </div>
    );
}

export default ShopLayout;