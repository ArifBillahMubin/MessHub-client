import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AboutLayout from "../layouts/AboutLayout/AboutLayout";
import About from "../Pages/About/About/About";
import Mission from "../Pages/About/Mission/Mission";
import Vision from "../Pages/About/Vision/Vision";
import Team from "../Pages/About/Team/Team";
import PrivateRoute from "./privateRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import DashboardOverview from "../Pages/Dashboard/DashboardOverview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },

    //Auth layout
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { 
                path: "login",
                element: <Login />    
            },
            { 
                path: "register", 
                element: <Register /> 
            },
        ],
    },

    //About Layout
    {
        path: "/about",
        element: <AboutLayout />,
        children: [
            { 
                index: true,
                element: <About />   
            },
            { 
                path: "mission",
                element: <Mission /> 
            },
            { 
                path: "vision",
                element: <Vision />  
            },
            { 
                path: "team",
                element: <Team />    
            },
        ],
    },

    //dashboard

    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardOverview />
            }
           
            
        ]
    },

    {
        path: "*",
        element: <ErrorPage />,
    },
]);