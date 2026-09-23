import { Outlet } from "react-router";
import Navbar from "../../Pages/Shared/Navbar/Navbar";
import Footer from "../../Pages/Shared/Footer/Footer";
import VisitorChatbot from "../../chatbot";

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
            <VisitorChatbot />
        </div>
    );
};

export default RootLayout;