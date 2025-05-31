import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";

const Summary = ({ onBack, onSubmit }) => {
    const { userData } = useContext(StepperContext);
    const members = userData.members || [];

    const wasteManagementLabels = {
        open_dump_site: 'Open Dump Site',
        sanitary_landfill: 'Sanitary Landfill',
        compost_pits: 'Compost Pits',
        material_recovery_facility: 'Material Recovery Facility',
        garbage_is_collected: 'Garbage is Collected',
        none: 'None',
    };


    return (
        <section className="max-w-7xl mx-auto p-6">
            <header>
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                    Review Your Information
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                    Kindly ensure all your details are accurate before
                    submitting.
                </p>
            </header>

            {/* Household Address Section */}
<<<<<<< HEAD
            <section
                aria-labelledby="household-address-heading"
                className="mb-10"
            >
                <h3
                    id="household-address-heading"
                    className="text-2xl font-semibold mb-3"
                >
=======
            <section aria-labelledby="household-address-heading" className="mb-10">
                <h3 id="household-address-heading" className="text-2xl font-semibold mb-3">
>>>>>>> 4ddf36496d3cd99c016ee2a16feac25681f1f9b7
                    Household Address
                </h3>
                <hr className="h-px bg-sky-500 border-0 mb-6" />
                <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-700">
                    {[
                        {
                            label: "House/Lot/Unit No.",
                            value: userData.housenumber,
                        },
                        { label: "Street Name", value: userData.street },
                        {
                            label: "Subdivision/Village/Compound",
                            value: userData.subdivision,
                        },
                        {
                            label: "Purok/Zone/Sitio/Cabisera",
                            value: userData.purok,
                        },
                    ].map(({ label, value }, i) => (
                        <p key={i} className="break-words">
                            <span className="font-semibold text-gray-600">
                                {label}:
                            </span>{" "}
                            <span className="font-bold text-gray-900">
                                {value || " "}
                            </span>
                        </p>
                    ))}
                </div>
            </section>

            {/* Household Members Section */}
<<<<<<< HEAD
            <section
                aria-labelledby="household-members-heading"
                className="mb-10"
            >
                <h3
                    id="household-members-heading"
                    className="text-2xl font-semibold mb-3"
                >
=======
            <section aria-labelledby="household-members-heading" className="mb-10">
                <h3 id="household-members-heading" className="text-2xl font-semibold mb-3">
>>>>>>> 4ddf36496d3cd99c016ee2a16feac25681f1f9b7
                    Household Members
                </h3>
                <hr className="h-px bg-sky-500 border-0 mb-6" />

                {members.length === 0 ? (
                    <p className="text-gray-500 italic">
                        No household member information provided.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {members.map((member, index) => (
                            <article
                                key={index}
                                className="p-6 border rounded-lg shadow-sm bg-gray-50"
                                aria-labelledby={`member-${index + 1}-heading`}
                            >
                                <h4
                                    id={`member-${index + 1}-heading`}
                                    className="text-xl font-semibold mb-4 text-gray-800"
                                >
                                    Personal Information member {index + 1}
                                </h4>
                                <div className="grid md:grid-cols-3 gap-x-8 gap-y-4 text-sm text-gray-700">
                                    {[
<<<<<<< HEAD
                                        {
                                            label: "Full Name",
                                            value: `${member.firstname} ${member.middlename} ${member.lastname} ${member.suffix}`.trim(),
                                        },
                                        {
                                            label: "Birth Date",
                                            value: member.birthdate,
                                        },
                                        {
                                            label: "Birth Place",
                                            value: member.birthplace,
                                        },
                                        {
                                            label: "Civil Status",
                                            value: member.civil_status,
                                        },
                                        {
                                            label: "Gender",
                                            value: member.gender,
                                        },
                                        {
                                            label: "Maiden Middle Name",
                                            value: member.maiden_middle_name,
                                        },
                                        {
                                            label: "Religion",
                                            value: member.religion,
                                        },
                                        {
                                            label: "Ethnicity",
                                            value: member.ethnicity,
                                        },
                                        {
                                            label: "Citizenship",
                                            value: member.citizenship,
                                        },
                                        {
                                            label: "Contact Number",
                                            value: member.contactNumber,
                                        },
                                        { label: "Email", value: member.email },
                                        // Education
                                        {
                                            label: "Highest Education Attained",
                                            value: member.education,
                                        },
                                        {
                                            label: "Education Status",
                                            value: member.education_status,
                                        },
                                        {
                                            label: "Out of School Children",
                                            value: member.osc,
                                        },
                                        {
                                            label: "Out of School Youth",
                                            value: member.osy,
                                        },
                                        {
                                            label: "Year started",
                                            value: member.year_strated,
                                        },
                                        {
                                            label: "Year ended",
                                            value: member.year_ended,
                                        },
                                        {
                                            label: "Year graduated",
                                            value: member.year_graduated,
                                        },
                                        {
                                            label: "School Name",
                                            value: member.school_name,
                                        },
                                        {
                                            label: "School Type",
                                            value: member.school_type,
                                        },
                                        {
                                            label: "Course/Strand",
                                            value: member.program,
                                        },
                                        // Occupation
                                        {
                                            label: "Occupation",
                                            value: member.occupation,
                                        },
                                        {
                                            label: "Employement status",
                                            value: member.employment_status,
                                        },
                                        {
                                            label: "Employment type",
                                            value: member.employment_type,
                                        },
                                        {
                                            label: "Occupation Status",
                                            value: member.occupation_status,
                                        },
                                        {
                                            label: "Work arrangement",
                                            vaue: member.work_arrangement,
                                        },
                                        {
                                            label: "Employer name",
                                            value: member.employer,
                                        },
                                        {
                                            label: "Year started",
                                            value: member.year_started,
                                        },
                                        {
                                            label: "Year ended",
                                            value: member.year_ended,
                                        },
                                        {
                                            label: "Monthly income",
                                            value: member.monthly_income,
                                        },
=======
                                        { label: 'Full Name', value: `${member.firstname} ${member.middlename} ${member.lastname} ${member.suffix}`.trim() },
                                        { label: 'Birth Date', value: member.birthdate },
                                        { label: 'Birth Place', value: member.birthplace },
                                        { label: 'Civil Status', value: member.civil_status },
                                        { label: 'Gender', value: member.gender },
                                        { label: 'Maiden Middle Name', value: member.maiden_middle_name },
                                        { label: 'Religion', value: member.religion },
                                        { label: 'Ethnicity', value: member.ethnicity },
                                        { label: 'Citizenship', value: member.citizenship },
                                        { label: 'Contact Number', value: member.contactNumber },
                                        { label: 'Email', value: member.email },

                                        { label: 'Highest Education Attained', value: member.education },
                                        { label: 'Education Status', value: member.education_status },
                                        { label: 'Out of School Children', value: member.osc },
                                        { label: 'Out of School Youth', value: member.osy },
                                        { label: 'Year started', value: member.year_strated },
                                        { label: 'Year ended', value: member.year_ended },
                                        { label: 'Year graduated', value: member.year_graduated },
                                        { label: 'School Name', value: member.school_name },
                                        { label: 'School Type', value: member.school_type },
                                        { label: 'Course/Strand', value: member.program },

                                        { label: 'Occupation', value: member.occupation },
                                        { label: 'Employement status', value: member.employment_status },
                                        { label: 'Employment type', value: member.employment_type },
                                        { label: 'Occupation Status', value: member.occupation_status },
                                        { label: 'Work arrangement', value: member.work_arrangement },
                                        { label: 'Employer name', value: member.employer },
                                        { label: 'Year started', value: member.year_started },
                                        { label: 'Year ended', value: member.year_ended },
                                        { label: 'Monthly income', value: member.monthly_income },
>>>>>>> 4ddf36496d3cd99c016ee2a16feac25681f1f9b7
                                    ].map(({ label, value }, i) => (
                                        <React.Fragment key={i}>
                                            {i === 11 && (
                                                <div className="col-span-full border-t border-gray-300 my-2">
                                                    <h2 className="text-base font-semibold mt-4 text-gray-800">
                                                        Educational Background
                                                    </h2>
                                                </div>
                                            )}
                                            {i === 21 && (
                                                <div className="col-span-full border-t border-gray-300 my-2">
                                                    <h2 className="text-base font-semibold mt-4 text-gray-800">
                                                        Occupation
                                                    </h2>
                                                </div>
                                            )}
<<<<<<< HEAD
                                            <p className="wrap-break-word">
                                                <span className="font-semibold text-gray-500">
                                                    {label}:
                                                </span>{" "}
                                                <span className="font-bold text-gray-900">
                                                    {value || " "}
                                                </span>
=======
                                            <p className="break-words">
                                                <span className="font-semibold text-gray-500">{label}:</span>{' '}
                                                <span className="font-bold text-gray-900">{value || ' '}</span>
>>>>>>> 4ddf36496d3cd99c016ee2a16feac25681f1f9b7
                                            </p>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
<<<<<<< HEAD
=======

            {/* House Information Section */}
            <section aria-labelledby="house-information-heading" className="mb-10">
                <h3 id="house-information-heading" className="text-2xl font-semibold mb-3">
                    House Information
                </h3>
                <hr className="h-px bg-sky-500 border-0 mb-6" />
                <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-700">
                    {[
                        { label: 'Ownership Type', value: userData.ownership_value },
                        { label: 'House Condition', value: userData.housing_condition },
                        { label: 'House Structure', value: userData.house_structure },
                        { label: 'Year Establish', value: userData.year_establish },
                        { label: 'Number of rooms', value: userData.number_of_rooms },
                        { label: 'Number of Floors', value: userData.number_of_floors },
                        { label: 'Bath and Wash Area', value: userData.bath_and_wash_area },
                        { label: 'Type of Toilet', value: userData.toilet_type },
                        { label: 'Source of Electricity', value: userData.electricity_type },
                        { label: 'Water Source', value: userData.water_source_type },
                        {
                            label: 'Waste Disposal',
                            value: wasteManagementLabels[userData.waste_management_type] || userData.waste_management_type,
                        },
                        { label: 'Internet Connection', value: userData.type_of_internet },
                    ].map(({ label, value }, i) => (
                        <p key={i} className="break-words">
                            <span className="font-semibold text-gray-600">{label}:</span>{' '}
                            <span className="font-bold text-gray-900">{value || ' '}</span>
                        </p>
                    ))}
                </div>
            </section>
>>>>>>> 4ddf36496d3cd99c016ee2a16feac25681f1f9b7
        </section>
    );
};

export default Summary;
