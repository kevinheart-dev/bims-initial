import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Home,
    FileStack,
    FileText,
    FileUser,
    Files,
    Table,
    UsersRound,
    SquareUserRound,
    House,
    CarFront,
    GraduationCap,
    BriefcaseBusiness,
    SquareActivity,
    HeartPulse,
    Accessibility,
    Pill,
    Syringe,
    PersonStanding,
    Stethoscope,
    Tablets,
    ScrollText,
    Baby,
    MessageSquareWarning,
    Flag,
    ChevronDown,
    ChevronUp,
    Scale,
    CircleUser,
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
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useMemo } from "react";
import { useRef } from "react";

const items = [
    {
        title: "Admin Dashboard",
        url: "/barangay_officer/dashboard",
        icon: LayoutDashboard,
        roles: ["barangay_officer"],
    },
    {
        title: "CDRRMO Dashboard",
        url: "/cdrrmo_admin/dashboard",
        icon: LayoutDashboard,
        roles: ["cdrrmo_admin"],
    },
    {
        title: "Resident Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["resident"],
    },
    {
        title: "Barangay",
        icon: Home,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Barangay Profile",
                url: "/barangay_profile",
                icon: FileText,
                roles: ["barangay_officer"],
            },
            {
                title: "Barangay Documents",
                url: "/document",
                icon: FileText,
                roles: ["barangay_officer"],
            },
            {
                title: "Barangay Accounts",
                url: "/user",
                icon: CircleUser,
                roles: ["barangay_officer"],
            },
        ],
    },
    {
        title: "Residents Information",
        icon: FileUser,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Information Table",
                url: "/resident",
                icon: Table,
                roles: ["barangay_officer"],
            },
            {
                title: "Senior Citizen",
                url: "/senior_citizen",
                icon: UsersRound,
                roles: ["barangay_officer"],
            },
            {
                title: "Families",
                url: "/family",
                icon: SquareUserRound,
                roles: ["barangay_officer"],
            },
            {
                title: "Households",
                url: "/household",
                icon: House,
                roles: ["barangay_officer"],
            },
            {
                title: "Vehicles",
                url: "/vehicle",
                icon: CarFront,
                roles: ["barangay_officer"],
            },
            {
                title: "Education",
                url: "/education",
                icon: GraduationCap,
                roles: ["barangay_officer"],
            },
            {
                title: "Occupation/Livelihood",
                url: "/occupation",
                icon: BriefcaseBusiness,
                roles: ["barangay_officer"],
            },
        ],
    },
    {
        title: "Medical Information",
        icon: HeartPulse,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Information Table",
                url: "/medical",
                icon: Table,
                roles: ["barangay_officer"],
            },
            {
                title: "Allergies",
                url: "/allergy",
                icon: Tablets,
                roles: ["barangay_officer"],
            },
            {
                title: "Child Health Records",
                url: "/child_record",
                icon: Baby,
                roles: ["barangay_officer"],
            },
            {
                title: "Medical Condition",
                url: "/medical_condition",
                icon: Stethoscope,
                roles: ["barangay_officer"],
            },
            {
                title: "Disabilities",
                url: "/disability",
                icon: Accessibility,
                roles: ["barangay_officer"],
            },
            {
                title: "Medications",
                url: "/medication",
                icon: Pill,
                roles: ["barangay_officer"],
            },
            {
                title: "Pregnancy Records",
                url: "/pregnancy",
                icon: SquareActivity,
                roles: ["barangay_officer"],
            },
            {
                title: "Vaccinations",
                url: "/vaccination",
                icon: Syringe,
                roles: ["barangay_officer"],
            },
            {
                title: "Deaths",
                url: "/death/index",
                icon: PersonStanding,
                roles: ["barangay_officer"],
            },
        ],
    },
    {
        title: "Issuance",
        icon: Files,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Certificate Issuance",
                url: "/certificate/index",
                icon: FileText,
                roles: ["barangay_officer"],
            },
        ],
    },
    {
        title: "Katarungang Pambarangay",
        icon: Scale,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Blotter Reports",
                url: "/blotter_report",
                icon: ScrollText,
                roles: ["barangay_officer"],
            },
            {
                title: "Summon",
                url: "/summon",
                icon: MessageSquareWarning,
                roles: ["barangay_officer"],
            },
        ],
    },
    {
        title: "Reports",
        url: "/report",
        icon: Flag,
        roles: ["barangay_officer"]
    },
    {
        title: "Community Risk Assessment",
        icon: FileStack,
        roles: ["cdrrmo_admin", "barangay_officer"],
        submenu: [
            {
                title: "Information Table",
                icon: Table,
                roles: ["cdrrmo_admin"],
            },
            {
                title: "Barangay Information Table",
                url: "/cra/dashboard",
                icon: Table,
                roles: ["barangay_officer"],
            },
            {
                title: "Create",
                url: "/cra/create",
                icon: FileText,
                roles: ["cdrrmo_admin", "barangay_officer"],
            },
        ],
    },
    {
        title: "Crtificate Issuance",
        icon: FileStack,
        roles: ["resident"],
        submenu: [
            {
                title: "Information Table",
                icon: Table,
                roles: ["resident"],
            },
            {
                title: "Requisition",
                url: "/cra/dashboard",
                icon: Table,
                roles: ["resident"],
            },
        ],
    },
];

export function AppSidebar({ auth }) {
    const location = useLocation();
    const [openIndex, setOpenIndex] = useState(null);
    const [barangay, setBarangay] = useState(null);
    const APP_URL = useAppUrl();
    const user = auth.user;
    const fetchedRef = useRef(false);

    const userRoles = user.roles.map((r) => r.name);

    const normalize = (u) => {
        if (!u) return "";
        let s = u.trim();
        if (!s.startsWith("/")) s = "/" + s;
        if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
        return s;
    };

    const isActive = (url) => {
        if (!url) return false;
        const n = normalize(url);
        return location.pathname === n || location.pathname.startsWith(n + "/");
    };

    useEffect(() => {
        if (!userRoles.includes("barangay_officer") || fetchedRef.current)
            return;

        const fetchBarangayDetails = async () => {
            try {
                const res = await axios.get(
                    `${APP_URL}/barangay_profile/barangaydetails`
                );
                setBarangay(res.data.data);
                fetchedRef.current = true;
            } catch (err) {
                console.error(err);
            }
        };

        fetchBarangayDetails();
    }, [APP_URL, userRoles]);

    // Filter items based on user roles
    const filteredItems = useMemo(() => {
        return items.filter((item) =>
            item.roles.some((role) => userRoles.includes(role))
        );
    }, [items, userRoles]);

    useEffect(() => {
        const matchedIndex = filteredItems.findIndex(
            (item) =>
                Array.isArray(item.submenu) &&
                item.submenu.some((sub) => isActive(sub.url))
        );
        setOpenIndex(matchedIndex === -1 ? null : matchedIndex);
    }, [location.pathname, JSON.stringify(filteredItems)]);

    const toggleCollapse = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <Sidebar>
            {/* Header with blue branding */}
            <div className="bg-white px-4 py-[8px] flex items-center border-b border-gray-200">
                <img
                    src="/images/csa-logo.png"
                    alt="CSA Logo"
                    className="h-11 w-11 mr-3"
                />
                <div className="flex flex-col leading-none space-y-0">
                    <p className="font-black text-[20px] text-sky-700 font-montserrat m-0 pb-1 leading-none">
                        iBIMS
                    </p>
                    <p className="font-light text-sm text-gray-500 font-montserrat m-0 p-0 leading-none">
                        {userRoles.includes("super_admin")
                            ? "Super Admin"
                            : userRoles.includes("cdrrmo_admin")
                                ? "CDRRMO Admin"
                                : barangay
                                    ? barangay.barangay_name
                                    : "Loading..."}
                    </p>
                </div>
            </div>

            <SidebarContent className="bg-white shadow-lg">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-500 mx-0 mr-4 text-sm">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item, index) => (
                                <div key={item.title}>
                                    {/* Parent Item */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() =>
                                                item.submenu?.length > 0 &&
                                                toggleCollapse(index)
                                            }
                                        >
                                            <a
                                                href={item.url || "#"}
                                                className={`flex items-center justify-between w-full my-1 px-2 py-2 rounded-lg transition-all duration-200 ${isActive(item.url) ||
                                                    (item.submenu &&
                                                        item.submenu.some(
                                                            (sub) =>
                                                                isActive(
                                                                    sub.url
                                                                )
                                                        ))
                                                    ? "text-gray-900 font-semibold"
                                                    : "text-gray-700 hover:text-gray-900"
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-2 h-5 w-5" />
                                                    <span>{item.title}</span>
                                                </div>

                                                {item.submenu?.length > 0 && (
                                                    <span className="ml-2">
                                                        {openIndex === index ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Submenu */}
                                    {item.submenu?.length > 0 && (
                                        <SidebarGroupContent
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index
                                                ? "max-h-[1000px] opacity-100"
                                                : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            {item.submenu
                                                .filter((sub) =>
                                                    sub.roles.some((role) =>
                                                        userRoles.includes(role)
                                                    )
                                                )
                                                .map((sub) => (
                                                    <SidebarMenuItem
                                                        key={sub.title}
                                                    >
                                                        <SidebarMenuButton
                                                            asChild
                                                        >
                                                            <a
                                                                href={sub.url}
                                                                className={`flex items-center pl-8 pr-2 py-2 my-1 rounded-md transition-all duration-200 ${isActive(
                                                                    sub.url
                                                                )
                                                                    ? "bg-gray-200 text-gray-900 font-semibold"
                                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                                    }`}
                                                            >
                                                                <sub.icon className="mr-2 h-4 w-4" />
                                                                <span>
                                                                    {sub.title}
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

            {/* Footer */}
            <SidebarFooter className="bg-white border-t border-gray-200">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
