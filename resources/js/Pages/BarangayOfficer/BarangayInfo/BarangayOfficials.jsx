import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
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
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import DropdownInputField from "@/Components/DropdownInputField";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import { Textarea } from "@/Components/ui/textarea";
import TextInput from "@/Components/TextInput";
import { Toaster, toast } from "sonner";
import InputError from "@/Components/InputError";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const BarangayOfficials = ({ residents, officials, puroks, activeterms }) => {
    const breadcrumbs = [{ label: "Barangay Officials", showOnMobile: false }];
    const [isModalOpen, setIsModalOpen] = useState(false); // Resident detail modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal
    const [selectedResident, setSelectedResident] = useState(null);
    const [selectedOfficial, setSelectedOfficial] = useState(null); // for edit
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const propsErrors = props.errors ?? {};

    const { data, setData, post, errors, processing, reset, clearErrors } =
        useForm({
            resident_name: "",
            resident_id: "",
            resident_image: "",
            position: "",
            designations: [[]],
            term: "",
            contact_number: "",
            email: "",
            appointment_type: "",
            appointed_by: "",
            appointment_reason: "",
            remarks: "",
        });
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };
    const handleResidentChange = useResidentChangeHandler(residents, setData);

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

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    const addDesignation = () => {
        setData("designations", [...(data.designations || []), {}]);
    };
    const removeDesignation = (desIdx) => {
        const updated = [...(data.designations || [])];
        updated.splice(desIdx, 1);
        setData("designations", updated);
        toast.warning("Designation removed.", {
            duration: 2000,
        });
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
        setIsModalOpen(true);
    };

    // New: open edit modal with selected official data
    const handleEdit = (official) => {
        setSelectedOfficial(official);
        setIsEditModalOpen(true);
    };

    // New: onAdd form submit handler (customize to your needs)
    const onAddSubmit = (e) => {
        e.preventDefault();
        post(route("barangay_official.store"), {
            onError: (validationErrors) => {
                console.error("Validation Errors:", validationErrors);
            },
        });
    };

    // New: onEdit form submit handler
    const onEditSubmit = (formData) => {
        console.log("Edit official data:", formData);
        setIsEditModalOpen(false);
        // TODO: put formData via Inertia or axios and refresh list
    };

    const officialPositionsList = Object.entries(
        BARANGAY_OFFICIAL_POSITIONS_TEXT
    ).map(([key, label]) => ({
        label: label,
        value: key.toString(),
    }));

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const active_terms = activeterms.map((term) => ({
        label: `${term.term_start} - ${term.term_end}`,
        value: term.id.toString(),
    }));

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Please check the form for errors.",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [error]);

    useEffect(() => {
        if (propsErrors?.position) {
            toast.error(propsErrors.position, {
                description: "Please check the form for errors.",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [propsErrors]); // track whole errors object

    useEffect(() => {
        if (data.appointment_type !== "appointed") {
            setData((prev) => ({
                ...prev,
                appointed_by: "",
                appointment_reason: "",
            }));
        }
    }, [data.appointment_type]);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
        setIsAddModalOpen(false);
        reset();
        clearErrors();
    };
    return (
        <AdminLayout>
            <Toaster richColors />
            <Head title="Barangay Officials" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            {/* <pre>{JSON.stringify(officials, undefined, 3)}</pre> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {officials.map((official) => (
                    <OfficialCard
                        key={official.id}
                        id={official.resident.id}
                        name={`${official.resident.firstname} ${official.resident.lastname}`}
                        position={
                            BARANGAY_OFFICIAL_POSITIONS_TEXT[official.position]
                        }
                        purok={
                            official.active_designations[0]?.purok
                                ?.purok_number || "N/A"
                        }
                        term={`${official.term?.term_start || "0000"} – ${
                            official.term?.term_end || "0000"
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
                onClose={() => handleModalClose()}
                title="Resident Details"
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
                {isAddModalOpen && (
                    <form
                        onSubmit={onAddSubmit}
                        className="p-10 bg-slate-400 rounded-xl space-y-6"
                    >
                        {/* Image and Name + Position */}
                        <div className="flex gap-4 items-start">
                            {/* Image Upload */}
                            <div className="flex flex-col items-center">
                                <label
                                    htmlFor="imageUpload"
                                    className="w-40 h-40 border rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                                >
                                    {data.resident_image &&
                                    typeof data.resident_image !== "string" ? (
                                        <img
                                            src={
                                                data.resident_image instanceof
                                                File
                                                    ? URL.createObjectURL(
                                                          data.resident_image
                                                      )
                                                    : existingImagePath ||
                                                      "/images/default-avatar.jpg"
                                            }
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm text-center px-2">
                                            Click to Upload
                                        </span>
                                    )}
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    name="resident_image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setData("resident_image", file);
                                        }
                                    }}
                                    className="hidden w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <InputError
                                    message={errors.resident_image}
                                    className="mt-2"
                                />
                            </div>

                            {/* Name & Position */}
                            <div className="flex flex-col gap-4 flex-1">
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="resident_name"
                                    >
                                        Full Name
                                    </label>
                                    <DropdownInputField
                                        id="resident_name"
                                        name="resident_name"
                                        placeholder="Enter full name"
                                        value={data.resident_name || ""}
                                        onChange={(e) =>
                                            handleResidentChange(e)
                                        }
                                        items={residentsList}
                                    />
                                    <InputError
                                        message={errors.resident_id}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="position"
                                    >
                                        Position
                                    </label>
                                    <SelectField
                                        id="position"
                                        name="position"
                                        value={data.position}
                                        onChange={handleChange}
                                        items={officialPositionsList}
                                    >
                                        <option value="" disabled>
                                            Select barangay position
                                        </option>
                                    </SelectField>
                                    <InputError
                                        message={errors.position}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Number / Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="designation"
                                >
                                    Phone Number
                                </label>
                                <InputField
                                    id="contact_number"
                                    name="contact_number"
                                    type="text"
                                    placeholder="09XXXXXXXXX"
                                    value={data.contact_number || ""}
                                    onChange={handleChange}
                                    disabled
                                />
                                <InputError
                                    message={errors.contact_number}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="designation"
                                >
                                    Email
                                </label>
                                <InputField
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="test@gmail.com"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    disabled
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Term Start / Term End */}
                        <div className={`grid  grid-cols-2 gap-4`}>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="term"
                                >
                                    Official Term
                                </label>
                                <SelectField
                                    id="term"
                                    name="term"
                                    placeholder="Select term of offcial"
                                    value={data.term}
                                    onChange={handleChange}
                                    items={active_terms}
                                />
                                <InputError
                                    message={errors.term}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="appointment_type"
                                >
                                    Appointment Type
                                </label>
                                <SelectField
                                    id="appointment_type"
                                    name="appointment_type"
                                    value={data.appointment_type}
                                    onChange={handleChange}
                                    items={[
                                        {
                                            label: "Elected",
                                            value: "elected",
                                        },
                                        {
                                            label: "Appointed",
                                            value: "appointed",
                                        },
                                        {
                                            label: "Succession",
                                            value: "succession",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={errors.appointment_type}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {["barangay_kagawad", "sk_kagawad"].includes(
                            data.position
                        ) && (
                            <div className="grid grid-cols-3 gap-4">
                                {(data.designations || []).map(
                                    (designation, desIdx) => (
                                        <div
                                            key={desIdx}
                                            className=" pr-8 rounded-md relative"
                                        >
                                            {/* Left: input fields */}
                                            <div>
                                                <SelectField
                                                    id="designation"
                                                    name="designation"
                                                    value={
                                                        designation.designation ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleArrayValues(
                                                            e,
                                                            desIdx,
                                                            "designation",
                                                            "designations"
                                                        )
                                                    }
                                                    items={purok_numbers}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `designations.${desIdx}.designation`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDesignation(desIdx)
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                title="Remove"
                                            >
                                                <IoIosCloseCircleOutline />
                                            </button>
                                        </div>
                                    )
                                )}
                                <button
                                    type="button"
                                    onClick={() => addDesignation()}
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                    title="Add Designation"
                                >
                                    <IoIosAddCircleOutline className="text-4xl" />
                                    <span className="ml-1">
                                        Add Designation
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* If official is appointed */}
                        {data.appointment_type === "appointed" && (
                            <div className="grid grid-cols-2 gap-4 items-start">
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="appointed_by"
                                    >
                                        Appointed By
                                    </label>
                                    <DropdownInputField
                                        id="appointed_by"
                                        name="appointed_by"
                                        placeholder="Enter full name"
                                        value={data.appointed_by || ""}
                                        onChange={(e) => handleChange(e)}
                                        items={residentsList}
                                    />
                                    <InputError
                                        message={errors.appointed_by}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="remarks"
                                    >
                                        Remarks
                                    </label>
                                    <InputField
                                        id="remarks"
                                        name="remarks"
                                        value={data.remarks}
                                        onChange={handleChange}
                                    />
                                    <InputError
                                        message={errors.remarks}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid col-span-2">
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="appointment_reason"
                                    >
                                        Appointment Reason
                                    </label>
                                    <Textarea
                                        id="appointment_reason"
                                        name="appointment_reason"
                                        value={data.appointment_reason}
                                        onChange={handleChange}
                                    />
                                    <InputError
                                        message={errors.appointment_reason}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                )}
            </SidebarModal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Barangay Official"
            >
                {selectedOfficial && <EditOfficialForm />}
            </Modal>
        </AdminLayout>
    );
};

export default BarangayOfficials;
