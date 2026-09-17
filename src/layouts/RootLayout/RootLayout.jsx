import { Outlet } from "react-router";
import Navbar from "../../Pages/Shared/Navbar/Navbar";

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div>
                <Outlet></Outlet>
            </div>
            <h1>this is footer</h1>
        </div>
    );
};

export default RootLayout;