import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { RiMenu4Line } from "react-icons/ri";
import { Link } from "@inertiajs/react";

const Header = ({ auth }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const role = auth?.user?.role; // adjust based on how you send user data

    // Determine correct dashboard route name
    const dashboardRoute = (() => {
        switch (role) {
            case "super_admin":
                return "super_admin.dashboard";
            case "admin":
                return "admin.dashboard";
            case "cdrrmo_admin":
                return "cdrrmo_admin.dashboard";
            case "barangay_officer":
                return "barangay_officer.dashboard";
            case "resident":
                return "resident_account.certificates";
            default:
                return "welcome"; // fallback
        }
    })();

    return (
        <header
            className="fixed top-0 left-0 w-full flex justify-between items-center text-[#093a7b] py-2 px-8 md:px-32
            bg-white/10 backdrop-blur-md border border-white/20 shadow-md z-50"
        >
            {/* Logo */}
            <div className="relative flex items-center gap-3">
                <a href="#">
                    <img
                        src="/images/city-of-ilagan.png"
                        alt="iBMIS"
                        className="w-12 hover:scale-110 transition-all"
                    />
                </a>
                <h1 className="text-[#004aad] font-montserrat text-xl font-black">
                    iBIMS
                </h1>
            </div>

            {/* Desktop Login/Register / Dashboard */}
            <div className="hidden xl:flex relative items-center justify-center gap-3">
                {auth.user ? (
                    <Link
                        href={route(dashboardRoute)}
                        className="py-2 px-4 border border-blue-500 text-blue-500 font-md rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center cursor-pointer"
                    >
                        Dashboard <ChevronRight className="ml-2 text-lg" />
                    </Link>
                ) : (
                    <div className="flex gap-3">
                        <Link
                            href={route("login")}
                            className="py-2 px-4 border border-blue-500 text-blue-500 font-md rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center cursor-pointer"
                        >
                            Log In <ChevronRight className="ml-1 text-lg" />
                        </Link>
                        {/* <Link
                            href={route("register")}
                            className="py-2 px-4 text-blue-500 font-md rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center cursor-pointer"
                        >
                            Register
                        </Link> */}
                        <Link className="py-2 px-4 text-blue-500 font-md rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center cursor-pointer">
                            Issue a Cetificate
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div
                className="xl:hidden text-4xl cursor-pointer"
                onClick={handleClick}
            >
                <RiMenu4Line />
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <ul className="absolute top-16 right-8 bg-white shadow-lg p-4 rounded-lg flex flex-col gap-4 text-blue-500">
                    {auth.user ? (
                        <li>
                            <Link
                                href={route(dashboardRoute)}
                                className="hover:text-blue-700"
                            >
                                Dashboard
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    href={route("login")}
                                    className="hover:text-blue-700"
                                >
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("register")}
                                    className="hover:text-green-700"
                                >
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </header>
    );
};

export default Header;
