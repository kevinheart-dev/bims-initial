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
    FileInput,
    CircleUserRound,
    LayoutList,
    UtilityPole,
    UserPen,
    Settings,
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
        title: "Barangay Officer",
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
        title: "Super Admin Dashboard",
        url: "/super_admin/dashboard",
        icon: LayoutDashboard,
        roles: ["super_admin"],
    },
    {
        title: "Resident Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["resident"],
    },
    {
        title: "Admin Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["admin"],
    },
    {
        title: "Barangay Information",
        icon: Home,
        roles: ["barangay_officer", "admin"],
        submenu: [
            {
                title: "Barangay Profile",
                url: "/barangay_profile",
                icon: UserPen,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Barangay Management",
                url: "/barangay_management",
                icon: Settings,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Barangay Documents",
                url: "/document",
                icon: FileText,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Barangay Accounts",
                url: "/user",
                icon: CircleUser,
                roles: ["admin"],
            },
        ],
    },
    {
        title: "Residents Information",
        icon: FileUser,
        roles: ["barangay_officer", "admin"],
        submenu: [
            {
                title: "Information Table",
                url: "/resident",
                icon: Table,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Senior Citizen",
                url: "/senior_citizen",
                icon: UsersRound,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Families",
                url: "/family",
                icon: SquareUserRound,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Households",
                url: "/household",
                icon: House,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Household Overview",
                url: "/overview",
                icon: UtilityPole,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Vehicles",
                url: "/vehicle",
                icon: CarFront,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Education",
                url: "/education",
                icon: GraduationCap,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Occupation/Livelihood",
                url: "/occupation",
                icon: BriefcaseBusiness,
                roles: ["barangay_officer", "admin"],
            },
        ],
    },
    {
        title: "Medical Information",
        icon: HeartPulse,
        roles: ["barangay_officer", "admin"],
        submenu: [
            {
                title: "Information Table",
                url: "/medical",
                icon: Table,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Allergies",
                url: "/allergy",
                icon: Tablets,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Child Health Records",
                url: "/child_record",
                icon: Baby,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Medical Condition",
                url: "/medical_condition",
                icon: Stethoscope,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Disabilities",
                url: "/disability",
                icon: Accessibility,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Medications",
                url: "/medication",
                icon: Pill,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Pregnancy Records",
                url: "/pregnancy",
                icon: SquareActivity,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Vaccinations",
                url: "/vaccination",
                icon: Syringe,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Deaths",
                url: "/death/index",
                icon: PersonStanding,
                roles: ["barangay_officer", "admin"],
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
                roles: ["barangay_officer", "admin"],
            },
        ],
    },
    {
        title: "Katarungang Pambarangay",
        icon: Scale,
        roles: ["barangay_officer", "admin"],
        submenu: [
            {
                title: "Blotter Reports",
                url: "/blotter_report",
                icon: ScrollText,
                roles: ["barangay_officer", "admin"],
            },
            {
                title: "Summon",
                url: "/summon",
                icon: MessageSquareWarning,
                roles: ["barangay_officer", "admin"],
            },
        ],
    },
    {
        title: "Reports",
        url: "/report",
        icon: Flag,
        roles: ["barangay_officer", "admin"],
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
        title: "Certificate Issuance",
        icon: FileStack,
        roles: ["resident"],
        url: "/certificates",
    },
    {
        title: "Barangay Accounts",
        url: "/super_admin/accounts",
        icon: CircleUserRound,
        roles: ["super_admin"],
    },
    {
        title: "List of Barangays",
        url: "/super_admin/barangay",
        icon: LayoutList,
        roles: ["super_admin"],
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
        if (
            (!userRoles.includes("admin") &&
                !userRoles.includes("barangay_officer")) ||
            fetchedRef.current
        )
            return;

        const fetchBarangayDetails = async () => {
            try {
                const res = await axios.get(
                    `${APP_URL}/barangay_management/barangaydetails`
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
                        {(() => {
                            if (userRoles.includes("super_admin"))
                                return "Super Administrator";
                            if (userRoles.includes("admin"))
                                return (
                                    barangay?.barangay_name || "Administrator"
                                );
                            if (userRoles.includes("cdrrmo_admin"))
                                return "CDRRMO Administrator";
                            if (userRoles.includes("barangay_officer"))
                                return (
                                    barangay?.barangay_name ||
                                    "Barangay Officer"
                                );
                            if (userRoles.includes("resident"))
                                return barangay?.barangay_name || "Resident";
                            return "Loading...";
                        })()}
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
                                                className={`flex items-center justify-between w-full my-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                                                    isActive(item.url) ||
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
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                openIndex === index
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
                                                                className={`flex items-center pl-8 pr-2 py-2 my-1 rounded-md transition-all duration-200 ${
                                                                    isActive(
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
