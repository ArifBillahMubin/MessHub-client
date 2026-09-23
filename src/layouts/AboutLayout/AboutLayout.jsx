import { NavLink, Outlet } from "react-router";
import Navbar from "../../Pages/Shared/Navbar/Navbar";
import Footer from "../../Pages/Shared/Footer/Footer";
import VisitorChatbot from "../../components/VisitorChatbot/VisitorChatbot";

const tabs = [
    { label: "Story",   to: "/about",         end: true  },
    { label: "Mission", to: "/about/mission",  end: false },
    { label: "Vision",  to: "/about/vision",   end: false },
    { label: "Team",    to: "/about/team",     end: false },
];

const AboutLayout = () => (
    <div className="min-h-screen bg-background">
        <Navbar />

        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* White rounded container */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_40px_rgba(23,59,58,0.10)]">

                    {/* ── Common hero ── */}
                    <div className="border-b border-gray-100 px-8 py-5 text-center sm:px-12 lg:px-16">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.20em] text-primary">
                            About MessHub
                        </span>

                        <h1 className="mt-4 max-w-2xl mx-auto text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl md:text-5xl">
                            Making Shared Living Simpler
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl  leading-[1.8] text-gray-700">
                            MessHub is built to make shared living, mess management, monthly
                            expenses, and communication simpler for students, bachelors, and
                            job holders across Bangladesh.
                        </p>
                    </div>

                    {/* ── Tab navigation ── */}
                    <div className="flex justify-center border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
                            {tabs.map(({ label, to, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `whitespace-nowrap rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? "bg-primary text-white shadow-sm"
                                                : "text-gray-500 hover:text-primary"
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* ── Dynamic page content ── */}
                    <Outlet />

                </div>
            </div>
        </div>

        <Footer />
        <VisitorChatbot />
    </div>
);

export default AboutLayout;
