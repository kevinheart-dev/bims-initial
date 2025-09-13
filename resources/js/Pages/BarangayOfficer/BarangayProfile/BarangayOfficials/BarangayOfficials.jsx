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
import { useQuery } from "@tanstack/react-query";

const BarangayOfficials = () => {
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

    const {
        data: getData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["barangay_officials"],
        queryFn: async () => {
            const { data } = await axios.get(`${APP_URL}/barangay_official`);
            return data;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const officials = getData?.officials ?? [];
    const residents = getData?.residents ?? [];
    const puroks = getData?.puroks ?? [];
    const activeterms = getData?.activeterms ?? [];

    const { data, setData, post, errors, processing, reset, clearErrors } =
        useForm({
            resident_name: "",
            resident_id: "",
            resident_image: "",
            position: "",
            designations: [],
            term: "",
            contact_number: "",
            email: "",
            appointment_type: "",
            appointted_by: "",
            appointment_reason: "",
            remarks: "",
            official_id: "",
            _method: undefined,
        });
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };
    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const handleView = async (residentId) => {
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${residentId}`
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
    const handleEdit = async (id) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_official/officialsinfo/${id}`
            );
            const official = response.data.official;

            setSelectedOfficial(official);
            //console.log(official);
            setData("resident_id", official.resident.id || "");
            setData(
                "resident_name",
                `${official.resident.firstname} ${
                    official.resident.middlename
                } ${official.resident.lastname} ${
                    official.resident.suffix ?? ""
                }`
            );
            setData("contact_number", official.resident.contact_number || "");
            setData("email", official.resident.email || "");
            setData("position", official.position || "");
            setData(
                "designations",
                (official.designation || []).map((d) => ({
                    designation: d.purok_id || "",
                    term_start: d.started_at || "",
                    term_end: d.ended_at || "",
                }))
            );
            setData(
                "term",
                official.term.id ? official.term.id.toString() : ""
            );
            setData(
                "resident_image",
                official.resident.resident_picture_path || ""
            );
            setData("appointment_type", official.appointment_type || "");
            if (official.appointment_type === "appointed") {
                setData(
                    "appointted_by",
                    official.appointted_by
                        ? official.appointted_by.toString()
                        : ""
                );
                setData(
                    "appointment_reason",
                    official.appointment_reason || ""
                );
                setData("remarks", official.remarks || "");
            } else {
                setData("appointted_by", "");
                setData("appointment_reason", "");
                setData("remarks", "");
            }
            setData("_method", "PUT");
            setData("official_id", official.id);
            setIsModalOpen(true);
            setIsAddModalOpen(true);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
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
                appointted_by: "",
                appointment_reason: "",
            }));
        }
    }, [data.appointment_type]);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
        setSelectedOfficial(null);
        setIsAddModalOpen(false);
        reset();
        clearErrors();
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
    const onEditSubmit = (e) => {
        e.preventDefault();
        post(route("barangay_official.update", data.official_id), {
            onError: (validationErrors) => {
                console.error("Validation Errors:", validationErrors);
            },
        });
    };
    return (
        <div className="p-2 md:px-2 md:py-2">
            <Toaster richColors />
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
                        onEdit={() => handleEdit(official.id)} // add an edit button in OfficialCard or handle here
                    />
                ))}
            </div>

            {/* Floating Add Button */}
            <FloatingAddButton onAdd={handleAdd} />

            {/* Sidebar Modal for Resident Details */}
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => handleModalClose()}
                title={
                    selectedResident
                        ? "Resident Details"
                        : selectedOfficial
                        ? "Edit Official"
                        : "Add Official"
                }
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
                {isAddModalOpen && (
                    <form
                        onSubmit={selectedOfficial ? onEditSubmit : onAddSubmit}
                        className="bg-gray-50 p-4 rounded-lg"
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Barangay Officials Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Please provide details about the elected and
                            appointed officials serving in the barangay,
                            including their positions, terms, and
                            responsibilities.
                        </p>
                        {/* Image and Name + Position */}
                        <div className="flex gap-4 items-center">
                            {/* Image Upload */}
                            <div className="flex flex-col  items-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <InputLabel
                                        htmlFor="resident_image"
                                        value="Resident Photo"
                                    />

                                    <img
                                        src={
                                            data.resident_image instanceof File
                                                ? URL.createObjectURL(
                                                      data.resident_image
                                                  )
                                                : data.resident_image
                                                ? `/storage/${data.resident_image}`
                                                : "/images/default-avatar.jpg"
                                        }
                                        alt="Resident Image"
                                        className="w-64 h-64 object-cover rounded-full border border-gray-200"
                                    />

                                    {/* <input
                                        id="resident_image"
                                        type="file"
                                        name="resident_image"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setData("resident_image", file);
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500
                                                    file:mr-2 file:py-1 file:px-3
                                                    file:rounded file:border-0
                                                    file:text-xs file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100"
                                    /> */}
                                </div>
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
                                    value={data.term || ""}
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
                                    value={data.appointment_type || ""}
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
                                            className="items-start pr-8 rounded-md relative"
                                        >
                                            {/* Left: input fields */}
                                            <div>
                                                <SelectField
                                                    id="designation"
                                                    name="designation"
                                                    label="Designation"
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
                                            <div>
                                                <YearDropdown
                                                    id="term_start"
                                                    name="term_start"
                                                    label="Term Start"
                                                    value={
                                                        designation.term_start ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleArrayValues(
                                                            e,
                                                            desIdx,
                                                            "term_start",
                                                            "designations"
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `designations.${desIdx}.term_start`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <YearDropdown
                                                    id="term_end"
                                                    name="term_end"
                                                    label="Term Ended"
                                                    value={
                                                        designation.term_end ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleArrayValues(
                                                            e,
                                                            desIdx,
                                                            "term_end",
                                                            "designations"
                                                        )
                                                    }
                                                    className="w-full"
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
                                        htmlFor="appointted_by"
                                    >
                                        Appointed By
                                    </label>
                                    <DropdownInputField
                                        id="appointted_by"
                                        name="appointted_by"
                                        placeholder="Enter full name"
                                        value={data.appointted_by || ""}
                                        onChange={(e) => handleChange(e)}
                                        items={residentsList}
                                    />
                                    <InputError
                                        message={errors.appointted_by}
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
                                {selectedOfficial
                                    ? processing
                                        ? "Updating..."
                                        : "Update"
                                    : processing
                                    ? "Saving..."
                                    : "Save"}
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
        </div>
    );
};

export default BarangayOfficials;
