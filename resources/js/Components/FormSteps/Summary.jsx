import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import { HOUSEHOLD_WATER_SOURCE_TEXT, HOUSEHOLD_BATH_WASH_TEXT, HOUSEHOLD_TOILET_TYPE_TEXT, HOUSEHOLD_ELECTRICITY_TYPE, HOUSEHOLD_WASTE_DISPOSAL_TEXT, HOUSEHOLD_INTERNET_TYPE_TEXT } from "@/constants";

const Summary = ({ onBack, onSubmit }) => {
    const { userData } = useContext(StepperContext);
    const members = userData.members || [];


    const renderDetail = (label, value) => (
        <div className="flex flex-col mb-1.5">
            <span className="font-semibold text-gray-600 text-xs md:text-sm">{label}:</span>
            <span className="font-medium text-gray-900 text-sm md:text-base break-words mt-0.5">{value || "N/A"}</span>
        </div>
    );

    return (
        <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Review Your Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Please review your details carefully before submission.
            </p>
            <hr className="my-8 border-t border-blue-200" /> {/* Thinner, softer hr, less vertical margin */}

            {/* Household Address Section */}
            <section aria-labelledby="household-address-heading" className="mb-8"> {/* Reduced margin-bottom */}
                <h6 id="household-address-heading" className="text-md md:text-2xl font-semibold text-gray-800 mb-4 border-l-3 border-blue-500 pl-3"> {/* Smaller, lighter border */}
                    Household Address
                </h6>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"> {/* Reduced gaps */}
                    {renderDetail("House/Lot/Unit No.", userData.housenumber)}
                    {renderDetail("Street Name", userData.street)}
                    {renderDetail("Subdivision/Village/Compound", userData.subdivision)}
                    {renderDetail("Purok/Zone/Sitio/Cabisera", userData.purok)}
                </div>
            </section>

            <hr className="my-8 border-t border-blue-200" />

            <section aria-labelledby="household-members-heading" className="mb-8">
                <h6 id="household-members-heading" className="text-md md:text-2xl font-semibold text-gray-800 mb-4 border-l-3 border-blue-500 pl-3">
                    Household Members
                </h6>

                {members.length === 0 ? (
                    <p className="text-gray-500 italic p-4 bg-gray-50 rounded-md text-center text-sm">
                        No household member information provided.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {members.map((member, index) => (
                            <article key={index} className="p-5 border border-blue-100 rounded-lg shadow-sm bg-white"
                                aria-labelledby={`member-${index + 1}-heading`}>

                                <h4 id={`member-${index + 1}-heading`} className="text-lg md:text-xl font-bold text-blue-700 mb-4 pb-2 border-b border-blue-300">
                                    Member {index + 1}: {`${member.firstname || ''} ${member.lastname || ''}`.trim() || 'No Name Provided'}
                                </h4>
                                <div className="space-y-6">

                                    <div>
                                        <h5 className="text-normal md:text-lg font-semibold text-gray-700 mb-3">Personal Information</h5> {/* Smaller sub-heading */}
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                                            {renderDetail("Full Name", `${member.firstname || ''} ${member.middlename || ''} ${member.lastname || ''} ${member.suffix || ''}`.trim())}
                                            {renderDetail("Birth Date", member.birthdate)}
                                            {renderDetail("Birth Place", member.birthplace)}
                                            {renderDetail("Civil Status", member.civil_status)}
                                            {renderDetail("Gender", member.gender)}

                                            {['female', 'LGBTQIA+'].includes(member.gender) &&
                                                ['Married', 'Widowed', 'Separated'].includes(member.civil_status) && (<>
                                                    {renderDetail("Maiden Middle Name", member.maiden_middle_name)}
                                                </>)}
                                            {renderDetail("Religion", member.religion)}
                                            {renderDetail("Ethnicity", member.ethnicity)}
                                            {renderDetail("Citizenship", member.citizenship)}
                                            {renderDetail("Contact Number", member.contactNumber)}
                                            {renderDetail("Email", member.email)}

                                            {member.age >= 60 && (
                                                <>
                                                    {renderDetail("OSCA ID", member.osca_id_number)}
                                                    {renderDetail("Pension type", member.pension_type)}
                                                    {renderDetail("Living aline", member.living_alone)}
                                                </>
                                            )}

                                        </div>
                                    </div>

                                    {/* Educational Background */}
                                    <div>
                                        <h5 className="text-normal md:text-lg font-semibold text-gray-700 mb-3 pt-4 border-t border-gray-200">Educational Background</h5> {/* Smaller sub-heading, less top padding */}
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"> {/* Reduced gaps */}
                                            {renderDetail("Highest Education Attained", member.education)}
                                            {renderDetail("Education Status", member.education_status)}
                                            {renderDetail("Out of School Children", member.osc)}
                                            {renderDetail("Out of School Youth", member.osy)}
                                            {renderDetail("Year Started", member.year_started)}
                                            {renderDetail("Year Ended", member.year_ended)}
                                            {renderDetail("Year Graduated", member.year_graduated)}
                                            {renderDetail("School Name", member.school_name)}
                                            {renderDetail("School Type", member.school_type)}
                                            {renderDetail("Course/Strand", member.program)}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-normal md:text-lg font-semibold text-gray-500 mb-3 pt-4 border-t border-gray-200">Medical Background</div>

                                    </div>

                                    {/* Occupations */}
                                    <div>
                                        <h5 className="text-normal md:text-lg font-semibold text-gray-700 mb-3 pt-4 border-t border-gray-200">Occupations</h5> {/* Smaller sub-heading, less top padding */}
                                        {member.occupations && member.occupations.length > 0 ? (
                                            <div className="space-y-5">
                                                {member.occupations.map((occupation, occIndex) => (
                                                    <div key={occIndex} className="p-4 bg-blue-50 rounded-md border border-blue-100">
                                                        <h6 className="text-sm md:text-base font-semibold text-blue-600 mb-3 pb-1 border-b border-blue-200">Occupation {occIndex + 1}</h6>
                                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
                                                            {renderDetail("Occupation", occupation.occupation)}
                                                            {renderDetail("Employment Status", occupation.employment_status)}
                                                            {renderDetail("Employment Type", occupation.employment_type)}
                                                            {renderDetail("Occupation Status", occupation.occupation_status)}
                                                            {renderDetail("Work Arrangement", occupation.work_arrangement)}
                                                            {renderDetail("Employer Name", occupation.employer)}
                                                            {renderDetail("Year Started", occupation.started_at)}
                                                            {renderDetail("Year Ended", occupation.ended_at)}
                                                            {renderDetail("Monthly Income", occupation.monthly_income)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-md text-center text-sm">
                                                No occupation information provided.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <hr className="my-8 border-t border-blue-200" />

            {/* House Information Section */}
            <section aria-labelledby="house-information-heading" className="mb-8"> {/* Reduced margin-bottom */}
                <h6 id="house-information-heading" className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 border-l-3 border-blue-500 pl-3">
                    House Information
                </h6>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"> {/* Reduced gaps */}
                    {renderDetail("Ownership Type", userData.ownership_type)}
                    {renderDetail("House Condition", userData.housing_condition)}
                    {renderDetail("House Structure", userData.house_structure)}
                    {renderDetail("Year Establish", userData.year_establish)}
                    {renderDetail("Number of rooms", userData.number_of_rooms)}
                    {renderDetail("Number of Floors", userData.number_of_floors)}
                    {renderDetail("Bath and Wash Area", HOUSEHOLD_BATH_WASH_TEXT[userData.bath_and_wash_area])}
                    {renderDetail("Type of Toilet", HOUSEHOLD_TOILET_TYPE_TEXT[userData.toilet_type])}
                    {renderDetail("Source of Electricity", HOUSEHOLD_ELECTRICITY_TYPE[userData.electricity_type])}
                    {renderDetail("Water Source", HOUSEHOLD_WATER_SOURCE_TEXT[userData.water_source_type])}
                    {renderDetail("Waste Disposal", HOUSEHOLD_WASTE_DISPOSAL_TEXT[userData.waste_management_type])}
                    {renderDetail("Internet Connection", HOUSEHOLD_INTERNET_TYPE_TEXT[userData.type_of_internet])}
                </div>
            </section>
        </section>
    );
};

export default Summary;
