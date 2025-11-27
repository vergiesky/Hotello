import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
// import AdminDashboard from "../pages/customer/AdminDashboard.jsx";
import Wishlist from "../pages/customer/Wishlist.jsx";

import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import PublicRoute from "../routes/PublicRoute.jsx";
import CustomerRoute from "../routes/CustomerRoute.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";

import MainLayout from "../layouts/MainLayout.jsx";

const router = createBrowserRouter ([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

        children: [
        // customer routes
        {
            path: "/dashboard",
            element: (
            <CustomerRoute>
                <CustomerDashboard />
            </CustomerRoute>
            ),
        },
        {
            path: "/wishlist",
            element: <Wishlist />,
        },

        // admin routes
        //   {
        //     path: "/admin/dashboard",
        //     element: (
        //       <AdminRoute>
        //         <AdminDashboard />
        //       </AdminRoute>
        //     ),
        //   },
        ],
  },
  {
      path: "*",
      element: <Navigate to="/login" replace />,
  },
]);

const AppRouter = () => {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
};

export default AppRouter;