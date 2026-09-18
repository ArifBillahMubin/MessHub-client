import { Link } from "react-router";
import {
    MapPin,
    Mail,
    Phone,
    ArrowUpRight,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

import logo from "../../../assets/logo/logo.png";

const Footer = () => {
    const quickLinks = [
        { name: "Find a Mess", path: "/find-mess" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Pricing", path: "/pricing" },
        { name: "About Us", path: "/about" },
    ];

    const legalLinks = [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Community Guidelines", path: "/community-guidelines" },
        { name: "Bazar & Meal Policy", path: "/bazar-meal-policy" },
    ];

    return (
        <footer className="w-full border-t border-primary/10 bg-white">
            <div className="w-full px-5 py-10 sm:px-8 lg:px-10 xl:px-12">

                {/* Main Footer */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="mb-4 inline-flex items-center "
                            aria-label="MessHub Home"
                        >
                            <img
                                src={logo}
                                alt="MessHub"
                                className="h-13 w-auto object-contain"
                            />
                        </Link>

                        <p className="mb-3 text-base font-bold text-tertiary">
                            Better Meals, Happier Together
                        </p>

                        <p className="max-w-md text-base leading-7 text-neutral/90">
                            Less mess life without the hassle. Manage meals,
                            bazar, expenses, and community living in Bangladesh.
                        </p>

                        {/* Bangladesh Service Badge */}
                        <div className="mt-5 flex max-w-md items-center gap-2 rounded-full bg-background px-4 py-2.5 text-xs font-semibold leading-relaxed text-primary">
                            <MapPin
                                size={16}
                                className="shrink-0"
                            />

                            <span>
                                Proudly serving bachelors in Dhaka, Chattogram,
                                Sylhet, Rajshahi & nationwide
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-base font-bold text-neutral">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-[15px] font-medium text-neutral/80 transition-colors duration-200 hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community & Legal */}
                    <div>
                        <h3 className="mb-4 text-base font-bold text-neutral">
                            Community & Legal
                        </h3>

                        <ul className="space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-[15px] font-medium text-neutral/80 transition-colors duration-200 hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Contact */}
                        <div className="mt-6 space-y-3">
                            <a
                                href="mailto:support@messhub.com"
                                className="flex items-center gap-2 text-sm font-medium text-neutral/80 transition-colors duration-200 hover:text-primary"
                            >
                                <Mail size={15} />
                                support@messhub.com
                            </a>

                            <a
                                href="tel:+8801XXXXXXXXX"
                                className="flex items-center gap-2 text-sm font-medium text-neutral/80 transition-colors duration-200 hover:text-primary"
                            >
                                <Phone size={15} />
                                +880 1XXX-XXXXXX
                            </a>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="mb-4 text-base font-bold text-neutral">
                            Connect With Us
                        </h3>

                        <p className="mb-5 max-w-sm text-base leading-7 text-neutral/80">
                            Stay connected with MessHub and get the latest
                            updates, tips, and community news.
                        </p>

                        <div className="flex items-center gap-3">

                            {/* Facebook */}
                            <a
                                href="#"
                                aria-label="MessHub Facebook"
                                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                            >
                                <FaFacebookF
                                    size={16}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                            {/* Instagram */}
                            <a
                                href="#"
                                aria-label="MessHub Instagram"
                                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                            >
                                <FaInstagram
                                    size={17}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="#"
                                aria-label="MessHub LinkedIn"
                                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                            >
                                <FaLinkedinIn
                                    size={16}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                            {/* X */}
                            <a
                                href="#"
                                aria-label="MessHub X"
                                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                            >
                                <FaXTwitter
                                    size={15}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </a>

                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-8 flex flex-col gap-4 border-t border-neutral/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm font-medium text-neutral/70">
                        © {new Date().getFullYear()} MessHub. All rights reserved.
                    </p>

                    <Link
                        to="/find-mess"
                        className="group inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors duration-200 hover:text-primary"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />

                        Live across Bangladesh

                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;