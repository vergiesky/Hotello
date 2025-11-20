import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
    {
        path:"*",
        element: <div>Halaman tidak ditemukan!</div>,
    },
    {
        path:"/dashboard",
        element: <Dashboard />
    },
    {
        path:"/",
        element: <LoginPage />
    },
]);

const AppRouter = () => {
    return (
        <>
            <Toaster position="top-center" richColors></Toaster>
            <RouterProvider router={router}></RouterProvider>
        </>
    )
};

export default AppRouter;