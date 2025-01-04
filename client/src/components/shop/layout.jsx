import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./footer";
import ShopHeader from "./header-shop";
import HomeHeader from "./header";
import Breadcrumbs from "../common/bread-crumbs";

function ShopLayout() {
    const location = useLocation();
    return (
        <>
            {location.pathname === "/" ? <HomeHeader/> : <ShopHeader/>}
            <main className={`flex flex-col w-full ${location.pathname === "/" ? "" : "shop-header"}`}>
            {(location.pathname.includes("shop") || location.pathname.includes("account")) && <Breadcrumbs />}
            <Outlet />
            </main>
            <Footer/>
        </>
    );
}

export default ShopLayout;