import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import ClearFilterButton from "@/Components/ClearFiltersButton";
import {
    BARANGAY_OFFICIAL_POSITIONS_TEXT,
    BLOOD_TYPE_OPTIONS,
    BMI_STATUS,
    CERTIFICATE_REQUEST_STATUS_TEXT,
    INCOME_BRACKETS,
} from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClearFilterButton2 from "../ClearFilterButton2";

const FilterToggle = ({
    queryParams,
    searchFieldName,
    visibleFilters = [],
    showOnlyFilters = false,
    showFilters = false,
    puroks = [],
    streets = [],
    pensionTypes = [],
    vehicle_types = [],
    livelihood_types = [],
    months = [],
    certificateTypes = [],
    categories = [],
    institutions = [],
    types = [],
    names = [],
    clearRouteName = "",
    clearRouteParams = {},
    clearRouteAxios = false,
    setQueryParams = null,
    setQuery = null,
}) => {
    const isVisible = (key) => visibleFilters.includes(key);

    if (!showOnlyFilters && !showFilters) return null;

    const [openWelfare, setOpenWelfare] = useState(false);
    const welfareRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                welfareRef.current &&
                !welfareRef.current.contains(event.target)
            ) {
                setOpenWelfare(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getYearOptions = (start = 1980) => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= start; year--) {
            years.push(year);
        }
        return years;
    };

    return (
        <div className="flex flex-wrap gap-2 items-center mb-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-1 mt-2">
            {isVisible("purok") && (
                <Select
                    onValueChange={(v) => searchFieldName("purok", v)}
                    value={queryParams.purok}
                >
                    <SelectTrigger className="w-[95px]">
                        <SelectValue placeholder="Purok" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {puroks.map((p, idx) => (
                            <SelectItem key={idx} value={p.toString()}>
                                Purok {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("sex") && (
                <Select
                    onValueChange={(v) => searchFieldName("sex", v)}
                    value={queryParams.sex}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Sex" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("gender") && (
                <Select
                    onValueChange={(v) => searchFieldName("gender", v)}
                    value={queryParams.gender}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="lgbtq">LGBTQ+</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("age_group") && (
                <Select
                    onValueChange={(v) => searchFieldName("age_group", v)}
                    value={queryParams.age_group}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="0_6_months">0 – 6 months</SelectItem>
                        <SelectItem value="7mos_2yrs">
                            7 months – 2 years old
                        </SelectItem>
                        <SelectItem value="3_5yrs">3 – 5 years old</SelectItem>
                        <SelectItem value="6_12yrs">
                            6 – 12 years old
                        </SelectItem>
                        <SelectItem value="13_17yrs">
                            13 – 17 years old
                        </SelectItem>
                        <SelectItem value="18_59yrs">
                            18 – 59 years old
                        </SelectItem>
                        <SelectItem value="60_above">
                            60 years old and above
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("relation") && (
                <Select
                    onValueChange={(v) => searchFieldName("relation", v)}
                    value={queryParams.relation}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Relationship to Head" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("household_position") && (
                <Select
                    onValueChange={(v) =>
                        searchFieldName("household_position", v)
                    }
                    value={queryParams.household_position}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Household Position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="primary">Nuclear/Primary</SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                        <SelectItem value="boarder">Boarder</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("estatus") && (
                <Select
                    onValueChange={(v) => searchFieldName("estatus", v)}
                    value={queryParams.estatus}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="self_employed">
                            Self Employed
                        </SelectItem>
                        <SelectItem value="under_employed">
                            Underemployed
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("voter_status") && (
                <Select
                    onValueChange={(v) => searchFieldName("voter_status", v)}
                    value={queryParams.voter_status}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Voter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Registered Voter</SelectItem>
                        <SelectItem value="0">Unregistered Voter</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("is_pwd") && (
                <Select
                    onValueChange={(v) => searchFieldName("is_pwd", v)}
                    value={queryParams.is_pwd}
                >
                    <SelectTrigger className="w-[90px]">
                        <SelectValue placeholder="Is PWD" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">PWD</SelectItem>
                        <SelectItem value="0">Not PWD</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("birthdate") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.birthdate
                                ? new Date(queryParams.birthdate)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("birthdate", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date of Birth "
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}
            {/* ==== INDEX FILLTER ====*/}
            {isVisible("street") && (
                <Select
                    onValueChange={(v) => searchFieldName("street", v)}
                    value={queryParams.street}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Street" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {streets.map((s, idx) => (
                            <SelectItem key={idx} value={s.toString()}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("own_type") && (
                <Select
                    onValueChange={(v) => searchFieldName("own_type", v)}
                    value={queryParams.own_type}
                >
                    <SelectTrigger className="w-[160px] text-sm">
                        <SelectValue placeholder="Ownership Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                        <SelectItem value="government_provided">
                            Gov’t Provided
                        </SelectItem>
                        <SelectItem value="inherited">Inherited</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("condition") && (
                <Select
                    onValueChange={(v) => searchFieldName("condition", v)}
                    value={queryParams.condition}
                >
                    <SelectTrigger className="w-[140px] text-sm">
                        <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="needs_repair">
                            Needs Repair
                        </SelectItem>
                        <SelectItem value="delapitated">Dilapidated</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("structure") && (
                <Select
                    onValueChange={(v) => searchFieldName("structure", v)}
                    value={queryParams.structure}
                >
                    <SelectTrigger className="w-[150px] text-sm">
                        <SelectValue placeholder="Structure" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="semi_concrete">
                            Semi Concrete
                        </SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                        <SelectItem value="makeshift">Makeshift</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* Added fillter family index */}
            {isVisible("famtype") && (
                <Select
                    onValueChange={(v) => searchFieldName("famtype", v)}
                    value={queryParams.famtype}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Family Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="nuclear">Nuclear</SelectItem>
                        <SelectItem value="single_parent">
                            Single-Parent
                        </SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                        <SelectItem value="stepfamilies">Separated</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="childless">Childless</SelectItem>
                        <SelectItem value="cohabiting_partners">
                            Cohabiting Partners
                        </SelectItem>
                        <SelectItem value="one_person_household">
                            One-Person Household
                        </SelectItem>
                        <SelectItem value="roommates">Roommates</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("household_head") && (
                <Select
                    onValueChange={(v) => searchFieldName("household_head", v)}
                    value={queryParams.household_head}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Is Household Head" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Head</SelectItem>
                        <SelectItem value="0">Not Head</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("income_bracket") && (
                <Select
                    onValueChange={(v) => searchFieldName("income_bracket", v)}
                    value={queryParams.income_bracket}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Income Bracket" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {Object.entries(INCOME_BRACKETS).map(
                            ([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            )}
            {/* SENIOR INDEX */}
            {isVisible("is_pensioner") && (
                <Select
                    onValueChange={(v) => searchFieldName("is_pensioner", v)}
                    value={queryParams.is_pensioner}
                >
                    <SelectTrigger className="w-[125px]">
                        <SelectValue placeholder="Is Pensioner?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("is_registered") && (
                <Select
                    onValueChange={(v) => searchFieldName("is_registered", v)}
                    value={queryParams.is_registered}
                >
                    <SelectTrigger className="w-[125px]">
                        <SelectValue placeholder="Is Registered?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("pension_type") && (
                <Select
                    onValueChange={(v) => searchFieldName("pension_type", v)}
                    value={queryParams.pension_type}
                >
                    <SelectTrigger className="w-[125px]">
                        <SelectValue placeholder="Pension Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {pensionTypes.map((p, i) => (
                            <SelectItem key={i} value={p.value}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("living_alone") && (
                <Select
                    onValueChange={(v) => searchFieldName("living_alone", v)}
                    value={queryParams.living_alone}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type of Living" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Alone</SelectItem>
                        <SelectItem value="0">Not Alone</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("birth_month") && (
                <Select
                    onValueChange={(v) => searchFieldName("birth_month", v)}
                    value={queryParams.birth_month}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Birth Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {months.map((m, i) => (
                            <SelectItem key={i} value={m.value}>
                                {m.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {/* RESIDENT INDEX */}
            {isVisible("cstatus") && (
                <Select
                    onValueChange={(v) => searchFieldName("cstatus", v)}
                    value={queryParams.cstatus}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Civil Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="divorce">Divorce</SelectItem>
                        <SelectItem value="anulled">Annulled</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {(isVisible("pwd") ||
                isVisible("fourps") ||
                isVisible("solo_parent")) && (
                <div
                    className="relative inline-block text-left w-56"
                    ref={welfareRef}
                >
                    <button
                        onClick={() => setOpenWelfare(!openWelfare)}
                        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                        Social Welfare
                        <svg
                            className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                                openWelfare ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {openWelfare && (
                        <div className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg z-50 max-h-60 overflow-auto">
                            <div className="py-2 px-4 space-y-2">
                                {isVisible("pwd") && (
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="pwd-checkbox"
                                            checked={queryParams.pwd === "1"}
                                            onCheckedChange={(checked) =>
                                                searchFieldName(
                                                    "pwd",
                                                    checked ? "1" : "0"
                                                )
                                            }
                                        />
                                        <span>PWD</span>
                                    </label>
                                )}
                                {isVisible("fourps") && (
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="fourps-checkbox"
                                            checked={queryParams.fourps === "1"}
                                            onCheckedChange={(checked) =>
                                                searchFieldName(
                                                    "fourps",
                                                    checked ? "1" : "0"
                                                )
                                            }
                                        />
                                        <span>4ps Beneficiary</span>
                                    </label>
                                )}
                                {isVisible("solo_parent") && (
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="solo-parent-checkbox"
                                            checked={
                                                queryParams.solo_parent === "1"
                                            }
                                            onCheckedChange={(checked) =>
                                                searchFieldName(
                                                    "solo_parent",
                                                    checked ? "1" : "0"
                                                )
                                            }
                                        />
                                        <span>Solo Parent</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* VEHICLE */}
            {isVisible("v_type") && (
                <Select
                    onValueChange={(v) => searchFieldName("v_type", v)}
                    value={queryParams.v_type}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {vehicle_types.map((type, index) => (
                            <SelectItem key={index} value={type.toLowerCase()}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("v_class") && (
                <Select
                    onValueChange={(v) => searchFieldName("v_class", v)}
                    value={queryParams.v_class}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Vehicle Class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("usage") && (
                <Select
                    onValueChange={(v) => searchFieldName("usage", v)}
                    value={queryParams.usage}
                >
                    <SelectTrigger className="w-[135px]">
                        <SelectValue placeholder="Vehicle Usage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="public_transport">
                            Public Transport
                        </SelectItem>
                        <SelectItem value="business_use">
                            Business Use
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* EDUCATION */}
            {isVisible("educational_attainment") && (
                <Select
                    onValueChange={(edu) =>
                        searchFieldName("educational_attainment", edu)
                    }
                    value={queryParams.educational_attainment}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Educational Attainment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value={"no_education_yet"}>
                            No Education Yet
                        </SelectItem>
                        <SelectItem value={"no_formal_education"}>
                            No Formal Education
                        </SelectItem>
                        <SelectItem value={"prep_school"}>
                            Prep School
                        </SelectItem>
                        <SelectItem value={"kindergarten"}>
                            Kindergarten
                        </SelectItem>
                        <SelectItem value={"elementary"}>Elementary</SelectItem>

                        <SelectItem value={"junior_high_school"}>
                            Junior High School (K-12)
                        </SelectItem>
                        <SelectItem value={"senior_high_school"}>
                            Senior High School (K-12)
                        </SelectItem>

                        <SelectItem value={"high_school"}>
                            High School
                        </SelectItem>
                        <SelectItem value={"college"}>College</SelectItem>
                        <SelectItem value={"post_graduate"}>
                            Post Graduate
                        </SelectItem>
                        <SelectItem value={"vocational"}>Vocational</SelectItem>
                        <SelectItem value={"tesda"}>TESDA</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("educational_status") && (
                <Select
                    onValueChange={(edu) =>
                        searchFieldName("educational_status", edu)
                    }
                    value={queryParams.educational_status}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Educational Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="enrolled">
                            Currently Enrolled
                        </SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                        <SelectItem value="dropped_out">Dropped Out</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("school_type") && (
                <Select
                    onValueChange={(edu) => searchFieldName("school_type", edu)}
                    value={queryParams.school_type}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="School Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* OCCUPATION */}
            {isVisible("employment_status") && (
                <Select
                    onValueChange={(occ) =>
                        searchFieldName("employment_status", occ)
                    }
                    value={queryParams.employment_status}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value={"employed"}>Employed</SelectItem>
                        <SelectItem value={"unemployed"}>Unemployed</SelectItem>
                        <SelectItem value={"self_employed"}>
                            Self Employed
                        </SelectItem>
                        <SelectItem value={"student"}>Student</SelectItem>
                        <SelectItem value={"under_unemployed"}>
                            Underemployed
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("employment_type") && (
                <Select
                    onValueChange={(occ) =>
                        searchFieldName("employment_type", occ)
                    }
                    value={queryParams.employment_type}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value={"full_time"}>Full Time</SelectItem>
                        <SelectItem value={"part_time"}>Part Time</SelectItem>
                        <SelectItem value={"self_employed"}>
                            Self Employed
                        </SelectItem>
                        <SelectItem value={"seasonal"}>Seasonal</SelectItem>
                        <SelectItem value={"contractual"}>
                            Contractual
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("work_arrangement") && (
                <Select
                    onValueChange={(occ) =>
                        searchFieldName("work_arrangement", occ)
                    }
                    value={queryParams.work_arrangement}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Work Arrangement" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value={"on_site"}>On Site</SelectItem>
                        <SelectItem value={"remote"}>Remote</SelectItem>
                        <SelectItem value={"hybrid"}>Hybrid</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("occupation_status") && (
                <Select
                    onValueChange={(occ) =>
                        searchFieldName("occupation_status", occ)
                    }
                    value={queryParams.occupation_status}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Occupation Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value={"active"}>Active</SelectItem>
                        <SelectItem value={"inactive"}>Inactive</SelectItem>
                        <SelectItem value={"retired"}>Retired</SelectItem>
                        <SelectItem value={"terminated"}>Terminated</SelectItem>
                        <SelectItem value={"resigned"}>Resigned</SelectItem>
                        <SelectItem value={"ended"}>Ended</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("is_ofw") && (
                <Select
                    onValueChange={(occ) => searchFieldName("is_ofw", occ)}
                    value={queryParams.is_ofw}
                >
                    <SelectTrigger className="w-[90px]">
                        <SelectValue placeholder="Is OFW" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("year_started") && (
                <Select
                    onValueChange={(edu) =>
                        searchFieldName("year_started", edu)
                    }
                    value={queryParams.year_started}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Year Started" />
                    </SelectTrigger>
                    <SelectContent>
                        {getYearOptions().map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("year_ended") && (
                <Select
                    onValueChange={(edu) => searchFieldName("year_ended", edu)}
                    value={queryParams.year_ended}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Year Ended" />
                    </SelectTrigger>
                    <SelectContent>
                        {getYearOptions().map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("latest_education") && (
                <Select
                    onValueChange={(edu) =>
                        searchFieldName("latest_education", edu)
                    }
                    value={queryParams.latest_education}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Education" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Latest Education</SelectItem>
                        <SelectItem value="0">All Education</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("latest_occupation") && (
                <Select
                    onValueChange={(occ) =>
                        searchFieldName("latest_occupation", occ)
                    }
                    value={queryParams.latest_occupation}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Occupation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Latest Occupation</SelectItem>
                        <SelectItem value="0">All Occupation</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* Certificate */}
            {isVisible("certificate_type") && (
                <Select
                    onValueChange={(type) =>
                        searchFieldName("certificate_type", type)
                    }
                    value={queryParams.certificate_type}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Certificates" />
                    </SelectTrigger>
                    <SelectContent>
                        {certificateTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("request_status") && (
                <Select
                    onValueChange={(status) =>
                        searchFieldName("request_status", status)
                    }
                    value={queryParams.request_status}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(CERTIFICATE_REQUEST_STATUS_TEXT).map(
                            ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            )}
            {isVisible("issued_by") && (
                <Select
                    onValueChange={(e) => searchFieldName("issued_by", e)}
                    value={queryParams.issued_by}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Officers" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {Object.entries(BARANGAY_OFFICIAL_POSITIONS_TEXT).map(
                            ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            )}
            {isVisible("issued_at") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.issued_at
                                ? new Date(queryParams.issued_at)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("issued_at", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border rounded px-2 py-1 w-[180px]"
                        placeholderText="Date Issued"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                    />
                </div>
            )}
            {/* MEDICAL INFORMATION */}
            {isVisible("nutritional_status") && (
                <Select
                    onValueChange={(med) =>
                        searchFieldName("nutritional_status", med)
                    }
                    value={queryParams.nutritional_status}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Nutritional Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {Object.entries(BMI_STATUS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("blood_type") && (
                <Select
                    onValueChange={(med) => searchFieldName("blood_type", med)}
                    value={queryParams.blood_type}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Blood Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {BLOOD_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("is_smoker") && (
                <Select
                    onValueChange={(med) => searchFieldName("is_smoker", med)}
                    value={queryParams.is_smoker}
                >
                    <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Is Smoker" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("alcohol_user") && (
                <Select
                    onValueChange={(med) =>
                        searchFieldName("alcohol_user", med)
                    }
                    value={queryParams.alcohol_user}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Alcohol User" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("has_philhealth") && (
                <Select
                    onValueChange={(med) =>
                        searchFieldName("has_philhealth", med)
                    }
                    value={queryParams.has_philhealth}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Has PhilHealth" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* INFRASTRUCTURE */}
            {isVisible("infra_type") && (
                <Select
                    onValueChange={(inf) => searchFieldName("infra_type", inf)}
                    value={queryParams?.infra_type ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Infrastructure Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {types.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("infra_category") && (
                <Select
                    onValueChange={(inf) =>
                        searchFieldName("infra_category", inf)
                    }
                    value={queryParams?.infra_category ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Infrastructure Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {categories.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {/* INSTITUTIONS */}
            {isVisible("institution") && (
                <Select
                    onValueChange={(inst) =>
                        searchFieldName("institution", inst)
                    }
                    value={queryParams?.institution ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Name of Institution" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {institutions.map((option) => (
                            <SelectItem key={option.id} value={option.name}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {/* FACILITIES */}
            {isVisible("faci_name") && (
                <Select
                    onValueChange={(faci) => searchFieldName("faci_name", faci)}
                    value={queryParams?.faci_name ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Facility Name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {names.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("faci_type") && (
                <Select
                    onValueChange={(faci) => searchFieldName("faci_type", faci)}
                    value={queryParams?.faci_type ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Facility Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {types.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {/* PROJECTS */}
            {isVisible("project_status") && (
                <Select
                    onValueChange={(pro) =>
                        searchFieldName("project_status", pro)
                    }
                    value={queryParams?.project_status ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Project Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("project_category") && (
                <Select
                    onValueChange={(pro) =>
                        searchFieldName("project_category", pro)
                    }
                    value={queryParams?.project_category ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Project Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {categories.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("responsible_inti") && (
                <Select
                    onValueChange={(pro) =>
                        searchFieldName("responsible_inti", pro)
                    }
                    value={queryParams?.responsible_inti ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Responsible Institution" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {institutions.map((option) => (
                            <SelectItem key={option.id} value={option.name}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("start_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.start_date
                                ? new Date(queryParams.start_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("start_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm px-2 py-1 w-[180px]"
                        placeholderText="Date Issued"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                    />
                </div>
            )}
            {isVisible("end_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.end_date
                                ? new Date(queryParams.end_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("end_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm px-2 py-1 w-[180px]"
                        placeholderText="Date Issued"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                    />
                </div>
            )}
            {/* ROADS */}
            {isVisible("road_type") && (
                <Select
                    onValueChange={(road) => searchFieldName("road_type", road)}
                    value={queryParams?.road_type ?? ""}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Road Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {types.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("maintained_by") && (
                <Select
                    onValueChange={(road) =>
                        searchFieldName("maintained_by", road)
                    }
                    value={queryParams?.maintained_by ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Maintained By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {names.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("road_status") && (
                <Select
                    onValueChange={(status) =>
                        searchFieldName("status", status)
                    }
                    value={queryParams?.status ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Road Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("road_condition") && (
                <Select
                    onValueChange={(condition) =>
                        searchFieldName("condition", condition)
                    }
                    value={queryParams?.condition ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Road Condition" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="under_construction">
                            Under Construction
                        </SelectItem>
                        <SelectItem value="impassable">Impassable</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {/* LIVELIHOOD */}
            {isVisible("livelihood_type") && (
                <Select
                    onValueChange={(live) =>
                        searchFieldName("livelihood_type", live)
                    }
                    value={queryParams?.livelihood_type ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Livelihood Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {livelihood_types.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("livelihood_status") && (
                <Select
                    onValueChange={(live) =>
                        searchFieldName("livelihood_status", live)
                    }
                    value={queryParams?.livelihood_status ?? ""}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Livelihood Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("is_main") && (
                <Select
                    onValueChange={(live) => searchFieldName("is_main", live)}
                    value={queryParams.is_main}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Main Livelihood" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* MEDICAL CONDITION */}
            {isVisible("condition_status") && (
                <Select
                    onValueChange={(medCon) =>
                        searchFieldName("condition_status", medCon)
                    }
                    value={queryParams.condition_status}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Condition Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="chronic">Chronic</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* DISABILITIES */}
            {isVisible("disability_type") && (
                <Select
                    onValueChange={(type) =>
                        searchFieldName("disability_type", type)
                    }
                    value={queryParams.disability_type}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Disability Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Visual Impairment">
                            Visual Impairment
                        </SelectItem>
                        <SelectItem value="Hearing Impairment">
                            Hearing Impairment
                        </SelectItem>
                        <SelectItem value="Mobility Impairment">
                            Mobility Impairment
                        </SelectItem>
                        <SelectItem value="Speech/Communication Disorder">
                            Speech/Communication Disorder
                        </SelectItem>
                        <SelectItem value="Intellectual Disability">
                            Intellectual Disability
                        </SelectItem>
                        <SelectItem value="Psychosocial Disability">
                            Psychosocial Disability
                        </SelectItem>
                        <SelectItem value="Chronic Illness-related Disability">
                            Chronic Illness-related Disability
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* MEDICATION */}
            {isVisible("medication") && (
                <Select
                    onValueChange={(med) => searchFieldName("medication", med)}
                    value={queryParams.medication}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Medication" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Paracetamol">Paracetamol</SelectItem>
                        <SelectItem value="Amoxicillin">Amoxicillin</SelectItem>
                        <SelectItem value="Metformin">Metformin</SelectItem>
                        <SelectItem value="Losartan">Losartan</SelectItem>
                        <SelectItem value="Atorvastatin">
                            Atorvastatin
                        </SelectItem>
                        <SelectItem value="Omeprazole">Omeprazole</SelectItem>
                        <SelectItem value="Aspirin">Aspirin</SelectItem>
                        <SelectItem value="Ibuprofen">Ibuprofen</SelectItem>
                        <SelectItem value="Cetirizine">Cetirizine</SelectItem>
                        <SelectItem value="Salbutamol">Salbutamol</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("med_start") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.start_date
                                ? new Date(queryParams.start_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD
                                : "";
                            searchFieldName("start_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date Started"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}
            {isVisible("med_end") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.end_date
                                ? new Date(queryParams.end_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("end_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date Ended"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* VACCINATION */}
            {isVisible("vaccine") && (
                <Select
                    onValueChange={(vac) => searchFieldName("vaccine", vac)}
                    value={queryParams.vaccine}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="COVID-19 (Pfizer)">
                            COVID-19 (Pfizer)
                        </SelectItem>
                        <SelectItem value="COVID-19 (Moderna)">
                            COVID-19 (Moderna)
                        </SelectItem>
                        <SelectItem value="COVID-19 (Sinovac)">
                            COVID-19 (Sinovac)
                        </SelectItem>
                        <SelectItem value="Influenza">Influenza</SelectItem>
                        <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                        <SelectItem value="Measles">Measles</SelectItem>
                        <SelectItem value="Tetanus">Tetanus</SelectItem>
                        <SelectItem value="Polio">Polio</SelectItem>
                        <SelectItem value="Chickenpox">Chickenpox</SelectItem>
                        <SelectItem value="HPV">HPV</SelectItem>
                        <SelectItem value="Anti-Rabies">Anti-Rabies</SelectItem>
                        <SelectItem value="Dengue">Dengue</SelectItem>
                        <SelectItem value="Typhoid">Typhoid</SelectItem>
                        <SelectItem value="Pneumococcal">
                            Pneumococcal
                        </SelectItem>
                        <SelectItem value="Meningococcal">
                            Meningococcal
                        </SelectItem>
                        <SelectItem value="Tuberculosis (BCG)">
                            Tuberculosis (BCG)
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("vaccination_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.vaccination_date
                                ? new Date(queryParams.vaccination_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("vaccination_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm px-2 py-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Vaccination Date"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* ALLERGY */}
            {isVisible("allergy") && (
                <Select
                    onValueChange={(allergy) =>
                        searchFieldName("allergy", allergy)
                    }
                    value={queryParams.allergy}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Allergy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Peanuts">Peanuts</SelectItem>
                        <SelectItem value="Shellfish">Shellfish</SelectItem>
                        <SelectItem value="Dust Mites">Dust Mites</SelectItem>
                        <SelectItem value="Pollen">Pollen</SelectItem>
                        <SelectItem value="Milk">Milk</SelectItem>
                        <SelectItem value="Eggs">Eggs</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Soy">Soy</SelectItem>
                        <SelectItem value="Latex">Latex</SelectItem>
                        <SelectItem value="Bee Stings">Bee Stings</SelectItem>
                        <SelectItem value="Penicillin">Penicillin</SelectItem>
                        <SelectItem value="Aspirin">Aspirin</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* PREGNANCY */}
            {isVisible("pregnancy_status") && (
                <Select
                    onValueChange={(status) =>
                        searchFieldName("pregnancy_status", status)
                    }
                    value={queryParams.pregnancy_status}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pregnancy Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="miscarried">Miscarried</SelectItem>
                        <SelectItem value="aborted">Aborted</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("expected_due_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.expected_due_date
                                ? new Date(queryParams.expected_due_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("expected_due_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Expected Due Date"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}
            {isVisible("delivery_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.delivery_date
                                ? new Date(queryParams.delivery_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("delivery_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Delivery Date"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* DEATH */}
            {isVisible("date_of_death") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.date_of_death
                                ? new Date(queryParams.date_of_death)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("date_of_death", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date of Death"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* INVENTORIES */}
            {isVisible("inventory_status") && (
                <Select
                    onValueChange={(status) =>
                        searchFieldName("status", status)
                    }
                    value={queryParams.status}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">
                            Out of Stock
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("item_category") && (
                <Select
                    onValueChange={(inv) =>
                        searchFieldName("item_category", inv)
                    }
                    value={queryParams?.item_category ?? ""}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Item Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {types.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("date_recieved") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.date_recieved
                                ? new Date(queryParams.date_recieved)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("date_recieved", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date Recieved "
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* Blotter Reports */}
            {isVisible("incident_type") && (
                <Select
                    onValueChange={(incident) =>
                        searchFieldName("incident_type", incident)
                    }
                    value={queryParams?.incident_type ?? ""}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Incident Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {types.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {isVisible("incident_date") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.incident_date
                                ? new Date(queryParams.incident_date)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA") // YYYY-MM-DD format
                                : "";
                            searchFieldName("incident_date", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[180px] text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                        placeholderText="Date of Incident "
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                        isClearable
                    />
                </div>
            )}

            {/* CHILD HEALTH */}
            {isVisible("immunization") && (
                <Select
                    onValueChange={(immunization) =>
                        searchFieldName("immunization", immunization)
                    }
                    value={queryParams?.immunization ?? ""}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Immunization Updated?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* SUMMON */}
            {isVisible("summon_status") && (
                <Select
                    onValueChange={(summon_status) =>
                        searchFieldName("summon_status", summon_status)
                    }
                    value={queryParams.summon_status}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Summon Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="on_going">On Going</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            )}
            {isVisible("hearing_number") && (
                <Select
                    onValueChange={(hearing_number) =>
                        searchFieldName("hearing_number", hearing_number)
                    }
                    value={queryParams.hearing_number}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Hearing No." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">Hearing 1</SelectItem>
                        <SelectItem value="2">Hearing 2</SelectItem>
                        <SelectItem value="3">Hearing 3</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("hearing_status") && (
                <Select
                    onValueChange={(hearing_status) =>
                        searchFieldName("hearing_status", hearing_status)
                    }
                    value={queryParams.hearing_status}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Hearing Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="adjourned">Adjourned</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("created_at") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.created_at
                                ? new Date(queryParams.created_at)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("created_at", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-200 shadow-sm rounded px-2 py-1 w-[180px]"
                        placeholderText="Created At"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                    />
                </div>
            )}
            {/* Filter by Updated At */}
            {isVisible("updated_at") && (
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={
                            queryParams.updated_at
                                ? new Date(queryParams.updated_at)
                                : null
                        }
                        onChange={(date) => {
                            const formatted = date
                                ? date.toLocaleDateString("en-CA")
                                : "";
                            searchFieldName("updated_at", formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-200 shadow-sm rounded px-2 py-1 w-[180px]"
                        placeholderText="Updated At"
                        popperContainer={({ children }) => (
                            <div className="z-[9999]">{children}</div>
                        )}
                    />
                </div>
            )}
            {/* Clear Filters Button */}
            {clearRouteAxios ? (
                <div className="flex justify-end ml-auto">
                    <ClearFilterButton2
                        setQueryParams={setQueryParams}
                        setQuery={setQuery}
                    />
                </div>
            ) : (
                <div className="flex justify-end ml-auto">
                    <ClearFilterButton
                        routeName={clearRouteName}
                        routeParams={clearRouteParams}
                    />
                </div>
            )}
            {/* <div className="flex justify-end ml-auto">
                <ClearFilterButton
                    routeName={householdId ? "household.show" : "household.index"}
                    routeParams={householdId ? { household: householdId } : {}}
                />
            </div> */}
        </div>
    );
};

export default FilterToggle;
