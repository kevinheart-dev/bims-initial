import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import * as CONSTANTS from "@/constants";
import Checkbox from "../Checkbox";
const Summary = ({ onBack, onSubmit, streets }) => {
    const { userData, setUserData } = useContext(StepperContext);
    const members = userData.members || [];
    const household = userData.household || {
        household_type: "",
        families: [],
    };

    console.log(userData);

    const renderDetail = (label, value) => (
        <div className="flex flex-col min-w-[150px]">
            <span className="text-xs font-medium text-gray-600">{label}</span>
            <span
                className={`text-sm break-words ${!value ? "text-red-500" : "text-gray-900"
                    }`}
            >
                {value || "N/A"}
            </span>
        </div>
    );

    const getStreetName = (streetId) => {
        const street = streets.find((s) => s.id === streetId);
        return street ? street.street_name : "N/A";
    };

    return (
        <section className="space-y-8 p-4 bg-white rounded-md shadow-sm">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                    Review Your Information
                </h2>
                <p className="text-sm text-gray-600">
                    Please review your details carefully before submission.
                </p>
            </div>

            {/* Household Address Section */}
            <section className="border border-gray-200 p-4 rounded-md mb-6">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4">
                    Household Address & Information
                </h6>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Address Info */}
                    <div className="space-y-4">
                        <h6 className="text-md font-semibold text-gray-700">
                            Address
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {renderDetail(
                                "House/Lot/Unit No.",
                                userData.housenumber
                            )}
                            {renderDetail(
                                "Street Name",
                                getStreetName(parseInt(userData.street))
                            )}
                            {renderDetail(
                                "Subdivision/Village",
                                userData.subdivision
                            )}
                            {renderDetail("Purok/Zone/Sitio", userData.purok)}
                        </div>
                    </div>

                    {/* Right Column: Household & Financial Info */}
                    <div className="space-y-4">
                        <h6 className="text-md font-semibold text-gray-700">
                            Household & Financial Info
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderDetail(
                                "Household Type",
                                CONSTANTS.FAMILY_TYPE_TEXT[household.household_type]
                            )}
                            {renderDetail(
                                "No. of Household Members",
                                household.household_count
                            )}

                            {renderDetail(
                                "Family Monthly Income",
                                `₱${userData.household?.family_monthly_income?.toLocaleString() || "0"}`
                            )}

                            {renderDetail(
                                "Income Bracket",
                                CONSTANTS.INCOME_BRACKET_TEXT[userData.household?.income_bracket] || "N/A"
                            )}

                            {renderDetail(
                                "Income Category",
                                CONSTANTS.INCOME_CATEGORY_TEXT[userData.household?.income_category] || "N/A"
                            )}
                        </div>
                    </div>
                </div>
            </section>



            {/* Household Members */}
            <section className="space-y-6">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
                    Household Members
                </h6>

                {(!household.families || household.families.length === 0) ? (
                    <p className="text-gray-500 italic bg-gray-50 p-4 rounded text-sm text-center">
                        No household member information provided.
                    </p>
                ) : (
                    household.families.map((family, fIndex) => (
                        <div key={fIndex} className="space-y-4 border rounded-md shadow-md p-4 bg-gray-50">

                            <h5 className="text-md font-bold text-blue-800">
                                {family.family_name || `Family ${fIndex + 1}`} Family
                            </h5>

                            {/* Members of this family */}
                            {(!family.members || family.members.length === 0) ? (
                                <p className="text-gray-500 italic text-sm">
                                    No members added for this family.
                                </p>
                            ) : (
                                family.members.map((member, mIndex) => (
                                    <details
                                        key={mIndex}
                                        className="border rounded-md shadow-sm bg-white"
                                    >
                                        <summary className="px-4 py-2 text-blue-700 font-semibold cursor-pointer">
                                            Member {mIndex + 1}:{" "}
                                            {`${member.firstname || ""} ${member.lastname || ""}`.trim() ||
                                                "No Name Provided"}
                                        </summary>

                                        <div className="p-4 space-y-4">
                                            <div className="border-b pb-4">
                                                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Personal Information
                                                </h5>

                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    {/* Left: Image */}
                                                    <div className="flex-shrink-0">
                                                        {member.resident_image ? (
                                                            <img
                                                                src={
                                                                    member.resident_image instanceof
                                                                        File
                                                                        ? URL.createObjectURL(
                                                                            member.resident_image
                                                                        )
                                                                        : member.resident_image
                                                                }
                                                                alt="Resident"
                                                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                                            />
                                                        ) : (
                                                            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-sm text-gray-500 rounded-md border border-gray-300">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Info beside the image */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow">
                                                        {renderDetail(
                                                            "Full Name",
                                                            `${member.firstname || ""} ${member.middlename || ""
                                                                } ${member.lastname || ""} ${member.suffix || ""
                                                                }`.trim()
                                                        )}
                                                        {renderDetail("Birth Date", member.birthdate)}
                                                        {renderDetail("Birth Place", member.birthplace)}
                                                        {renderDetail("Civil Status", CONSTANTS.RESIDENT_CIVIL_STATUS_TEXT[member.civil_status])}
                                                        {renderDetail("Sex", CONSTANTS.RESIDENT_GENDER_TEXT2[member.sex])}
                                                        {renderDetail("Gender", CONSTANTS.RESIDENT_GENDER_TEXT2[member.gender])}
                                                        {["female"].includes(CONSTANTS.RESIDENT_GENDER_TEXT2[member.sex]) &&
                                                            ["married", "widowed", "separated",].includes(member.civil_status) &&
                                                            renderDetail("Maiden Middle Name", member.maiden_middle_name)}
                                                        {renderDetail("Religion", member.religion)}
                                                        {renderDetail("Ethnicity", member.ethnicity)}
                                                        {renderDetail("Citizenship", member.citizenship)}
                                                        {renderDetail("Contact Number", member.contactNumber)}
                                                        {renderDetail("Email", member.email)}
                                                        {renderDetail("Residency", CONSTANTS.RESIDENT_RECIDENCY_TYPE_TEXT[member.residency_type])}
                                                        {renderDetail("Residency date", member.residency_date)}
                                                        {renderDetail("4Ps Beneficiary", CONSTANTS.RESIDENT_4PS_TEXT[member.is_4ps_benificiary])}
                                                        {renderDetail("Solo Parent", CONSTANTS.RESIDENT_SOLO_PARENT_TEXT[member.is_solo_parent])}
                                                        {member.is_solo_parent == 1 && renderDetail("Solo Parent ID", member.solo_parent_id_number)}
                                                        {renderDetail("Registered Voter", CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT2[member.registered_voter])}
                                                        {member.registered_voter == 1 && renderDetail("Voter ID", member.voter_id_number)}
                                                        {member.registered_voter == 1 && renderDetail("Voting Status", CONSTANTS.RESIDENT_VOTING_STATUS_TEXT[member.voting_status])}
                                                        {member.age >= 60 && renderDetail("Pensioner", CONSTANTS.SENIOR_PESIONER_TEXT[member.is_pensioner])}
                                                        {member.age >= 60 && member.is_pensioner == 1 && renderDetail("OSCA ID", member.osca_id_number)}
                                                        {member.age >= 60 && member.is_pensioner == 1 && renderDetail("Pension Type", member.pension_type)}
                                                        {member.age >= 60 && renderDetail("Living Alone", CONSTANTS.SENIOR_LIVING_ALONE_TEXT[member.living_alone])}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Vehicle Info Section */}
                                            <div className="space-y-3">
                                                <h5 className="text-sm font-semibold text-gray-700">
                                                    Vehicle Information
                                                </h5>

                                                {member.has_vehicle == 1 &&
                                                    member.vehicles?.length > 0 ? (
                                                    <div className={`grid ${member.vehicles.length > 1
                                                        ? "md:grid-cols-2 lg:grid-cols-3"
                                                        : "grid-cols-1"
                                                        } gap-4`}
                                                    >
                                                        {member.vehicles.map(
                                                            (vehicle, vIndex) => (
                                                                <div
                                                                    key={vIndex}
                                                                    className="bg-blue-50 p-4 rounded border border-blue-100"
                                                                >
                                                                    <h6 className="text-sm font-semibold text-blue-700 mb-2">
                                                                        Vehicle{" "}
                                                                        {member.vehicles
                                                                            .length > 1
                                                                            ? vIndex + 1
                                                                            : ""}
                                                                    </h6>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                                        {renderDetail("Vehicle Type", vehicle.vehicle_type)}
                                                                        {renderDetail("Classification", CONSTANTS.VEHICLE_CLASS_TEXT[vehicle.vehicle_class])}
                                                                        {renderDetail("Usage Purpose", CONSTANTS.VEHICLE_USAGE_TEXT[vehicle.usage_status])}
                                                                        {renderDetail("Registered", CONSTANTS.VEHICLE_IS_REGISTERED_TEXT[vehicle.is_registered])}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        No vehicle details provided.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Medical Info */}
                                            <div className="border-b pb-4">
                                                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Education & Medical Information
                                                </h5>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2 border border-gray-200 p-4 rounded-md">
                                                        <h6 className="text-sm font-semibold text-blue-700">
                                                            Educational Background
                                                        </h6>

                                                        {member.educations && member.educations.length > 0 ? (
                                                            <div
                                                                className={`space-y-2 ${member.educations.length > 3 ? "max-h-96 overflow-y-auto" : ""
                                                                    }`}
                                                            >
                                                                {member.educations.map((education, eduIndex) => (
                                                                    <div
                                                                        key={eduIndex}
                                                                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50 p-4 rounded border border-blue-100"
                                                                    >
                                                                        {renderDetail(
                                                                            "Highest Education",
                                                                            CONSTANTS.EDUCATION_LEVEL_TEXT[education.education]
                                                                        )}
                                                                        {education.education !== "no_education_yet" &&
                                                                            education.education !== "no_formal_education" && (
                                                                                <>
                                                                                    {renderDetail(
                                                                                        "Education Status",
                                                                                        CONSTANTS.EDUCATION_STATUS_TEXT[education.educational_status]
                                                                                    )}
                                                                                    {renderDetail(
                                                                                        "School Type",
                                                                                        CONSTANTS.EDUCATION_SCHOOL_TYPE[education.school_type]
                                                                                    )}
                                                                                    {renderDetail("Year Started", education.year_started)}
                                                                                    {education.educational_status !== "enrolled" &&
                                                                                        renderDetail("Year Ended", education.year_ended)}
                                                                                    {renderDetail("School Name", education.school_name)}
                                                                                    {education.education === "college" &&
                                                                                        education.educational_status === "graduate" &&
                                                                                        renderDetail("Course/Strand", education.program)}
                                                                                </>
                                                                            )}
                                                                    </div>

                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">
                                                                No educational background provided.
                                                            </p>
                                                        )}
                                                    </div>


                                                    {/* Right Column: Medical */}
                                                    <div className="space-y-2 border border-gray-200 p-4 rounded-md">
                                                        <h6 className="text-sm font-semibold text-blue-700">
                                                            Medical Background
                                                        </h6>

                                                        {/* Main medical grid */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {renderDetail("Weight (kg)", member.weight_kg)}
                                                            {renderDetail("Height (cm)", member.height_cm)}
                                                            {renderDetail("Nutrition Status", member.nutrition_status)}
                                                            {renderDetail("Blood Type", member.blood_type)}
                                                            {renderDetail("PhilHealth", CONSTANTS.MEDICAL_PHILHEALTH_TEXT[member.has_philhealth])}
                                                            {member.has_philhealth == 1 && renderDetail("PhilHealth ID", member.philhealth_id_number)}
                                                            {renderDetail("Consumes Alcohol", CONSTANTS.MEDICAL_ALCOHOL_TEXT[member.is_alcohol_user])}
                                                            {renderDetail("Smoking", CONSTANTS.MEDICAL_SMOKE_TEXT[member.is_smoker])}
                                                            {renderDetail("PWD", CONSTANTS.MEDICAL_PWD_TEXT[member.is_pwd])}
                                                            {renderDetail("Emergency Contact Name", member.emergency_contact_name)}
                                                            {renderDetail("Emergency Contact Number", member.emergency_contact_number)}
                                                            {renderDetail("Emergency Contact Relationship", member.emergency_contact_relationship)}
                                                        </div>


                                                        {/* Disabilities Section */}
                                                        <div className="mt-4">
                                                            <h6 className="text-sm font-semibold text-gray-700 mb-2">
                                                                Disability Information
                                                            </h6>

                                                            {/* PWD Number if exists */}
                                                            {member.pwd_id_number && (
                                                                <div className="mb-2 text-sm text-gray-800">
                                                                    <span className="font-medium text-gray-600 mr-1">
                                                                        PWD ID Number:
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            member.pwd_id_number
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {member.disabilities &&
                                                                member.disabilities.length >
                                                                0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {member.disabilities.map(
                                                                        (
                                                                            disability,
                                                                            disIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    disIndex
                                                                                }
                                                                                className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700"
                                                                            >
                                                                                {disability.disability_type ||
                                                                                    ""}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm italic text-gray-500">
                                                                    No disability
                                                                    information provided.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="space-y-3">
                                                <h5 className="text-sm font-semibold text-gray-700">
                                                    Occupations and Livelihood Status
                                                </h5>

                                                {member.occupations && member.occupations.length > 0 ? (
                                                    <div
                                                        className={`grid ${member.occupations.length > 1
                                                            ? "md:grid-cols-2"
                                                            : "grid-cols-1"
                                                            } gap-4`}
                                                    >
                                                        {member.occupations.map((occupation, occIndex) => (
                                                            <div
                                                                key={occIndex}
                                                                className="bg-blue-50 p-4 rounded border border-blue-100"
                                                            >
                                                                <h6 className="text-sm font-semibold text-blue-700 mb-2">
                                                                    Occupation {member.occupations.length > 1 ? occIndex + 1 : ""}
                                                                </h6>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                                                                    {renderDetail(
                                                                        "Employment Status",
                                                                        CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[occupation.employment_status]
                                                                    )}

                                                                    {/* Only show these if NOT unemployed */}
                                                                    {occupation.employment_status !== "unemployed" && (
                                                                        <>
                                                                            {renderDetail("Occupation", occupation.occupation)}
                                                                            {renderDetail(
                                                                                "Employment Type",
                                                                                CONSTANTS.EMPLOYMENT_TYPE_TEXT[occupation.employment_type]
                                                                            )}
                                                                            {renderDetail(
                                                                                "Occupation Status",
                                                                                CONSTANTS.OCCUPATION_STATUS_TEXT[occupation.occupation_status]
                                                                            )}
                                                                            {renderDetail(
                                                                                "Work Arrangement",
                                                                                CONSTANTS.WORK_ARRANGEMENT_TEXT[occupation.work_arrangement]
                                                                            )}
                                                                            {renderDetail("Employer Name", occupation.employer)}
                                                                            {renderDetail("Year Started", occupation.started_at)}
                                                                            {occupation.occupation_status !== "active" &&
                                                                                renderDetail("Year Ended", occupation.ended_at)}
                                                                            {renderDetail("Monthly Income", occupation.monthly_income)}
                                                                            {renderDetail("Income Frequency", occupation.frequency)}
                                                                            {renderDetail("Income", occupation.income)}
                                                                            {renderDetail(
                                                                                "OFW",
                                                                                CONSTANTS.OCCUPATION_IS_OFW_TEXT[occupation.is_ofw]
                                                                            )}
                                                                            {renderDetail(
                                                                                "Main source of income",
                                                                                CONSTANTS.OCCUPATION_IS_MAIN_SOURCE_TEXT[occupation.is_main_source]
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                ) : (
                                                    <p className="text-gray-500 italic">No occupation data.</p>
                                                )}
                                            </div>


                                        </div>
                                    </details>
                                ))
                            )}
                        </div>
                    ))
                )}
            </section>


            {/* House Info */}
            <section className="space-y-4 border border-gray-200 p-4 rounded-md">
                <h6 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3 mb-2">
                    House Information
                </h6>

                {/* House Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {renderDetail("Ownership Type", CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[userData.ownership_type])}
                    {renderDetail("House Condition", CONSTANTS.HOUSEHOLD_CONDITION_TEXT[userData.housing_condition])}
                    {renderDetail("House Structure", CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[userData.house_structure])}
                    {renderDetail("Year Established", userData.year_established)}
                    {renderDetail("No. of Rooms", userData.number_of_rooms)}
                    {renderDetail("No. of Floors", userData.number_of_floors)}
                    {renderDetail("Bath/Wash Area", CONSTANTS.HOUSEHOLD_BATH_WASH_TEXT[userData.bath_and_wash_area])}
                    {renderDetail("Internet", CONSTANTS.HOUSEHOLD_INTERNET_TYPE_TEXT[userData.type_of_internet])}
                    {userData.toilets?.length > 0 && renderDetail("Toilet Type(s)", userData.toilets.map(t => CONSTANTS.HOUSEHOLD_TOILET_TYPE_TEXT[t.toilet_type]).filter(Boolean).join(", "))}
                    {userData.electricity_types?.length > 0 && renderDetail("Electricity Source(s)", userData.electricity_types.map(e => CONSTANTS.HOUSEHOLD_ELECTRICITY_TYPE[e.electricity_type]).filter(Boolean).join(", "))}
                    {userData.water_source_types?.length > 0 && renderDetail("Water Source(s)", userData.water_source_types.map(w => CONSTANTS.HOUSEHOLD_WATER_SOURCE_TEXT[w.water_source_type]).filter(Boolean).join(", "))}
                    {userData.waste_management_types?.length > 0 && renderDetail("Waste Disposal Method(s)", userData.waste_management_types.map(w => CONSTANTS.HOUSEHOLD_WASTE_DISPOSAL_TEXT[w.waste_management_type]).filter(Boolean).join(", "))}
                </div>


                {/* Livestock and Pets */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {/* Livestock Section */}
                    <div>
                        <h6 className="text-md font-semibold text-gray-700 border-b pb-1 mb-2">
                            Livestock Ownership
                        </h6>
                        {userData.has_livestock == 1 &&
                            userData.livestocks?.length > 0 ? (
                            <div className="space-y-2">
                                {userData.livestocks.map((livestock, index) => (
                                    <div key={index} className="bg-sky-50 p-3 border border-sky-200 rounded-md flex flex-wrap gap-6">
                                        {renderDetail("Livestock Type", livestock.livestock_type)}
                                        {renderDetail("Quantity", livestock.quantity)}
                                        {renderDetail("Purpose", CONSTANTS.PETS_PURPOSE_TEXT[livestock.purpose])}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-gray-500">
                                No livestock information provided.
                            </p>
                        )}
                    </div>

                    {/* Pet Section */}
                    <div>
                        <h6 className="text-md font-semibold text-gray-700 border-b pb-1 mb-2">
                            Pet Ownership
                        </h6>
                        {userData.has_pets == 1 && userData.pets?.length > 0 ? (
                            <div className="space-y-2">
                                {userData.pets.map((pet, index) => (
                                    <div
                                        key={index}
                                        className="bg-sky-50 p-3 border border-sky-200 rounded-md flex flex-wrap gap-6"
                                    >
                                        {renderDetail("Pet Type", pet.pet_type)}
                                        {renderDetail("Vaccinated for Rabies", CONSTANTS.PETS_VACCINE_TEXT[pet.is_vaccinated])}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-gray-500">
                                No pet information provided.
                            </p>
                        )}
                    </div>
                </div>
            </section>
            <section className="space-y-4 border border-gray-200 p-4 rounded-md">
                <label className="flex items-start space-x-2">
                    <Checkbox
                        name="verified"
                        checked={userData.verified === 1}
                        value={userData.verified}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                verified: e.target.checked ? 1 : 0,
                            }))
                        }
                    />
                    <span className="text-sm text-gray-700">
                        I hereby certify that the above information is true and
                        correct to the best of my knowledge. I understand that
                        for the Barangay to carry out its mandate pursuant to
                        Section 394(d)(6) of the Local Government Code of 1991,
                        it must necessarily process my personal information for
                        easy identification of inhabitants, as a tool in
                        planning, and as an updated reference for the number of
                        inhabitants in the Barangay. Therefore, I grant my
                        consent and recognize the authority of the Barangay to
                        process my personal information, subject to the
                        provisions of the Philippine Data Privacy Act of 2012.
                    </span>
                </label>
            </section>
        </section>
    );
};

export default Summary;
