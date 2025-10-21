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
    SlidersHorizontal,
    Plus,
    Cloudy,
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
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export function AppSidebar({ auth }) {
    const location = useLocation();
    const [openIndex, setOpenIndex] = useState(null);
    const [barangay, setBarangay] = useState(null);
    const APP_URL = useAppUrl();
    const user = auth.user;
    const fetchedRef = useRef(false);
    const defaultLogo = "/images/city-of-ilagan.png";
    const [craList, setCraList] = useState([]);

    useEffect(() => {
        if (
            !["cdrrmo_admin", "barangay_officer", "admin"].some((role) =>
                userRoles.includes(role)
            )
        )
            return;

        const fetchCRAList = async () => {
            try {
                const res = await axios.get(`${APP_URL}/getCRA`);
                setCraList(res.data); // expect [{id: 1, year: 2023}, {id: 2, year: 2024}]
            } catch (err) {
                console.error("Failed to fetch CRA list:", err);
            }
        };

        fetchCRAList();
    }, []);

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
                    title: "Accounts",
                    url: "/user",
                    icon: CircleUser,
                    roles: ["admin"],
                },
                {
                    title: "Documents",
                    url: "/document",
                    icon: FileText,
                    roles: ["barangay_officer", "admin"],
                },
                {
                    title: "Management",
                    url: "/barangay_management",
                    icon: Settings,
                    roles: ["barangay_officer", "admin"],
                },
                {
                    title: "Profile",
                    url: "/barangay_profile",
                    icon: UserPen,
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
            roles: ["barangay_officer", "admin"],
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
            title: "Summary",
            icon: FileStack,
            roles: ["cdrrmo_admin"],
            submenu: [
                {
                    title: "Population and Residence",
                    url: "/cdrrmo_admin/population",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Livelihood Statistics",
                    url: "/cdrrmo_admin/livelihood",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Household Services",
                    url: "/cdrrmo_admin/services",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Buildings and other Infrastructures",
                    url: "/cdrrmo_admin/infraFacilities",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Primary Facilities and Services ",
                    url: "/cdrrmo_admin/primaryFacilities",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Inventory of Institutions",
                    url: "/cdrrmo_admin/institutions",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Human Resources",
                    url: "/cdrrmo_admin/humanResources",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
                {
                    title: "Disaster Population Impact",
                    url: "/cdrrmo_admin/populationimpact",
                    icon: Table,
                    roles: ["cdrrmo_admin"],
                },
            ],
        },
        {
            title: "Community Risk Assessment",
            icon: Cloudy,
            roles: ["barangay_officer", "admin"],
            url: "#",
            submenu:
                craList.length > 0
                    ? craList.map((cra) => ({
                          title: `Submit CRA ${cra.year}`,
                          url: `/cra/create?year=${cra.year}`,
                          icon: FileInput,
                          roles: ["barangay_officer", "admin"],
                      }))
                    : [
                          {
                              title: "Loading years...",
                              url: "#",
                              icon: FileInput,
                              roles: ["barangay_officer", "admin"],
                          },
                      ],
        },
        {
            title: "CRA Settings",
            icon: Settings,
            roles: ["cdrrmo_admin"],
            url: "#",
            submenu: [
                {
                    title: "Selectfield",
                    icon: SlidersHorizontal, // import this
                    url: "/cra/selectfield", // or your actual route
                    roles: ["cdrrmo_admin"], // make sure it matches your current user role
                },
            ],
        },
        {
            title: "Certificate Issuance",
            icon: FileStack,
            roles: ["resident"],
            url: "/account/certificates",
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

        const cacheKey = "barangay_details_cache";
        const cachedDataRaw = localStorage.getItem(cacheKey);
        let cachedData = null;

        // ✅ Use cached data immediately if available
        if (cachedDataRaw) {
            try {
                cachedData = JSON.parse(cachedDataRaw);
                setBarangay(cachedData);
                fetchedRef.current = true;
            } catch {
                localStorage.removeItem(cacheKey);
            }
        }

        const fetchBarangayDetails = async () => {
            try {
                const res = await axios.get(
                    `${APP_URL}/barangay_management/barangaydetails`
                );
                const apiData = res.data.data;

                // ✅ Compare with cached data, update if different
                const cachedDataWithoutTimestamp = cachedData
                    ? { ...cachedData }
                    : null;
                if (cachedDataWithoutTimestamp?._cachedAt) {
                    delete cachedDataWithoutTimestamp._cachedAt;
                }

                const isDifferent =
                    !cachedDataWithoutTimestamp ||
                    JSON.stringify(cachedDataWithoutTimestamp) !==
                        JSON.stringify(apiData);

                if (isDifferent) {
                    // Update state
                    setBarangay(apiData);

                    // Update cache with new data + timestamp
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({ ...apiData, _cachedAt: Date.now() })
                    );
                }

                fetchedRef.current = true;
            } catch (err) {
                console.error("Failed to fetch barangay details:", err);
            }
        };

        // Check if cache is expired (1 minute here)
        const cacheExpiry = 1000 * 60 * 5; // 5 min
        if (
            !cachedData ||
            (cachedData._cachedAt &&
                Date.now() - cachedData._cachedAt > cacheExpiry)
        ) {
            fetchBarangayDetails();
        } else {
            // ✅ Still fetch in background to check for changes
            fetchBarangayDetails();
        }
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

    const logoSrc = barangay?.logo_path?.trim()
        ? `/storage/${barangay.logo_path}`
        : defaultLogo;

    const [selectedYear, setSelectedYear] = useState("");

    // On mount, only load if there’s a saved value
    useEffect(() => {
        const savedYear = sessionStorage.getItem("cra_year");
        if (savedYear) {
            setSelectedYear(savedYear);
        }
    }, []);

    const handleAddCRA = async () => {
        try {
            // ✅ Find latest year from current CRA list (default to current year if empty)
            const latestYear =
                craList.length > 0
                    ? Math.max(...craList.map((cra) => parseInt(cra.year)))
                    : new Date().getFullYear();

            const nextYear = latestYear + 1;

            // ✅ Send the next year to backend
            const res = await axios.post(`${APP_URL}/cdrrmo_admin/addCRA`, {
                year: nextYear,
            });

            if (res.data.success) {
                toast.success(`CRA for year ${nextYear} added successfully!`);
                setCraList((prev) => [...prev, res.data.data]);
            }
        } catch (error) {
            console.error("Failed to add CRA:", error);
            toast.error("Failed to add CRA. Please try again.");
        }
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        sessionStorage.setItem("cra_year", year);

        router.get(
            window.location.pathname,
            { year },
            { preserveState: true, replace: true }
        );
    };

    return (
        <Sidebar>
            <Toaster richColors />
            {/* Header with blue branding */}
            <div className="bg-white px-4 py-[8px] flex items-center border-b border-gray-200">
                <img
                    src={logoSrc}
                    onError={(e) => {
                        e.currentTarget.src = defaultLogo;
                    }}
                    alt={`${barangay?.barangay_name || "Barangay"} Logo`}
                    className="max-h-10 max-w-10 mr-3 object-contain rounded-full border border-gray-200"
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
                                            {/* Check if this is CRA Settings */}
                                            {item.title === "CRA Settings" ? (
                                                <div className="px-4 py-3">
                                                    <label
                                                        htmlFor="cra-year"
                                                        className="block text-sm font-medium text-gray-600 mb-1"
                                                    >
                                                        Select Year
                                                    </label>
                                                    <select
                                                        id="cra-year"
                                                        name="cra-year"
                                                        value={selectedYear}
                                                        onChange={
                                                            handleYearChange
                                                        }
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            -- Select Year --
                                                        </option>
                                                        <option value="2024">
                                                            2024
                                                        </option>

                                                        {craList.length > 0 ? (
                                                            craList.map(
                                                                (cra) => (
                                                                    <option
                                                                        key={
                                                                            cra.id
                                                                        }
                                                                        value={
                                                                            cra.year
                                                                        }
                                                                    >
                                                                        {
                                                                            cra.year
                                                                        }
                                                                    </option>
                                                                )
                                                            )
                                                        ) : (
                                                            <option disabled>
                                                                Loading years...
                                                            </option>
                                                        )}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddCRA}
                                                        className="mt-3 flex items-center gap-2 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                        <span>Add CRA</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                item.submenu
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
                                                                        {
                                                                            sub.title
                                                                        }
                                                                    </span>
                                                                </a>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))
                                            )}
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
                <NavUser user={user} auth={auth} />
            </SidebarFooter>
        </Sidebar>
    );
}
