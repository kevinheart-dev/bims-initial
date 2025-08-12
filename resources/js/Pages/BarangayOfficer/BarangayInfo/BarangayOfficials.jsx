import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import OfficialCard from "@/Components/OfficialCards";
import { BARANGAY_OFFICIAL_POSITIONS_TEXT } from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import FloatingAddButton from "@/Components/AddOfficalCard";
import Modal from "@/Components/Modal2";
import AddOfficialForm from "./AddOfficialForm";
import EditOfficialForm from "./EditOfficialForm";

const BarangayOfficials = () => {
    const { officials } = usePage().props;
    const breadcrumbs = [{ label: "Barangay Officials", showOnMobile: false }];
    const [isModalOpen, setIsModalOpen] = useState(false); // Resident detail modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal
    const [selectedResident, setSelectedResident] = useState(null);
    const [selectedOfficial, setSelectedOfficial] = useState(null); // for edit
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

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    // New: open edit modal with selected official data
    const handleEdit = (official) => {
        setSelectedOfficial(official);
        setIsEditModalOpen(true);
    };

    // New: onAdd form submit handler (customize to your needs)
    const onAddSubmit = (formData) => {
        console.log("Add official data:", formData);
        setIsAddModalOpen(false);
        // TODO: post formData via Inertia or axios and refresh list
    };

    // New: onEdit form submit handler
    const onEditSubmit = (formData) => {
        console.log("Edit official data:", formData);
        setIsEditModalOpen(false);
        // TODO: put formData via Inertia or axios and refresh list
    };

    return (
        <AdminLayout>
            <Head title="Barangay Officials" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {officials.map((official) => (
                    <OfficialCard
                        key={official.id}
                        id={official.resident.id}
                        name={`${official.resident.firstname} ${official.resident.lastname}`}
                        position={BARANGAY_OFFICIAL_POSITIONS_TEXT[official.position]}
                        purok={official.designation?.purok?.purok_number || "N/A"}
                        term={`${official.designation?.started_at || "0000"} – ${official.designation?.ended_at || "0000"
                            }`}
                        phone={official.resident.contact_number}
                        email={official.resident.email}
                        image={official.resident.resident_picture_path}
                        onView={() => handleView(official.resident.id)}
                        onEdit={() => handleEdit(official)} // add an edit button in OfficialCard or handle here
                    />
                ))}
            </div>

            {/* Floating Add Button */}
            <FloatingAddButton onAdd={handleAdd} />

            {/* Sidebar Modal for Resident Details */}
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Resident Details"
            >
                {selectedResident && <PersonDetailContent person={selectedResident} />}
            </SidebarModal>

            {/* Add Official Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Barangay Official"
            >
                <AddOfficialForm />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Barangay Official"
            >
                {selectedOfficial && (
                    <EditOfficialForm
                    />
                )}
            </Modal>
        </AdminLayout>
    );
};

export default BarangayOfficials;
