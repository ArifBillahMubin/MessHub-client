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
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

// Dashboard — shared index
import DashboardOverview from "../Pages/Dashboard/DashboardOverview";

// Member pages
import MyMess from "../Pages/Dashboard/Member/MyMess";
import CreateMessForm from "../Pages/Dashboard/Member/CreateMessForm";
import Meals from "../Pages/Dashboard/Member/Monthly/Meals";
import Bazar from "../Pages/Dashboard/Member/Monthly/Bazar";
import Expenses from "../Pages/Dashboard/Member/Monthly/Expenses";
import MyCalculation from "../Pages/Dashboard/Member/Monthly/MyCalculation";
import MemberPayments from "../Pages/Dashboard/Member/Monthly/Payments";
import Settlement from "../Pages/Dashboard/Member/Monthly/Settlement";
import MonthlyReports from "../Pages/Dashboard/Member/Monthly/MonthlyReports";

// Shared dashboard pages (used by both member and manager)
import Members from "../Pages/Dashboard/Shared/Members";
import MessChat from "../Pages/Dashboard/Shared/MessChat";
import Announcements from "../Pages/Dashboard/Shared/Announcements";
import Polls from "../Pages/Dashboard/Shared/Polls";
import Notifications from "../Pages/Dashboard/Shared/Notifications";
import ProfileSettings from "../Pages/Dashboard/Shared/ProfileSettings";

// Manager pages
import MessMembers from "../Pages/Dashboard/Manager/Mess/MessMembers";
import JoinRequests from "../Pages/Dashboard/Manager/Mess/JoinRequests";
import PublicMessPost from "../Pages/Dashboard/Manager/Mess/PublicMessPost";
import MessSettings from "../Pages/Dashboard/Manager/Mess/MessSettings";
import CurrentMonth from "../Pages/Dashboard/Manager/Monthly/CurrentMonth";
import Calculations from "../Pages/Dashboard/Manager/Monthly/Calculations";
import ServicePlan from "../Pages/Dashboard/Manager/ServicePlan";
import Settings from "../Pages/Dashboard/Manager/Settings";

// Admin pages
import AdminUsers from "../Pages/Dashboard/Admin/AdminUsers";
import AdminMesses from "../Pages/Dashboard/Admin/AdminMesses";
import AdminManagers from "../Pages/Dashboard/Admin/AdminManagers";
import PostModeration from "../Pages/Dashboard/Admin/PostModeration";
import Reports from "../Pages/Dashboard/Admin/Reports";
import AuditLogs from "../Pages/Dashboard/Admin/AuditLogs";
import Analytics from "../Pages/Dashboard/Admin/Analytics";
import Plans from "../Pages/Dashboard/Admin/Pricing/Plans";
import Subscriptions from "../Pages/Dashboard/Admin/Pricing/Subscriptions";
import CustomRequests from "../Pages/Dashboard/Admin/Pricing/CustomRequests";
import ContactRequests from "../Pages/Dashboard/Admin/ContactRequests";
import ChatModeration from "../Pages/Dashboard/Admin/ChatModeration";
import AdminNotifications from "../Pages/Dashboard/Admin/AdminNotifications";
import AdminSettings from "../Pages/Dashboard/Admin/AdminSettings";
import HowItWorks from "../Pages/HowItWorks/HowItWorks/HowItWorks";
import Pricing from "../Pages/Pricing/Pricing";

export const router = createBrowserRouter([
    //Root Layout
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { 
                index: true, 
                element: <Home /> 
            },
            { 
                path: 'how-it-works', 
                element: <HowItWorks></HowItWorks>
            },
            {
                path: "pricing",
                element: <Pricing />,
            },
        ],
    },

    //  Auth layout 
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { 
                path: "login",    
                element: <Login /> },
            { 
                path: "register",
                element: <Register /> 
            },
        ],
    },

    //  About layout 
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
                element: <Vision /> },
            { 
                path: "team",     
                element: <Team /> 
            },
        ],
    },

    //  Member / Manager dashboard  (/dashboard) 
    // DashboardOverview handles the hasMess split internally.
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            // index — smart overview (MessSetup or Member/Manager overview)
            { index: true, element: <DashboardOverview /> },

            //  Member routes 
            { 
                path: "my-mess",        
                element: <MyMess /> 
            },
            {
                path: "create-mess",
                element: <CreateMessForm />
            },

            // Monthly portal group
            { 
                path: "monthly/meals",
                element: <Meals /> 
            },
            {
                path: "monthly/bazar",
                element: <Bazar /> 
            },
            {
                path: "monthly/expenses",
                element: <Expenses />
            },
            { 
                path: "monthly/calculation",
                element: <MyCalculation />
            },
            { 
                path: "monthly/payments",
                element: <MemberPayments /> 
            },
            { 
                path: "monthly/settlement",
                element: <Settlement />
            },
            { 
                path: "monthly/reports",
                element: <MonthlyReports />
            },

            // Manager — monthly (extra routes reusing same path prefix)
            { 
                path: "monthly/current",
                element: <CurrentMonth /> 
            },
            { 
                path: "monthly/calculations",
                element: <Calculations /> 
            },

            //  Shared routes (member + manager) 
            { 
                path: "members",
                element: <Members />
            },
            { 
                path: "chat",
                element: <MessChat />
            },
            { 
                path: "announcements",
                element: <Announcements />
            },
            { 
                path: "polls",
                element: <Polls /> 
            },
            { 
                path: "notifications",
                element: <Notifications />
            },
            { 
                path: "profile", 
                element: <ProfileSettings />
            },

            //  Manager-only routes 
            { 
                path: "mess/members",
                element: <MessMembers /> 
            },
            {
                path: "mess/join-requests",
                element: <JoinRequests /> 
            },
            { 
                path: "mess/public-post",
                element: <PublicMessPost /> },
            { 
                path: "mess/settings",
                element: <MessSettings /> 
            },
            { 
                path: "service-plan", 
                element: <ServicePlan /> 
            },
            { 
                path: "settings",
                element: <Settings /> 
            },
        ],
    },

    //  Super Admin dashboard  (/admin) 
    {
        path: "/admin",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            { 
                index: true,
                element: <DashboardOverview /> 
            },
            { 
                path: "users",
                element: <AdminUsers /> },
            { 
                path: "messes",
                element: <AdminMesses /> 
            },
            { 
                path: "managers",
                element: <AdminManagers /> 
            },
            { 
                path: "public-posts/moderation",
                element: <PostModeration /> 
            },
            { 
                path: "reports",
                element: <Reports /> 
            },
            { 
                path: "audit-logs",
                element: <AuditLogs /> 
            },
            { 
                path: "analytics",
                element: <Analytics />
            },
            { 
                path: "pricing",
                element: <Plans /> 
            },
            { 
                path: "subscriptions",
                element: <Subscriptions /> 
            },
            { 
                path: "custom-requests",
                element: <CustomRequests /> 
            },
            { 
                path: "contact-requests",
                element: <ContactRequests /> 
            },
            { 
                path: "moderation",
                element: <ChatModeration /> 
            },
            { 
                path: "notifications", 
                element: <AdminNotifications /> },
            { 
                path: "settings",
                element: <AdminSettings /> 
            },
        ],
    },

    //  404 
    { path: "*", element: <ErrorPage /> },
]);
