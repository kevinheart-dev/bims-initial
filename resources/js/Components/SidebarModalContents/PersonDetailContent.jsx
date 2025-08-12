import { useState } from "react";
import { FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import * as CONSTANTS from "@/constants";
import { IoPerson } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiWheelchairFill } from "react-icons/ri";

export default function PersonDetailContent({ person }) {
    const [activeTab, setActiveTab] = useState("education");

    if (!person) return <p className="text-red-500">No data found.</p>;

    function calculateAge(birthdate) {
        if (!birthdate) return "N/A";
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    const bentoStyle =
        "rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-4";

    return (
        <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
            {/* <pre>{JSON.stringify(person, undefined, 2)}</pre> */}
            {/* ✅ Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <img
                    src={
                        person?.resident_picture_path == null
                            ? "/images/default-avatar.jpg"
                            : `/storage/${person.resident_picture_path}`
                    }
                    alt={`${person?.firstname}'s photo`}
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div className="text-center md:text-left space-y-[3px]">
                    <p className="font-bold text-xl text-blue-900">
                        {person.lastname}, {person.firstname}{" "}
                        {person.middlename || ""} {person.suffix || ""}
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-[12px]">
                        <FaEnvelope className="text-blue-500" /> {person.email}
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-[12px]">
                        <FaPhone className="text-blue-500" />{" "}
                        {person.contact_number}
                    </p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-1">
                <span className="font-medium text-left">Gender:</span>
                <span className="text-left capitalize">{person.gender}</span>

                <span className="font-medium text-left">Birthdate:</span>
                <span className="text-left capitalize">{person.birthdate}</span>

                <span className="font-medium text-left">Age:</span>
                <span className="text-left">
                    {calculateAge(person.birthdate)}
                </span>

                <span className="font-medium text-left">Status:</span>
                <span className="text-left capitalize">
                    {person.civil_status}
                </span>

                <span className="font-medium text-left">Birthplace:</span>
                <span className="text-left capitalize">
                    {person.birthplace}
                </span>

                <span className="font-medium text-left">Religion:</span>
                <span className="text-left capitalize">{person.religion}</span>

                <span className="font-medium text-left">Nationality:</span>
                <span className="text-left capitalize">
                    {person.citizenship}
                </span>

                <span className="font-medium text-left">Ethnicity:</span>
                <span className="text-left capitalize">{person.ethnicity}</span>
            </div>

            {/* ✅ Residency & Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className={bentoStyle}>
                    <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-1">
                        <FaLocationDot className="text-blue-700" /> Residency
                    </h3>
                    <hr className="mb-2 border-gray-500" />
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        <span className="text-left font-medium">Address:</span>
                        <span className="text-left capitalize">
                            {person.street?.street_name}, Purok{" "}
                            {person.street?.purok?.purok_number},{" "}
                            {person.barangay?.barangay_name},{" "}
                            {person.barangay?.city}
                        </span>
                        <span className="text-left font-medium">
                            Residency Type:
                        </span>
                        <span className="text-left capitalize">
                            {person.residency_type}
                        </span>
                        <span className="text-left font-medium">
                            Residency Date:
                        </span>
                        <span className="text-left capitalize">
                            {person.residency_date}
                        </span>
                    </div>
                </div>

                <div className={bentoStyle}>
                    <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-1">
                        <FaPhone className="text-blue-700" /> Emergency Contact
                    </h3>
                    <hr className="mb-2 border-gray-500" />
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        <span className="text-left font-medium">Name:</span>
                        <span className="text-left capitalize">
                            {person.medical_information?.emergency_contact_name}
                        </span>
                        <span className="text-left font-medium">
                            Contact No.:
                        </span>
                        <span className="text-left capitalize">
                            {
                                person.medical_information
                                    ?.emergency_contact_number
                            }
                        </span>
                        <span className="text-left font-medium">
                            Relationship:
                        </span>
                        <span className="text-left capitalize">
                            {
                                person.medical_information
                                    ?.emergency_contact_relationship
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* ✅ Tab Navigation */}
            <div className="border-b border-gray-400 mt-4">
                <div className="flex gap-6 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab("education")}
                        className={`py-2 px-1 border-b-2 ${activeTab === "education"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500"
                            }`}
                    >
                        Education
                    </button>
                    <button
                        onClick={() => setActiveTab("occupation")}
                        className={`py-2 px-1 border-b-2 ${activeTab === "occupation"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500"
                            }`}
                    >
                        Occupation
                    </button>
                    <button
                        onClick={() => setActiveTab("medical")}
                        className={`py-2 px-1 border-b-2 ${activeTab === "medical"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500"
                            }`}
                    >
                        Medical
                    </button>
                    <button
                        onClick={() => setActiveTab("social")}
                        className={`py-2 px-1 border-b-2 ${activeTab === "social"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-gray-500"
                            }`}
                    >
                        Social Welfare
                    </button>
                    {person.seniorcitizen && (
                        <button
                            onClick={() => setActiveTab("senior")}
                            className={`py-2 px-1 border-b-2 ${activeTab === "senior"
                                ? "border-blue-600 text-blue-700"
                                : "border-transparent text-gray-500"
                                }`}
                        >
                            Senior Citizen
                        </button>
                    )}
                </div>
            </div>

            <div className="!p-0 !m-0">
                {activeTab === "education" && (
                    <>
                        <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                            <IoBookSharp className="text-blue-700" /> Education
                            History
                        </h3>
                        <hr className="mb-2 border-gray-400" />
                        {Array.isArray(person.educational_histories) &&
                            person.educational_histories.length > 0 ? (
                            person.educational_histories.map((edu, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 pb-2 border-b border-gray-200"
                                >
                                    <span className="font-medium text-left">
                                        Attainment:
                                    </span>
                                    <span className="text-left capitalize">
                                        {
                                            CONSTANTS.EDUCATION_LEVEL_TEXT[
                                            edu.educational_attainment
                                            ]
                                        }
                                    </span>

                                    <span className="font-medium text-left">
                                        Status:
                                    </span>
                                    <span className="text-left capitalize">
                                        {edu.education_status}
                                    </span>

                                    <span className="font-medium text-left">
                                        School:
                                    </span>
                                    <span className="text-left capitalize">
                                        {edu.school_name}
                                    </span>

                                    <span className="font-medium text-left">
                                        Type:
                                    </span>
                                    <span className="text-left capitalize">
                                        {edu.school_type}
                                    </span>

                                    {edu.program && (
                                        <>
                                            <span className="font-medium text-left">
                                                Program:
                                            </span>
                                            <span className="text-left capitalize">
                                                {edu.program}
                                            </span>
                                        </>
                                    )}

                                    <span className="font-medium text-left">
                                        School Years:
                                    </span>
                                    <span className="text-left capitalize">
                                        {edu.year_started || " "} –{" "}
                                        {edu.year_ended || "Present"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No education records available.
                            </p>
                        )}
                    </>
                )}

                {activeTab === "occupation" && (
                    <>
                        <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                            <MdWork className="text-blue-700" /> Occupation
                            History
                        </h3>
                        <hr className="mb-2 border-gray-400" />
                        {Array.isArray(person.occupations) &&
                            person.occupations.length > 0 ? (
                            person.occupations.map((job, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 pb-2 border-b border-gray-200"
                                >
                                    <span className="font-medium text-left">
                                        Occupation:
                                    </span>
                                    <span className="text-left capitalize">
                                        {job.occupation}
                                    </span>

                                    <span className="font-medium text-left">
                                        Status:
                                    </span>
                                    <span className="text-left capitalize">
                                        {job.occupation_status}
                                    </span>

                                    <span className="font-medium text-left">
                                        Employer:
                                    </span>
                                    <span className="text-left capitalize">
                                        {job.employer || "N/A"}
                                    </span>

                                    <span className="font-medium text-left">
                                        Type:
                                    </span>
                                    <span className="text-left capitalize">
                                        {
                                            CONSTANTS.EMPLOYMENT_TYPE_TEXT[
                                            job.employment_type
                                            ]
                                        }
                                    </span>

                                    <span className="font-medium text-left">
                                        Monthly Income:
                                    </span>
                                    <span className="text-left">
                                        {job.monthly_income}
                                    </span>

                                    <span className="font-medium text-left">
                                        Work Arrangement:
                                    </span>
                                    <span className="text-left capitalize">
                                        {job.work_arrangement}
                                    </span>

                                    <span className="font-medium text-left">
                                        Years Active:
                                    </span>
                                    <span className="text-left">
                                        {job.started_at || "N/A"} –{" "}
                                        {job.ended_at || "Present"}
                                    </span>

                                    <span className="font-medium text-left">
                                        OFW:
                                    </span>
                                    <span className="text-left">
                                        {job.is_ofw === 1 ? "Yes" : "No"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No occupation records available.
                            </p>
                        )}
                    </>
                )}

                {activeTab === "medical" && (
                    <>
                        <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                            <FaHeart className="text-blue-700" /> Medical
                            Information
                        </h3>
                        <hr className="mb-2 border-gray-400" />
                        {person.medical_information ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="font-medium text-left">
                                    Blood Type:
                                </span>
                                <span className="text-left capitalize">
                                    {person.medical_information.blood_type}
                                </span>

                                <span className="font-medium text-left">
                                    BMI:
                                </span>
                                <span className="text-left">
                                    {person.medical_information.bmi}
                                </span>

                                <span className="font-medium text-left">
                                    Height (cm):
                                </span>
                                <span className="text-left">
                                    {person.medical_information.height_cm}
                                </span>

                                <span className="font-medium text-left">
                                    Weight (kg):
                                </span>
                                <span className="text-left">
                                    {person.medical_information.weight_kg}
                                </span>

                                <span className="font-medium text-left">
                                    Nutrition Status:
                                </span>
                                <span className="text-left capitalize">
                                    {
                                        person.medical_information
                                            .nutrition_status
                                    }
                                </span>

                                <span className="font-medium text-left">
                                    Smoker:
                                </span>
                                <span className="text-left">
                                    {person.medical_information.is_smoker
                                        ? "Yes"
                                        : "No"}
                                </span>

                                <span className="font-medium text-left">
                                    Alcohol User:
                                </span>
                                <span className="text-left">
                                    {person.medical_information.is_alcohol_user
                                        ? "Yes"
                                        : "No"}
                                </span>

                                <span className="font-medium text-left">
                                    Is PWD:
                                </span>
                                <span className="text-left">
                                    {person.is_pwd ? "Yes" : "No"}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No medical info available.
                            </p>
                        )}
                        {person.is_pwd === 1 && (
                            <>
                                <hr className="mb-2 mt-2 border-gray-400" />
                                <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                                    <RiWheelchairFill className="text-blue-700" />{" "}
                                    Disability
                                </h3>
                                <hr className="mb-2 border-gray-400" />

                                {person.disabilities?.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {person.disabilities.map(
                                            (disability, index) => (
                                                <li
                                                    key={index}
                                                    className="capitalize"
                                                >
                                                    {disability.disability_type}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm italic text-gray-500">
                                        No disabilities recorded.
                                    </p>
                                )}
                            </>
                        )}
                    </>
                )}

                {activeTab === "social" && (
                    <>
                        <h3 className="col-span-2 font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                            <FaPeopleGroup className="text-blue-700" /> Social
                            Welfare Profile
                        </h3>
                        <hr className="mb-2 border-gray-400" />

                        {person.socialwelfareprofile ? (
                            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="font-medium text-left">
                                    Is 4Ps Beneficiary:
                                </span>
                                <span className="text-left">
                                    {person.socialwelfareprofile
                                        .is_4ps_beneficiary
                                        ? "Yes"
                                        : "No"}
                                </span>

                                <span className="font-medium text-left">
                                    Is PhilHealth Beneficiary:
                                </span>
                                <span className="text-left">
                                    {person.medical_information?.has_philhealth
                                        ? "Yes"
                                        : "No"}
                                </span>

                                {person.medical_information?.has_philhealth ===
                                    1 && (
                                        <>
                                            <span className="font-medium text-left">
                                                PhilHealth ID:
                                            </span>
                                            <span className="text-left">
                                                {person.medical_information
                                                    ?.philhealth_id_number || "N/A"}
                                            </span>
                                        </>
                                    )}

                                <span className="font-medium text-left">
                                    Is Solo Parent:
                                </span>
                                <span className="text-left">
                                    {person.socialwelfareprofile.is_solo_parent
                                        ? "Yes"
                                        : "No"}
                                </span>

                                {person.socialwelfareprofile.is_solo_parent ===
                                    1 && (
                                        <>
                                            <span className="font-medium text-left">
                                                Solo Parent ID:
                                            </span>
                                            <span className="text-left">
                                                {
                                                    person.socialwelfareprofile
                                                        .solo_parent_id_number
                                                }
                                            </span>
                                        </>
                                    )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No social welfare info available.
                            </p>
                        )}
                    </>
                )}

                {activeTab === "senior" && (
                    <>
                        <h3 className="col-span-2 font-bold text-base flex items-center gap-2 text-blue-700 mb-2 mt-2">
                            <IoPerson className="text-blue-700" /> Senior
                            Information
                        </h3>
                        <hr className="mb-2 border-gray-400" />

                        {person.seniorcitizen ? (
                            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="font-medium text-left">
                                    OSCA ID Number:
                                </span>
                                <span className="text-left">
                                    {person.seniorcitizen.osca_id_number}
                                </span>

                                <span className="font-medium text-left">
                                    Is Pensioner:
                                </span>
                                <span className="text-left capitalize">
                                    {person.seniorcitizen.is_pensioner}
                                </span>

                                <span className="font-medium text-left">
                                    Pension Type:
                                </span>
                                <span className="text-left capitalize">
                                    {person.seniorcitizen.pension_type}
                                </span>

                                <span className="font-medium text-left">
                                    Living Alone:
                                </span>
                                <span className="text-left">
                                    {person.seniorcitizen.living_alone
                                        ? "Yes"
                                        : "No"}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No senior info available.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export const personDetailTitle = "Resident Details";
