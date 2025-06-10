import { useState } from "react";
import { useLocation } from "react-router-dom"; // For accessing the current route
import {
    Home,
    Users,
    FileText,
    Search,
    Settings,
    FileCog,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Table,
    UsersRound,
    FileUser,
    Scale,
    FileStack,
    Warehouse,
    SquareUserRound,
    House,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

// Menu items with submenus
const items = [
    {
        title: "Dashboard",
        url: "/barangay_officer/dashboard", // URL for the Dashboard
        icon: Home,
        submenu: [],
    },
    {
        title: "Residents Information",
        url: "#",
        icon: FileUser,
        submenu: [
            {
                title: "Residents Table",
                url: "/barangay_officer/resident",
                icon: Table,
            },
            {
                title: "Senior Citizen",
                url: "/barangay_officer/senior_citizen",
                icon: UsersRound,
            },
            { title: "View Residents", url: "#", icon: SquareUserRound },
        ],
    },
    {
        title: "Household Information",
        url: "#",
        icon: House,
        submenu: [
            {
                title: "Households Table",
                url: "/barangay_officer/household",
                icon: Table,
            },
            {
                title: "View Residents",
                url: "#",
                icon: SquareUserRound,
            },
        ],
    },
    {
        title: "Documents",
        url: "#",
        icon: FileStack,
        submenu: [
            {
                title: "Barangay Certificates",
                url: "/barangay_officer/document",
                icon: FileText,
            },
            { title: "Request Certificate", url: "#", icon: FileText },
            { title: "View Certificates", url: "#", icon: FileText },
        ],
    },
    {
        title: "Blotter",
        url: "#",
        icon: Scale,
        submenu: [],
    },
    {
        title: "Inventory",
        url: "#",
        icon: Warehouse,
        submenu: [],
    },
];

export function AppSidebar({ auth }) {
    const location = useLocation(); // Get current location
    const [collapsed, setCollapsed] = useState({});

    const toggleCollapse = (index) => {
        setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const user = auth.user;

    return (
        <Sidebar>
            <SidebarContent className="bg-blue-500">
                <div className="text-center p-2 flex flex-col justify-center items-center">
                    <img
                        src="/images/csa-logo.png"
                        alt="CSA Logo"
                        className="h-20 w-20"
                    />
                    <p className="font-bold text-2xl text-white">
                        Barangay Information Management System
                    </p>
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-100">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() =>
                                                toggleCollapse(index)
                                            }
                                        >
                                            <a
                                                href={item.url}
                                                className={`flex items-center justify-between w-full my-1 ${
                                                    location.pathname ===
                                                    item.url
                                                        ? "bg-gray-200 text-primary" // Active item styles
                                                        : "text-white"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-2" />
                                                    <span>{item.title}</span>
                                                </div>
                                                {item.submenu.length > 0 && (
                                                    <span className="ml-2">
                                                        {collapsed[index] ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronUp className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {item.submenu.length > 0 && (
                                        <SidebarGroupContent
                                            className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                                                collapsed[index]
                                                    ? "max-h-0 opacity-0 translate-x-[-10px]"
                                                    : "max-h-[1000px] opacity-100 translate-x-0"
                                            }`}
                                            style={{
                                                transitionProperty:
                                                    "max-height, opacity, transform",
                                            }}
                                        >
                                            {item.submenu.map((submenuItem) => (
                                                <SidebarMenuItem
                                                    key={submenuItem.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <a
                                                            href={
                                                                submenuItem.url
                                                            }
                                                            className={`flex items-center pl-6 my-1 ${
                                                                location.pathname ===
                                                                submenuItem.url
                                                                    ? "bg-gray-200 text-primary"
                                                                    : "text-gray-200"
                                                            }`}
                                                            style={{
                                                                maxWidth:
                                                                    "calc(100% - 2rem)", // Adjust width
                                                                width: "auto",
                                                            }}
                                                        >
                                                            <submenuItem.icon className="mr-2" />
                                                            <span>
                                                                {
                                                                    submenuItem.title
                                                                }
                                                            </span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarGroupContent>
                                    )}
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-blue-500">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
