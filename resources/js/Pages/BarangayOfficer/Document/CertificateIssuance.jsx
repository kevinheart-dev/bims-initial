import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/Components/Pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        }

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/document/fetchplaceholders/${e}`
            );
            console.log("Placeholders:", response.data);

            // Optionally store the placeholders in state
            setData("placeholders", response.data);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
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

        post(route("certificate.store"), data, {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
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
                            <form
                                className="p-10"
                                onSubmit={(e) => onSubmit(e)}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    Certificate Information
                                </h2>
                                <p className="text-xs text-gray-600">
                                    Kindly check the provided personal
                                    information of the resident required.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-full">
                                        <DropdownInputField
                                            label={"Select a Certificate"}
                                            items={documentsList}
                                            value={data.document_name || ""}
                                            onChange={(e) =>
                                                handleDocumentChange(
                                                    e.target.value
                                                )
                                            }
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
                                                    value={
                                                        data.housenumber || ""
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
                                    <div className="flex w-full justify-center items-center mt-7">
                                        <Button className="w-40" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* <div className="w-full bg-gray-50 rounded-xl sm:rounded-lg">
                            <div className="p-4 w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[400px]">
                                                Document Name
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.map((document) => (
                                            <TableRow key={document.id}>
                                                <TableCell className="w-[400px]">
                                                    {document.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        className="bg-blue-700 hover:bg-blue-400"
                                                        onClick={() =>
                                                            window.open(
                                                                route(
                                                                    "document.fill",
                                                                    {
                                                                        resident:
                                                                            resId,
                                                                        template:
                                                                            document.id,
                                                                    }
                                                                ),
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        Issue
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
