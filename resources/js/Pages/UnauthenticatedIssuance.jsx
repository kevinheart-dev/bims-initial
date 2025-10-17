import { Head, Link, router, useForm } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import Header from "@/Components/Homepage/Header";
import useAppUrl from "@/hooks/useAppUrl";
import axios from "axios";
import { Toaster, toast } from "sonner";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import DropdownInputField from "@/Components/DropdownInputField";
import { RotateCcw } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function Welcome({ auth, barangays = [] }) {
    const defaultPlaceholders = [
        "fullname_2",
        "civil_status_2",
        "purpose_2",
        "day_2",
        "month_2",
        "year_2",
        "issued_on",
        "day",
        "month",
        "year",
    ];

    const APP_URL = useAppUrl();

    const [documentsList, setDocumentsList] = useState([]);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            barangay_name: "",
            barangay_id: null,
            document_id: null,
            document_name: "",
            purpose: "",
            placeholders: null,
        });

    const isDualTemplate = (data.placeholders || []).some((ph) =>
        ph.endsWith("_2")
    );

    const handleBarangayChange = async (value) => {
        const selectedBarangay = barangays.find(
            (b) => b.id.toString() === value
        );

        if (selectedBarangay) {
            // Update form data
            setData({
                ...data,
                barangay_id: selectedBarangay.id,
                barangay_name: selectedBarangay.barangay_name,
                document_name: "", // reset document when barangay changes
            });

            try {
                // Fetch documents for the selected barangay
                const response = await axios.get(
                    `${APP_URL}/request-certificate-documents/${selectedBarangay.id}`
                );

                // Update the document dropdown list
                setDocumentsList(
                    response.data.documents.map((document) => ({
                        label: document.name.replace(/\s+/g, " ").trim(),
                        value: document.id.toString(),
                    }))
                );
            } catch (error) {
                console.error("Error fetching documents:", error);
                setDocumentsList([]); // clear list on error
            }
        } else {
            // Reset barangay-related data if none selected
            setData({
                ...data,
                barangay_id: "",
                barangay_name: "",
                document_name: "",
            });
            setDocumentsList([]);
        }
    };

    const toPascalCase = (str) =>
        str
            .toLowerCase()
            .replace(/_/g, " ") // replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const handleDocumentChange = async (e) => {
        const cert = documentsList.find((c) => c.value == e);
        if (cert) {
            setData("document_name", cert.label);
            setData("document_id", cert.value);
            try {
                const response = await axios.get(
                    `${APP_URL}/request-certificate-placeholders/${e}`
                );
                setData("placeholders", response.data.placeholders);
            } catch (error) {
                console.error("Error fetching placeholders:", error);
            }
        }
    };

    const barangaysList = barangays.map((b) => ({
        label: b.barangay_name,
        value: b.id.toString(), // ensure string for dropdown compatibility
    }));

    const handleRequest = (e) => {
        e.preventDefault(); // prevent page reload

        clearErrors(); // clear previous validation errors

        // Client-side validation
        const newErrors = {};
        if (!data.barangay_id)
            newErrors.barangay_id = "Please select a barangay.";
        if (!data.document_id)
            newErrors.document_id = "Please select a certificate.";
        if (!data.purpose || data.purpose.trim() === "")
            newErrors.purpose = "Purpose is required.";

        // Validate dynamic placeholders
        (data.placeholders || [])
            .filter((ph) => !defaultPlaceholders.includes(ph))
            .forEach((ph) => {
                if (!data[ph] || data[ph].trim() === "") {
                    newErrors[ph] = `${ph
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                        )} is required.`;
                }
            });

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            toast.error("Validation failed", {
                description: "Please fill in all required fields.",
                duration: 4000,
                className: "bg-red-100 text-red-800",
            });
            return;
        }

        // Send request via Inertia
        post(route("request.storerequest"), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Certificate request submitted successfully!", {
                    duration: 4000,
                    className: "bg-green-100 text-green-800",
                });
                reset(); // reset form
            },
            onError: (errs) => {
                const messages = Object.values(errs).flat();
                toast.error("Validation Error", {
                    description: (
                        <ul className="list-disc pl-5">
                            {messages.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    ),
                    duration: 5000,
                });
            },
        });
    };

    return (
        <>
            <Head title="Request Certificate" />
            <Header auth={auth} />
            <div className="max-w-5xl mx-auto px-4 py-10">
                <form
                    onSubmit={handleRequest}
                    className="bg-white shadow-xl rounded-2xl p-8 my-10 space-y-10 border border-gray-100"
                >
                    {/* Certificate & Barangay Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Certificate & Barangay Selection
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Choose the type of certificate to issue and select
                            the barangay for which it will be generated.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <DropdownInputField
                                    label="Select a Barangay"
                                    items={barangaysList}
                                    value={data.barangay_id?.toString() || ""}
                                    onChange={(e) =>
                                        handleBarangayChange(e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.barangay_name}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    The barangay for which this certificate will
                                    be issued.
                                </p>
                            </div>

                            {/* Certificate Selection */}
                            <div>
                                <DropdownInputField
                                    label="Select a Certificate"
                                    items={documentsList}
                                    value={data.document_id?.toString() || ""}
                                    onChange={(e) =>
                                        handleDocumentChange(e.target.value)
                                    }
                                    disabled={
                                        !data.barangay_id ||
                                        documentsList.length === 0
                                    } // disable if none available
                                />
                                <InputError
                                    message={errors.document_id}
                                    className="mt-1"
                                />

                                {/* Show helper or empty list message */}
                                {data.barangay_id ? (
                                    documentsList.length > 0 ? (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Example: Certificate of Indigency,
                                            Residency, etc.
                                        </p>
                                    ) : (
                                        <p className="text-xs text-red-500 mt-1">
                                            No certificates available for this
                                            barangay.
                                        </p>
                                    )
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Please select a barangay first.
                                    </p>
                                )}
                            </div>

                            {/* Dual Barangay (if applicable) */}
                            {isDualTemplate && (
                                <div className="md:col-span-2">
                                    <DropdownInputField
                                        label="Select Second Barangay"
                                        items={barangaysList}
                                        value={data.barangay_name_2}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_name_2",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.barangay_name_2}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Some certificates require two barangays
                                        (e.g., shared jurisdiction or
                                        inter-barangay projects).
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Purpose Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Purpose
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Provide the purpose of the certificate. This will
                            appear in the certification document.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <InputField
                                    label="Purpose"
                                    value={data.purpose}
                                    onChange={(e) =>
                                        setData("purpose", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.purpose}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Example: Inter-barangay coordination,
                                    project request, collaboration, etc.
                                </p>
                            </div>

                            {isDualTemplate && (
                                <div>
                                    <InputField
                                        label="Purpose (Second Barangay)"
                                        value={data.purpose_2}
                                        onChange={(e) =>
                                            setData("purpose_2", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.purpose_2}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Provide a separate purpose if the second
                                        barangay requires one.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Placeholders */}
                    {data.placeholders?.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Additional Information
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Some templates require extra details. Fill out
                                the fields below if they are present in the
                                template.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.placeholders
                                    .filter(
                                        (p) => !defaultPlaceholders.includes(p)
                                    )
                                    .map((placeholder, i) => (
                                        <div key={i}>
                                            <InputField
                                                label={toPascalCase(
                                                    placeholder
                                                )}
                                                value={data[placeholder] || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        placeholder,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors[placeholder]}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                Provide information for{" "}
                                                <span className="font-medium">
                                                    {toPascalCase(placeholder)}
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center border-t pt-6">
                        <Button
                            type="button"
                            onClick={() => reset()}
                            variant="outline"
                            className="flex items-center gap-2 text-gray-500"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
                            disabled={
                                processing ||
                                !data.barangay_id ||
                                !data.document_id ||
                                documentsList.length === 0
                            } // Disable if form not ready
                        >
                            {processing
                                ? "Requesting..."
                                : "Request Certificate"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
