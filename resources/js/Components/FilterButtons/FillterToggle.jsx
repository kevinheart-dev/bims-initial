import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ClearFilterButton from "@/Components/ClearFiltersButton";
import { INCOME_BRACKETS } from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";


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
    months = [],
    clearRouteName = '',
    clearRouteParams = {}
}) => {
    const isVisible = (key) => visibleFilters.includes(key);

    if (!showOnlyFilters && !showFilters) return null;

    const [openWelfare, setOpenWelfare] = useState(false);
    const welfareRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (welfareRef.current && !welfareRef.current.contains(event.target)) {
                setOpenWelfare(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="flex flex-wrap gap-2 items-center mb-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-1 mt-2">
            {isVisible("gender") && (
                <Select onValueChange={(v) => searchFieldName("gender", v)} value={queryParams.gender}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="LGBTQ">LGBTQ+</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("age_group") && (
                <Select onValueChange={(v) => searchFieldName("age_group", v)} value={queryParams.age_group}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="child">0 - 12 (Child)</SelectItem>
                        <SelectItem value="teen">13 - 17 (Teen)</SelectItem>
                        <SelectItem value="young_adult">18 - 25 (Young Adult)</SelectItem>
                        <SelectItem value="adult">26 - 59 (Adult)</SelectItem>
                        <SelectItem value="senior">60+ (Senior)</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("relation") && (
                <Select onValueChange={(v) => searchFieldName("relation", v)} value={queryParams.relation}>
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
                <Select onValueChange={(v) => searchFieldName("household_position", v)} value={queryParams.household_position}>
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
                <Select onValueChange={(v) => searchFieldName("estatus", v)} value={queryParams.estatus}>
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("voter_status") && (
                <Select onValueChange={(v) => searchFieldName("voter_status", v)} value={queryParams.voter_status}>
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
                <Select onValueChange={(v) => searchFieldName("is_pwd", v)} value={queryParams.is_pwd}>
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


            {/* ==== INDEX FILLTER ====*/}

            {isVisible("purok") && (
                <Select onValueChange={(v) => searchFieldName("purok", v)} value={queryParams.purok}>
                    <SelectTrigger className="w-[95px]">
                        <SelectValue placeholder="Purok" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {puroks.map((p, idx) => (
                            <SelectItem key={idx} value={p.toString()}>Purok {p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {isVisible("street") && (
                <Select onValueChange={(v) => searchFieldName("street", v)} value={queryParams.street}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Street" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {streets.map((s, idx) => (
                            <SelectItem key={idx} value={s.toString()}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {isVisible("own_type") && (
                <Select onValueChange={(v) => searchFieldName("own_type", v)} value={queryParams.own_type}>
                    <SelectTrigger className="w-[160px] text-sm">
                        <SelectValue placeholder="Ownership Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                        <SelectItem value="government_provided">Gov’t Provided</SelectItem>
                        <SelectItem value="inherited">Inherited</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                </Select>
            )}


            {isVisible("condition") && (
                <Select onValueChange={(v) => searchFieldName("condition", v)} value={queryParams.condition}>
                    <SelectTrigger className="w-[140px] text-sm">
                        <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="needs_repair">Needs Repair</SelectItem>
                        <SelectItem value="delapitated">Dilapidated</SelectItem>
                    </SelectContent>
                </Select>
            )}


            {isVisible("structure") && (
                <Select onValueChange={(v) => searchFieldName("structure", v)} value={queryParams.structure}>
                    <SelectTrigger className="w-[150px] text-sm">
                        <SelectValue placeholder="Structure" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="semi_concrete">Semi Concrete</SelectItem>
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
                        <SelectItem value="single_parent">Single-Parent</SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                        <SelectItem value="stepfamilies">Separated</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="childless">Childless</SelectItem>
                        <SelectItem value="cohabiting_partners">Cohabiting Partners</SelectItem>
                        <SelectItem value="one_person_household">One-Person Household</SelectItem>
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
                        {Object.entries(INCOME_BRACKETS).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}


            {/* SENIOR INDEX */}

            {isVisible("is_pensioner") && (
                <Select onValueChange={(v) => searchFieldName("is_pensioner", v)} value={queryParams.is_pensioner}>
                    <SelectTrigger className="w-[125px]">
                        <SelectValue placeholder="Is Pensioner" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {isVisible("pension_type") && (
                <Select onValueChange={(v) => searchFieldName("pension_type", v)} value={queryParams.pension_type}>
                    <SelectTrigger className="w-[125px]">
                        <SelectValue placeholder="Pension Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {pensionTypes.map((p, i) => (
                            <SelectItem key={i} value={p.value}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {isVisible("living_alone") && (
                <Select onValueChange={(v) => searchFieldName("living_alone", v)} value={queryParams.living_alone}>
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
                <Select onValueChange={(v) => searchFieldName("birth_month", v)} value={queryParams.birth_month}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Birth Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {months.map((m, i) => (
                            <SelectItem key={i} value={m.value}>{m.label}</SelectItem>
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

            {(isVisible("pwd") || isVisible("fourps") || isVisible("solo_parent")) && (
                <div className="relative inline-block text-left w-56" ref={welfareRef}>
                    <button
                        onClick={() => setOpenWelfare(!openWelfare)}
                        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                        Social Welfare Filter
                        <svg
                            className={`ml-2 h-5 w-5 transition-transform duration-200 ${openWelfare ? "rotate-180" : ""
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
                                                searchFieldName("pwd", checked ? "1" : "0")
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
                                                searchFieldName("fourps", checked ? "1" : "0")
                                            }
                                        />
                                        <span>4ps Beneficiary</span>
                                    </label>
                                )}
                                {isVisible("solo_parent") && (
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="solo-parent-checkbox"
                                            checked={queryParams.solo_parent === "1"}
                                            onCheckedChange={(checked) =>
                                                searchFieldName("solo_parent", checked ? "1" : "0")
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
                <Select onValueChange={(v) => searchFieldName("v_type", v)} value={queryParams.v_type}>
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
                <Select onValueChange={(v) => searchFieldName("v_class", v)} value={queryParams.v_class}>
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
                <Select onValueChange={(v) => searchFieldName("usage", v)} value={queryParams.usage}>
                    <SelectTrigger className="w-[135px]">
                        <SelectValue placeholder="Vehicle Usage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="public_transport">Public Transport</SelectItem>
                        <SelectItem value="business_use">Business Use</SelectItem>
                    </SelectContent>
                </Select>
            )}

            <div className="flex justify-end ml-auto">
                <ClearFilterButton
                    routeName={clearRouteName}
                    routeParams={clearRouteParams}
                />
            </div>




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
