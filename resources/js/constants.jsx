import { Mars, Venus, VenusAndMars } from "lucide-react";

export const RESIDENT_CIVIL_STATUS_TEXT = {
    single: "Single",
    married: "Married",
    widowed: "Widowed",
    separated: "Separated",
    divorced: "Divorced",
    annulled: "Annulled",
};

export const RESIDENT_EMPLOYMENT_STATUS_TEXT = {
    student: "Student",
    employed: "Employed",
    unemployed: "Unemployed",
    self_employed: "Self Employed",
    retired: "Retired",
};

export const RESIDENT_GENDER_TEXT = {
    male: (
        <>
            <Mars className="inline-block mr-1 w-4 h-4" />
            Male
        </>
    ),
    female: (
        <>
            <Venus className="inline-block mr-1 w-4 h-4" />
            Female
        </>
    ),
    LGBTQ: (
        <>
            <VenusAndMars className="inline-block mr-1 w-4 h-4" />
            LGBTQA+
        </>
    ),
};

export const RESIDENT_GENDER_TEXT2 = {
    male: "Male",
    female: "Female",
    LGBTQ: "LGBTQA+",
};

export const RESIDENT_GENDER_COLOR_CLASS = {
    male: "bg-blue-300",
    female: "bg-red-300",
    LGBTQ: "bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 text-white",
};

export const RESIDENT_ROLE_TEXT = {
    barangay_officer: "Barangay Officer",
    resident: "Resident",
    admin: "Administrator",
    super_admin: "Super Administrator",
};

export const RESIDENT_REGISTER_VOTER_TEXT = {
    0: "Not Eligible",
    1: "Eligible",
};
export const RESIDENT_REGISTER_VOTER_CLASS = {
    0: "p-1 bg-red-500 text-white rounded-lg",
    1: "p-1 bg-green-500 text-white rounded-lg",
};

export const HOUSEHOLD_BATH_WASH_TEXT = {
    with_own_sink_and_bath: "with own sink and bath",
    with_own_sink_only: "with own sink only",
    with_own_bath_only: "with own bath only",
    shared_or_communal: "shared or communa",
    none: "None",
};

export const HOUSEHOLD_TOILET_TYPE_TEXT = {
    water_sealed: "water sealed",
    compost_pit_toilet: "compost pit toilet",
    shared_communal_public_toilet: "shared communal public toilet",
    shared_or_communal: "shared or communal",
    no_latrine: "no latrine",
};

export const HOUSEHOLD_ELECTRICITY_TYPE = {
    distribution_company_iselco_ii: "ISELCO II (Distribution Company)",
    generator: "Generator",
    solar_renewable_energy_source: "Solar / Renewable Energy Source",
    battery: "Battery",
    none: "None",
};

export const HOUSEHOLD_WATER_SOURCE_TEXT = {
    level_ii_water_system: "Level II Water System",
    level_iii_water_system: "Level III Water System",
    deep_well_level_i: "Deep Well Level I",
    artesian_well_level_i: "Artesian Well Level I",
    shallow_well_level_i: "Shallow Well Level I",
    commercial_water_refill_source: "Commercial Water Refill Source",
    none: "None",
};

export const HOUSEHOLD_WASTE_DISPOSAL_TEXT = {
    open_dump_site: "Open Dump Site",
    sanitary_landfill: "Sanitary Landfill",
    compost_pits: "Compost_pits",
    material_recovery_facility: "Material Recovery Facility",
    garbage_is_collected: "Garbage is Collected",
    none: "None",
};

export const HOUSEHOLD_INTERNET_TYPE_TEXT = {
    mobile_data: "Mobile Data",
    wireless_fidelity: "Wi-Fi",
    none: "None",
};
