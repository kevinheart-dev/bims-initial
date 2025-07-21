import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FilePlus2, FileUp, SquarePlus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import * as CONSTANTS from "@/constants";
import useAppUrl from "@/hooks/useAppUrl";

export default function Index({ documents, residents }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Documents", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();

    const { data, setData, post, errors } = useForm({
        resident_id: null,
        resident_name: "",
        document_id: null,
        document_name: "",
        birthdate: null,
        age: null,
        civil_status: "",
        resident_image: "",
        ethnicity: "",
        purok_number: null,
        street_name: "",
        housenumber: "",
        residency_date: "",
        residency_type: "",
        purpose: "",
        placeholders: null,
    });

    const calculateAge = (birthdate) => {
        if (!birthdate) return "Unknown";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleDocumentChange = async (e) => {
        const cert = documents.find((c) => c.id == e);

        if (cert) {
            setData("document_name", cert.name);
            setData("document_id", cert.id);
            try {
                const response = await axios.get(
                    `${APP_URL}/barangay_officer/document/fetchplaceholders/${e}`
                );
                console.log("Placeholders:", response.data);

                // Optionally store the placeholders in state
                setData("placeholders", response.data.placeholders);
            } catch (error) {
                console.error("Error fetching placeholders:", error);
            }
        }
    };

    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = residents.find((r) => r.id == resident_id);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("gender", resident.gender);
            setData("birthdate", resident.birthdate);
            setData("age", calculateAge(resident.birthdate));
            setData("housenumber", resident.latest_household.house_number);
            setData("civil_status", resident.civil_status);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const residentsList = residents.map((resident) => ({
        label: `${resident.firstname} ${resident.middlename ?? ""} ${
            resident.lastname
        }${resident.suffix ? ", " + resident.suffix : ""}`
            .replace(/\s+/g, " ")
            .trim(),
        value: resident.id,
    }));

    const documentsList = documents.map((document) => ({
        label: document.name.replace(/\s+/g, " ").trim(),
        value: document.id,
    }));

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("certificate.store"));
    };

    const handleIssue = async () => {
        if (!data.resident_id || !data.document_id) {
            alert("Please select both a resident and a certificate.");
            return;
        }
        const payload = {
            document_id: data.document_id,
            resident_id: data.resident_id,
            purpose: data.purpose,
            ...Object.fromEntries(
                (data.placeholders || [])
                    .filter(
                        (placeholder) =>
                            ![
                                "fullname",
                                "day",
                                "month",
                                "year",
                                "ctrl_no",
                                "civil_status",
                                "purpose",
                            ].includes(placeholder)
                    )
                    .map((placeholder) => [
                        placeholder,
                        data[placeholder] || "",
                    ])
            ),
        };

        try {
            const response = await axios.post(
                route("certificate.store"), // Laravel route
                payload,
                {
                    responseType: "blob", // important for downloading file
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Use a smart filename if available
            const contentDisposition = response.headers["content-disposition"];
            const match = contentDisposition?.match(/filename="?([^"]+)"?/);
            const filename = match ? match[1] : "certificate.docx";

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Optionally show success alert
            console.log("Success", "Document issued successfully.");
        } catch (error) {
            console.error("Issuance failed", error);
        }
    };

    return (
        <AdminLayout>
            <Head title="Documents Dashboard" />
            <div>
                {/* <pre>{JSON.stringify(residents, undefined, 3)}</pre> */}
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="container mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/*
                     */}
                    <div className="flex justify-between overflow-hidden shadow-sm rounded-xl sm:rounded-lg p-4 my-8 bg-gray-100">
                        <div className="w-full">
                            <p className="text-4xl font-bold text-center ">
                                Certificate Issuance
                            </p>

                            <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                Certificate Information
                            </h2>
                            <p className="text-xs text-gray-600">
                                Kindly check the provided personal information
                                of the resident required.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-full">
                                    <DropdownInputField
                                        label={"Select a Certificate"}
                                        items={documentsList}
                                        value={data.document_name || ""}
                                        onChange={(e) =>
                                            handleDocumentChange(e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.document_id}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-full">
                                    <DropdownInputField
                                        label={"Select a Resident"}
                                        items={residentsList}
                                        value={data.resident_name || ""}
                                        onChange={(e) =>
                                            handleResidentChange(e)
                                        }
                                    />
                                    <InputError
                                        message={errors.resident_id}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5">
                                    <div className="md:row-span-2 flex flex-col items-center space-y-2">
                                        <InputLabel
                                            htmlFor={`resident_image`}
                                            value="Profile Photo"
                                        />
                                        <img
                                            src={
                                                data.resident_image
                                                    ? `/storage/${data.resident_image}`
                                                    : "/images/default-avatar.jpg"
                                            }
                                            alt={`Resident Image`}
                                            className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                        />
                                    </div>
                                    <div className="md:col-span-5 space-y-2">
                                        <div className="w-full">
                                            <DropdownInputField
                                                label="Purpose"
                                                value={data.purpose || ""}
                                                name="purpose"
                                                placeholder="Enter the purpose of the certificate"
                                                onChange={(e) =>
                                                    setData(
                                                        "purpose",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                            <div>
                                                <InputField
                                                    label="Birthdate"
                                                    name="birthdate"
                                                    value={data.birthdate}
                                                    placeholder="Select a resident"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Gender"
                                                    name="gender"
                                                    value={data.gender}
                                                    placeholder="Select a resident"
                                                    readOnly={true}
                                                />
                                            </div>{" "}
                                            <InputField
                                                label="Civil Status"
                                                name="civil_status"
                                                value={
                                                    CONSTANTS
                                                        .RESIDENT_CIVIL_STATUS_TEXT[
                                                        data.civil_status
                                                    ] || ""
                                                }
                                                readOnly
                                            />
                                            <InputField
                                                label="House Number"
                                                name="housenumber"
                                                value={data.housenumber || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center gap-4">
                                    {data.placeholders
                                        ?.filter(
                                            (placeholder) =>
                                                ![
                                                    "fullname",
                                                    "day",
                                                    "month",
                                                    "year",
                                                    "ctrl_no",
                                                    "civil_status",
                                                    "purpose",
                                                ].includes(placeholder)
                                        )
                                        .map((placeholder, index) => (
                                            <InputField
                                                key={index}
                                                label={placeholder}
                                                name={placeholder}
                                                value={data[placeholder] || ""}
                                                onChange={(e) =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        [placeholder]:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        ))}
                                </div>
                                <div className="flex w-full justify-center items-center mt-7">
                                    <Button
                                        onClick={handleIssue}
                                        className="bg-blue-700 hover:bg-blue-400"
                                        disabled={
                                            !data.resident_id ||
                                            !data.document_id
                                        }
                                    >
                                        Issue
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
