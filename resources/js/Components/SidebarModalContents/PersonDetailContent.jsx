import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaHome,
    FaHeart,
    FaVoteYea,
    FaCar,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
export default function PersonDetailContent({ person }) {
    if (!person) return <p className="text-red-500">No data found.</p>;

    const bentoStyle = "rounded-xl border p-4 shadow-sm bg-white";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black text-sm">
            {/* Top Section: Basic Info + Side Panels */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                {/* Basic Info - Left Side */}
                <div className="flex-1 bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        {/* Image */}
                        <img
                            src={
                                person?.resident_picture?.startsWith("http")
                                    ? person.resident_picture
                                    : person?.resident_picture
                                        ? `/storage/${person.resident_picture}`
                                        : "/images/default-avatar.jpg"
                            }
                            alt={`${person?.firstname}'s photo`}
                            className="w-16 h-16 rounded-full object-cover border"
                        />

                        {/* Top 3 Info beside image */}
                        <div className="text-sm space-y-[3px]">
                            <p className="font-bold text-xl text-blue-900 leading-tight">
                                {person.lastname}, {person.firstname} {person.middlename || ""} {person.suffix || ""}
                            </p>
                            <p className="flex items-center gap-2 text-[12px] leading-none">
                                <FaEnvelope className="text-blue-500" /> {person.email}
                            </p>
                            <p className="flex items-center gap-2 text-[12px] leading-none">
                                <FaPhone className="text-blue-500" /> {person.contact_number}
                            </p>
                        </div>
                    </div>

                    <hr className="mt-3 border-gray-300" />

                    {/* Remaining info below */}
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                        <span className="text-left font-medium">Gender:</span>
                        <span className="text-left capitalize">{person.gender}</span>

                        <span className="text-left font-medium">Birthdate:</span>
                        <span className="text-left capitalize">{person.birthdate}</span>

                        <span className="text-left font-medium">Status:</span>
                        <span className="text-left capitalize">{person.civil_status}</span>

                        <span className="text-left font-medium">Birthplace:</span>
                        <span className="text-left capitalize">{person.birthplace}</span>

                        <span className="text-left font-medium">Religion:</span>
                        <span className="text-left capitalize">{person.religion}</span>

                        <span className="text-left font-medium">Nationality:</span>
                        <span className="text-left capitalize">{person.citizenship}</span>

                        <span className="text-left font-medium">Ethnicity:</span>
                        <span className="text-left capitalize">{person.ethnicity}</span>

                    </div>

                </div>


                {/* Right Side: Residency & Emergency Contact */}
                <div className="flex flex-col gap-4 w-full md:max-w-[300px]">
                    {/* Residency Info */}
                    <div className={bentoStyle}>
                        <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-1">
                            <FaLocationDot className="text-blue-700" /> Residency
                        </h3>
                        <hr className="mb-2 border-gray-300" />
                        <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-left font-medium">Address:</span>
                            <span className="text-left capitalize">
                                {person.street?.street_name},{" "}
                                <span>Purok</span>{" "} {person.street?.purok?.purok_number},{" "}
                                {person.barangay?.barangay_name}, {person.barangay?.city}
                            </span>

                            <span className="text-left font-medium">Residency Type:</span>
                            <span className="text-left capitalize">{person.residency_type}</span>

                            <span className="text-left font-medium">Residency Date:</span>
                            <span className="text-left capitalize">{person.residency_date}</span>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className={bentoStyle}>
                        <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-1">
                            <FaPhone className="text-blue-700" /> Emergency Contact
                        </h3>
                        <hr className="mb-2 border-gray-300" />
                        <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-left font-medium">Name:</span>
                            <span className="text-left capitalize">{person.medical_information?.emergency_contact_name}</span>

                            <span className="text-left font-medium">Contact No.:</span>
                            <span className="text-left capitalize">{person.medical_information?.emergency_contact_number}</span>

                            <span className="text-left font-medium">Relationship:</span>
                            <span className="text-left capitalize">{person.medical_information?.emergency_contact_relationship}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Education history */}
            <div className={bentoStyle}>
                <h3 className="font-bold text-base flex items-center gap-2 text-blue-700 mb-1">
                    <IoBookSharp className="text-blue-700" /> Education History
                </h3>
                <hr className="mb-2 border-gray-300" />

                {Array.isArray(person.educational_histories) && person.educational_histories.length > 0 ? (
                    person.educational_histories.map((edu, index) => (
                        <div
                            key={index}
                            className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 mb-3 border-b border-gray-200 pb-2"
                        >
                            <span className="font-medium text-left">Attainment:</span>
                            <span className="text-left capitalize">{edu.educational_attainment}</span>

                            <span className="font-medium text-left">Status:</span>
                            <span className="text-left capitalize">{edu.education_status}</span>

                            <span className="font-medium text-left">School:</span>
                            <span className="text-left capitalize">{edu.school_name}</span>

                            <span className="font-medium text-left">School Type:</span>
                            <span className="text-left capitalize">{edu.school_type}</span>

                            {edu.program && (
                                <>
                                    <span className="font-medium text-left">Program:</span>
                                    <span className="text-left capitalize">{edu.program}</span>
                                </>
                            )}

                            <span className="font-medium text-left">Year Graduated:</span>
                            <span className="text-left capitalize">{edu.year_graduated || 'N/A'}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">No education records available.</p>
                )}
            </div>

            <div className={bentoStyle}>

            </div>


            {/* Household Info */}
            <div className={`${bentoStyle} row-span-2`}>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><FaHome /> Household Info</h3>
                <p>House No.: {person.household?.house_number}</p>
                <p>Street ID: {person.street_id}</p>
                <p>House Structure: {person.household?.house_structure}</p>
                <p>Housing Condition: {person.household?.housing_condition}</p>
                <p>Ownership Type: {person.household?.ownership_type}</p>
                <p>Rooms: {person.household?.number_of_rooms}</p>
                <p>Floors: {person.household?.number_of_floors}</p>
            </div>

            {/* Medical Info */}
            <div className={`${bentoStyle} row-span-2`}>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><FaHeart /> Medical</h3>
                <p>Blood Type: {person.medical_information?.blood_type}</p>
                <p>BMI: {person.medical_information?.bmi}</p>
                <p>Height (cm): {person.medical_information?.height_cm}</p>
                <p>Weight (kg): {person.medical_information?.weight_kg}</p>
                <p>Nutrition Status: {person.medical_information?.nutrition_status}</p>
                <p>PhilHealth ID: {person.medical_information?.philhealth_id_number}</p>
                <p>Smoker: {person.medical_information?.is_smoker ? "Yes" : "No"}</p>
                <p>Alcohol User: {person.medical_information?.is_alcohol_user ? "Yes" : "No"}</p>
            </div>

            {/* Voting Info */}
            <div className={bentoStyle}>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><FaVoteYea /> Voting</h3>
                <p>Voter ID: {person.voting_information?.voter_id_number}</p>
                <p>Status: {person.voting_information?.voting_status}</p>
                <p>Registered Barangay: {person.voting_information?.registered_barangay_id}</p>
            </div>

            {/* Vehicles */}
            {person.vehicles?.length > 0 && (
                <div className={bentoStyle}>
                    <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><FaCar /> Vehicles</h3>
                    {person.vehicles.map((v, idx) => (
                        <p key={idx}>
                            {v.vehicle_type} ({v.vehicle_class}) - {v.usage_status}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export const personDetailTitle = "Resident Details";
