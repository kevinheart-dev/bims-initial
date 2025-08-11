import { useState } from "react";
import { Mail, Phone, Pencil } from "lucide-react"; // ✅ Pencil icon for edit
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";

const OfficialCard = ({
    id,
    name,
    position,
    purok,
    term,
    phone,
    email,
    image,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const APP_URL = useAppUrl();
    const handleView = async (residentId) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/resident/showresident/${residentId}`
            );
            setSelectedResident(response.data.resident);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching resident details:", error);
        }
    };

    const handleEdit = () => {
        window.location.href = `/barangay_officer/officials/${id}/edit`;
        // Or use Inertia: router.visit(`/barangay_officer/officials/${id}/edit`);
    };

    return (
        <div className="w-full max-w-[260px] sm:max-w-[280px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-transform duration-300 hover:scale-105">
            {/* Image */}
            <div className="w-full h-[200px] overflow-hidden">
                <img
                    src={image || "/images/default-card-image.jpg"}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="px-3 py-3">
                <h2 className="text-lg font-bold text-gray-900">{name}</h2>
                <p className="text-blue-700 font-semibold">{position}</p>
                <p className="text-gray-500 text-xs">
                    Designation: Purok {purok}
                </p>
                <p className="text-gray-500 text-xs mb-3">Term: {term}</p>

                {/* Contact Info */}
                <div className="space-y-1 text-sm">
                    {phone && (
                        <p className="flex items-center space-x-2">
                            <Phone className="text-blue-600 w-4 h-4" />
                            <span className="text-gray-600">{phone}</span>
                        </p>
                    )}
                    {email && (
                        <p className="flex items-center space-x-2">
                            <Mail className="text-blue-600 w-4 h-4" />
                            <span className="text-gray-600">{email}</span>
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleEdit}
                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-gray-200 text-sm font-semibold py-2 rounded-lg transition-colors duration-200"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => handleView(id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors duration-200"
                    >
                        View Profile
                    </button>
                </div>
            </div>

            {/* Sidebar Modal */}
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Resident Details"
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
            </SidebarModal>
        </div>
    );
};

export default OfficialCard;
