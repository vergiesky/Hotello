import { Outlet } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";

export default function MainLayout () {
    return(
        <>
            <HeaderNavbar />
            <Outlet />
        </>
    )
}