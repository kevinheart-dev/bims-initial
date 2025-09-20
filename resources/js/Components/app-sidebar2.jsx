import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Home,
    FileStack,
    FileText,
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

// Sidebar structure
const items = [
    {
        title: "Admin Dashboard",
        url: "/barangay_officer/dashboard",
        icon: Home,
        roles: ["barangay_officer"],
    },
    {
        title: "CDRRMO Dashboard",
        url: "/cdrrmo_admin/dashboard",
        icon: Home,
        roles: ["cdrrmo_admin"],
    },
    {
        title: "Barangay",
        icon: FileStack,
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
        ],
    },
    {
        title: "Residents Information",
        icon: FileStack,
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
        icon: FileStack,
        roles: ["barangay_officer"],
        submenu: [
            {
                title: "Certificate Issuance",
                url: "certificate/index",
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
        icon: Flag,
        submenu: [],
        roles: ["barangay_officer"],
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
                icon: Table,
                url: "/cra/dashboard",
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
];

export function AppSidebar({ auth }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState({});
    const [barangay, setBarangay] = useState(null);
    const APP_URL = useAppUrl();
    const user = auth.user;

    // Flatten user roles as string array
    const userRoles = user.roles.map((r) => r.name);

    useEffect(() => {
        const fetchBarangayDetails = async () => {
            try {
                const res = await axios.get(
                    `${APP_URL}/barangay_profile/barangaydetails`
                );
                setBarangay(res.data.data);
            } catch (err) {
                console.error("Error fetching barangay details:", err);
            }
        };

        if (userRoles.includes("barangay_officer")) fetchBarangayDetails();
    }, []);

    const toggleCollapse = (index) => {
        setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    // Filter items dynamically based on roles
    const filteredItems = items.filter((item) =>
        item.roles.some((role) => userRoles.includes(role))
    );

    const isActive = (url) => location.pathname.startsWith(url);

    return (
        <Sidebar>
            <SidebarContent className="bg-sky-600 shadow-lg">
                <div className="flex items-center pt-1 pb-0 px-4 text-left">
                    <img
                        src="/images/csa-logo.png"
                        alt="CSA Logo"
                        className="h-12 w-12 mr-3"
                    />
                    <div className="flex flex-col leading-none space-y-0">
                        <p className="font-black text-xl text-white font-montserrat m-0 pb-1 leading-none">
                            iBIMS
                        </p>
                        <p className="font-light text-sm text-white font-montserrat m-0 p-0 leading-none">
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
                <hr className="border-t-2 border-white opacity-30 mx-3 my-0" />

                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-100 m-0">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item, index) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() =>
                                                toggleCollapse(index)
                                            }
                                        >
                                            <a
                                                href={item.url || "#"}
                                                className={`flex items-center justify-between w-full my-1 ${
                                                    isActive(item.url)
                                                        ? "bg-gray-200 text-primary"
                                                        : "text-white"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-2" />
                                                    <span>{item.title}</span>
                                                </div>
                                                {item.submenu &&
                                                    item.submenu.length > 0 && (
                                                        <span className="ml-2">
                                                            {collapsed[
                                                                index
                                                            ] ? (
                                                                <ChevronDown className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronUp className="w-4 h-4" />
                                                            )}
                                                        </span>
                                                    )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {item.submenu &&
                                        item.submenu.length > 0 && (
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
                                                {item.submenu
                                                    .filter((sub) =>
                                                        sub.roles.some((role) =>
                                                            userRoles.includes(
                                                                role
                                                            )
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
                                                                    href={
                                                                        sub.url
                                                                    }
                                                                    className={`flex items-center pl-6 my-1 ${
                                                                        isActive(
                                                                            sub.url
                                                                        )
                                                                            ? "bg-gray-200 text-primary"
                                                                            : "text-gray-200"
                                                                    }`}
                                                                    style={{
                                                                        maxWidth:
                                                                            "calc(100% - 2rem)",
                                                                        width: "auto",
                                                                    }}
                                                                >
                                                                    <sub.icon className="mr-2" />
                                                                    <span>
                                                                        {
                                                                            sub.title
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

            <SidebarFooter className="bg-sky-600">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
