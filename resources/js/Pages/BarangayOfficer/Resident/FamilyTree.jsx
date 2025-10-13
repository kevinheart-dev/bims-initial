import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import FamilyTree from "@/Components/FamilyTree";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import SelectField from "@/Components/SelectField";
import SidebarModal from "@/Components/SidebarModal";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Workflow } from "lucide-react";
import { useEffect } from "react";
import { Suspense, useState } from "react";
import { Toaster, toast } from "sonner";

export default function Index({ family_tree, residents }) {
    // console.log("Family Tree JSON:", family_tree);
    const family_name =
        family_tree?.self?.data?.family?.family_name || "Unnamed";
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Family Tree", showOnMobile: true },
    ];

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const residentsList = residents.map((res) => ({
        value: res.id, // used for selection
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${res.suffix ?? ""
            }`,
        image: res.resident_picture_path || null,
        birthdate: res.birthdate || null,
        purok_number: res.purok_number || null,
    }));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const selfResident = family_tree?.self?.data || null;

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        resident_id: null,
        related_to: null,
        relationship: "",
        family_relation_id: null,
        _method: undefined,
    });

    const handleAddRelation = () => {
        if (selfResident) {
            setData({
                resident_id: selfResident.id,
                resident_id_name: `${selfResident.firstname} ${selfResident.middlename} ${selfResident.lastname}`,
                resident_birthdate: selfResident.birthdate,
                resident_image: selfResident.resident_picture_path,
                resident_purok: selfResident.purok_number,

                related_to: null,
                related_to_name: "",
                related_to_birthdate: null,
                related_to_image: null,
                related_to_purok: null,

                relationship: "",
            });
        }

        setIsModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route("family_tree.store"), {
            onError: (errors) => {
                // console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    // Helper function
    const populateResidentData = (fieldPrefix, resident) => {
        if (!resident) return;

        setData(`${fieldPrefix}`, resident.value || resident.id);
        setData(
            `${fieldPrefix}_name`,
            resident.label ||
            `${resident.firstname} ${resident.middlename} ${resident.lastname}`
        );
        setData(`${fieldPrefix}_image`, resident.image || null);
        setData(`${fieldPrefix}_birthdate`, resident.birthdate || null);
        setData(`${fieldPrefix}_purok`, resident.purok_number || null);
    };

    const handleRelatedToChange = (id) => {
        const related = residentsList.find((r) => r.value == id);
        populateResidentData("related_to", related);
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    }, [success]);
    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
            handleModalClose();
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold mb-3">
                                {family_name} Family Tree
                            </h2>

                            <div className="relative group z-5 mr-4">
                                <Button
                                    type="submit"
                                    className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                                    variant="outline"
                                    onClick={handleAddRelation}
                                >
                                    <Workflow />
                                </Button>
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                    Add A Relation
                                </div>
                            </div>
                        </div>

                        {/* <pre>{JSON.stringify(family_tree, undefined, 3)}</pre> */}
                        <div className="h-[600px] w-[1000px]">
                            <FamilyTree familyData={family_tree} />
                        </div>
                    </div>
                    <Suspense fallback={null}>
                        {" "}
                        {/* Render modals only when needed */}
                        <SidebarModal
                            isOpen={isModalOpen}
                            onClose={() => handleModalClose()}
                            title="Add a Relationship to the Tree"
                        >
                            <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                                <form
                                    className="space-y-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
                                    onSubmit={handleAddSubmit}
                                >
                                    {/* Header */}
                                    <div className="mb-6">
                                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                            Add Family Relation
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Define the relationship between
                                            residents in the household. This
                                            helps maintain a proper family tree
                                            and household hierarchy.
                                        </p>
                                    </div>

                                    {/* Resident Info Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                            Resident Info
                                        </h4>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Select the primary resident. Their
                                            basic details will auto-populate.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-x-6">
                                            <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                                <InputLabel
                                                    htmlFor="resident_image"
                                                    value="Resident Profile"
                                                />
                                                <img
                                                    src={
                                                        data.resident_image
                                                            ? `/storage/${data.resident_image}`
                                                            : "/images/default-avatar.jpg"
                                                    }
                                                    alt="Resident"
                                                    className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
                                                />
                                            </div>

                                            <div className="md:col-span-4 space-y-4">
                                                <DropdownInputField
                                                    label="Resident"
                                                    name="resident_id_name"
                                                    value={
                                                        data.resident_id_name ||
                                                        ""
                                                    }
                                                    placeholder="Select a resident"
                                                    items={residentsList}
                                                    onChange={(id) => {
                                                        const resident =
                                                            residentsList.find(
                                                                (r) =>
                                                                    r.id === id
                                                            );
                                                        if (resident) {
                                                            setData(
                                                                "resident_id",
                                                                resident.id
                                                            );
                                                            setData(
                                                                "resident_id_name",
                                                                resident.name
                                                            );
                                                            setData(
                                                                "resident_image",
                                                                resident.image
                                                            );
                                                            setData(
                                                                "resident_birthdate",
                                                                resident.birthdate
                                                            );
                                                            setData(
                                                                "resident_purok",
                                                                resident.purok_number
                                                            );
                                                        }
                                                    }}
                                                    disabled
                                                />
                                                <InputError
                                                    message={errors.resident_id}
                                                    className="mt-1 text-sm text-red-500"
                                                />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="Birthdate"
                                                        name="resident_birthdate"
                                                        value={
                                                            data.resident_birthdate ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                    <InputField
                                                        label="Purok Number"
                                                        name="resident_purok"
                                                        value={
                                                            data.resident_purok ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Related To Section */}
                                    <div className="space-y-4 mt-6">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                            Related Resident Info
                                        </h4>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Select the related resident and
                                            specify their relationship to the
                                            primary resident.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-x-6">
                                            <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                                <InputLabel
                                                    htmlFor="related_to_image"
                                                    value="Related Resident Profile"
                                                />
                                                <img
                                                    src={
                                                        data.related_to_image
                                                            ? `/storage/${data.related_to_image}`
                                                            : "/images/default-avatar.jpg"
                                                    }
                                                    alt="Related Resident"
                                                    className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
                                                />
                                            </div>

                                            <div className="md:col-span-4 space-y-4">
                                                <DropdownInputField
                                                    label="Related To"
                                                    name="related_to_name"
                                                    value={
                                                        data.related_to_name ||
                                                        ""
                                                    }
                                                    placeholder="Select related resident"
                                                    items={residentsList}
                                                    onChange={(id) => {
                                                        handleRelatedToChange(
                                                            id.target.value
                                                        );
                                                    }}
                                                />
                                                <InputError
                                                    message={errors.related_to}
                                                    className="mt-1 text-sm text-red-500"
                                                />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="Birthdate"
                                                        name="related_to_birthdate"
                                                        value={
                                                            data.related_to_birthdate ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                    <InputField
                                                        label="Purok Number"
                                                        name="related_to_purok"
                                                        value={
                                                            data.related_to_purok ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Relationship Type */}
                                    <div className="mt-6">
                                        <InputLabel value="Relationship Type" />
                                        <p className="text-gray-500 text-sm mb-2">
                                            Select the type of relationship
                                            between the primary resident and the
                                            related resident.
                                        </p>
                                        <SelectField
                                            label="Relationship"
                                            name="relationship"
                                            value={data.relationship}
                                            onChange={(e) =>
                                                setData(
                                                    "relationship",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Select relationship"
                                            items={[
                                                {
                                                    label: "Spouse",
                                                    value: "spouse",
                                                    subtitle:
                                                        "Legally married partner of the head",
                                                },
                                                {
                                                    label: "Child",
                                                    value: "child",
                                                    subtitle:
                                                        "Son or daughter of the head",
                                                },
                                                {
                                                    label: "Sibling",
                                                    value: "sibling",
                                                    subtitle:
                                                        "Brother or sister of the head",
                                                },
                                                {
                                                    label: "Parent",
                                                    value: "parent",
                                                    subtitle:
                                                        "Father or mother of the head",
                                                },
                                            ]}
                                        />
                                        <InputError
                                            message={errors.relationship}
                                            className="mt-1 text-sm text-red-500"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end mt-8">
                                        <Button
                                            className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out"
                                            type="submit"
                                        >
                                            Add Relation
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </SidebarModal>
                    </Suspense>
                </div>
            </>
        </AdminLayout>
    );
}
