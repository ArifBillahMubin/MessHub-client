import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children:[
            {
                index: true,
                element:<Home></Home>
            }
        ]
    },
    {
        path:"/",
        element:<AuthLayout></AuthLayout>,
        children:[
            {
                path:"login",
                element:<Login></Login>
            },
            {
                path:"register",
                element:<Register></Register>
            }
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
]);