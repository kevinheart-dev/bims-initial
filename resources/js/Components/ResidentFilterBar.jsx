import React from "react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import ClearFilterButton from "@/Components/ClearFiltersButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";

const ResidentFilterBar = ({ queryParams, searchFieldName, puroks }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="w-full flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-4">
            {/* Filters Container */}
            <div className="flex flex-wrap gap-2 w-full">
                {/* Age Group Filter */}
                <Select
                    onValueChange={(value) =>
                        searchFieldName("age_group", value)
                    }
                    value={queryParams.age_group}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="child">0 - 12 (Child)</SelectItem>
                        <SelectItem value="teen">13 - 17 (Teen)</SelectItem>
                        <SelectItem value="young_adult">
                            18 - 25 (Young Adult)
                        </SelectItem>
                        <SelectItem value="adult">26 - 59 (Adult)</SelectItem>
                        <SelectItem value="senior">60+ (Senior)</SelectItem>
                    </SelectContent>
                </Select>

                {/* Employment Status Filter */}
                <Select
                    onValueChange={(value) => searchFieldName("estatus", value)}
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
                    </SelectContent>
                </Select>

                {/* Civil Status Filter */}
                <Select
                    onValueChange={(value) => searchFieldName("cstatus", value)}
                    value={queryParams.cstatus}
                >
                    <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="Civil Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="divorce">Divorce</SelectItem>
                        <SelectItem value="anulled">Anulled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Voter Status Filter */}
                <Select
                    onValueChange={(value) =>
                        searchFieldName("voter_status", value)
                    }
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

                {/* Sex Filter */}
                <Select
                    onValueChange={(value) => searchFieldName("sex", value)}
                    value={queryParams.sex}
                >
                    <SelectTrigger className="w-[105px]">
                        <SelectValue placeholder="Sex" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="LGBTQ">LGBTQ+</SelectItem>
                    </SelectContent>
                </Select>

                {/* Purok Filter */}
                <Select
                    onValueChange={(value) => searchFieldName("purok", value)}
                    value={queryParams.purok}
                >
                    <SelectTrigger className="w-[95px]">
                        <SelectValue placeholder="Purok" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {puroks.map((purok, index) => (
                            <SelectItem key={index} value={purok.toString()}>
                                Purok {purok}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Social Welfare Filter Dropdown */}
                <div className="relative inline-block text-left w-56" ref={ref}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                        Social Welfare Filter
                        <svg
                            className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                                open ? "rotate-180" : ""
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

                    {open && (
                        <div className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg z-50 max-h-60 overflow-auto">
                            <div className="py-2 px-4 space-y-2">
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
                                {/* <label className="flex items-center space-x-2 cursor-pointer">
                                    <Checkbox
                                        id="indigent-checkbox"
                                        checked={queryParams.indigent === "1"}
                                        onCheckedChange={(checked) =>
                                            searchFieldName(
                                                "indigent",
                                                checked ? "1" : "0"
                                            )
                                        }
                                    />
                                    <span>Indigent</span>
                                </label> */}
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
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Clear Filter Button */}
            <div className="flex justify-end">
                <ClearFilterButton route={"resident.index"} />
            </div>
        </div>
    );
};

export default ResidentFilterBar;
