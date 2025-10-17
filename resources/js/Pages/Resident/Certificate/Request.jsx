// src/Pages/BarangayOfficer/Request.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import DropdownInputField from "@/components/DropdownInputField";
import InputError from "@/components/InputError";
import { RotateCcw, FileWarning } from "lucide-react";

const Request = ({
    data,
    setData,
    errors,
    documentsList,
    handleDocumentChange,
    handleRequest,
    reset,
    defaultPlacehodlers = [],
}) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl p-8 my-8 border border-gray-100">
            {/* Certificate Selection */}
            <section className="space-y-3 pb-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                    Certificate Request
                </h2>
                <p className="text-sm text-gray-500">
                    Choose the type of certificate you need and submit your
                    request to the barangay office. Once processed, your
                    certificate will be available for pickup.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <DropdownInputField
                            label="Select a Certificate"
                            items={documentsList}
                            value={data.document_name || ""}
                            onChange={(e) =>
                                handleDocumentChange(e.target.value)
                            }
                            disabled={documentsList.length === 0}
                        />
                        <InputError
                            message={errors.document_id}
                            className="mt-1"
                        />

                        {documentsList.length > 0 ? (
                            <p className="text-xs text-gray-400 mt-1">
                                Example: Certificate of Indigency, Residency,
                                etc.
                            </p>
                        ) : (
                            <p className="flex items-center text-sm text-red-500 mt-2 font-medium gap-2">
                                <FileWarning className="w-8 h-8 flex-shrink-0" />
                                <span>
                                    No certificates are currently available.
                                    <br />
                                    Please contact your barangay office for
                                    assistance.
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Purpose */}
            <section className="space-y-3 py-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Purpose</h2>
                <p className="text-sm text-gray-500">
                    Provide the purpose of the certificate. This will appear in
                    the certification document.
                </p>

                <div className="space-y-5">
                    <div>
                        <InputField
                            label="Purpose"
                            value={data.purpose || ""}
                            onChange={(e) => setData("purpose", e.target.value)}
                        />
                        <InputError message={errors.purpose} className="mt-1" />
                        <p className="text-xs text-gray-400 mt-1">
                            Example: Scholarship requirement, job application,
                            financial assistance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Additional Information */}
            {data.placeholders?.length > 0 && (
                <section className="space-y-3 py-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Additional Information
                    </h2>
                    <p className="text-sm text-gray-500">
                        Some templates require extra details. Fill out the
                        fields below if they are present in the template.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {data.placeholders
                            .filter((p) => !defaultPlacehodlers.includes(p))
                            .map((placeholder, i) => (
                                <div key={i}>
                                    <InputField
                                        label={toPascalCase(placeholder)}
                                        value={data[placeholder] || ""}
                                        onChange={(e) =>
                                            setData(placeholder, e.target.value)
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
                </section>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
                <Button
                    type="button"
                    onClick={() => reset()}
                    variant="outline"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <RotateCcw className="w-4 h-4" /> Reset
                </Button>
                <Button
                    onClick={handleRequest}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
                    disabled={!documentsList}
                >
                    Request Certificate
                </Button>
            </div>
        </div>
    );
};

export default Request;
