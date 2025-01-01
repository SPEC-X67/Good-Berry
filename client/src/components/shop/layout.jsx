import { Outlet } from "react-router-dom";
import ShopHeader from "../../components/shop/header";
import { Footer } from "./footer";

function ShopLayout() {
    return (
        <>
            <ShopHeader/>
            <main className="flex flex-col w-full">
            <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default ShopLayout;