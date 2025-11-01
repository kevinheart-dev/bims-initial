import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { RotateCcw, FilePenLine, Save } from "lucide-react";
import SelectField from "@/Components/SelectField";
import { Textarea } from "@/Components/ui/textarea";
import { ParticipantSection } from "@/Components/ParticipantSection";
import { Toaster, toast } from "sonner";
import { toSentenceCase, toTitleCase } from "@/utils/stringFormat";

export default function Create({ residents }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        {
            label: "Blotter Reports",
            href: route("blotter_report.index"),
            showOnMobile: false,
        },
        { label: "Create a Blotter Report", showOnMobile: true },
    ];

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const { data, setData, post, errors, reset } = useForm({
        type_of_incident: "",
        narrative_details: "",
        actions_taken: "",
        report_status: "",
        location: "",
        resolution: "",
        recommendations: "",
        incident_date: "",

        recorded_by: null,
        complainants: [{ resident_id: "" }],
        respondents: [{ resident_id: "" }],
        witnesses: [{ resident_id: "" }],
        attachments: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("blotter_report.store"), {
            onError: (errors) => {
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

    const residentsList = residents.map((r) => ({
        value: r.id,
        label: `${r.firstname} ${r.middlename ? r.middlename + " " : ""}${r.lastname
            }${r.suffix ? ", " + r.suffix : ""}`,
        ...r, // keep all original fields
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
        props.success = null;
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Blotter Report" />
            <Toaster richColors />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(residents, undefined, 2)}</pre> */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-2">
                        <div className=" my-2 p-2">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <form onSubmit={onSubmit}>
                                    <div className="flex items-start gap-3 p-4 mb-6 bg-gray-50 rounded-xl shadow-sm">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <FilePenLine className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-1">
                                                Blotter Report Form
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                Fill out the details of the
                                                incident, including
                                                participants, actions, and
                                                recommendations. Ensure all
                                                required fields are completed
                                                before submitting.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div>
                                            <InputField
                                                label="Type of Incident"
                                                name="type_of_incident"
                                                value={data.type_of_incident}
                                                onChange={(e) =>
                                                    setData(
                                                        "type_of_incident",
                                                        toTitleCase(e.target.value)
                                                    )
                                                }
                                                placeholder="Ex: Theft, Violence"
                                            />
                                            <InputError
                                                message={
                                                    errors.type_of_incident
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                type="datetime-local" // changed from "date"
                                                label="Incident Date & Time"
                                                name="incident_date"
                                                value={data.incident_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "incident_date",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.incident_date}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Location"
                                                name="location"
                                                value={data.location}
                                                onChange={(e) =>
                                                    setData(
                                                        "location",
                                                        toTitleCase(e.target.value)
                                                    )
                                                }
                                                placeholder="Incident Location"
                                            />
                                            <InputError
                                                message={errors.location}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Report Status"
                                                name="report_status"
                                                value={data.report_status || ""}
                                                onChange={(value) =>
                                                    setData(
                                                        "report_status",
                                                        value.target.value
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "Pending",
                                                        value: "pending",
                                                    },
                                                    {
                                                        label: "On Going",
                                                        value: "on_going",
                                                    },
                                                    {
                                                        label: "Resolved",
                                                        value: "resolved",
                                                    },
                                                    {
                                                        label: "Elevated",
                                                        value: "elevated",
                                                    },
                                                ]}
                                                placeholder="Select Status"
                                            />
                                            <InputError
                                                message={errors.report_status}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <InputLabel value="Narrative Details" />
                                            <Textarea
                                                name="narrative_details"
                                                value={data.narrative_details}
                                                onChange={(e) =>
                                                    setData(
                                                        "narrative_details",
                                                        toSentenceCase(e.target.value)
                                                    )
                                                }
                                                placeholder="Describe what happened in details..."
                                                rows={5}
                                            />
                                            <InputError
                                                message={
                                                    errors.narrative_details
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Actions Taken" />
                                            <Textarea
                                                name="actions_taken"
                                                value={data.actions_taken}
                                                onChange={(e) =>
                                                    setData(
                                                        "actions_taken",
                                                        toSentenceCase(e.target.value)
                                                    )
                                                }
                                                placeholder="What immediate actions were taken?"
                                                rows={5} // Consistent rows with Narrative Details for visual alignment
                                            />
                                            <InputError
                                                message={errors.actions_taken}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Resolution" />
                                            <Textarea
                                                name="resolution"
                                                value={data.resolution}
                                                onChange={(e) =>
                                                    setData(
                                                        "resolution",
                                                        toSentenceCase(e.target.value)
                                                    )
                                                }
                                                placeholder="Resolution or settlement details..."
                                                rows={4}
                                            />
                                            <InputError
                                                message={errors.resolution}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel value="Recommendations" />
                                            <Textarea
                                                name="recommendations"
                                                value={data.recommendations}
                                                onChange={(e) =>
                                                    setData(
                                                        "recommendations",
                                                        toSentenceCase(e.target.value)
                                                    )
                                                }
                                                placeholder="Any recommendations for next steps..."
                                                rows={4}
                                            />
                                            <InputError
                                                message={errors.recommendations}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Participants */}
                                    <ParticipantSection
                                        title="Complainants"
                                        dataArray={data.complainants}
                                        setDataArray={(arr) =>
                                            setData("complainants", arr)
                                        }
                                        errors={errors}
                                        residentsList={residentsList}
                                    />
                                    <ParticipantSection
                                        title="Respondents"
                                        dataArray={data.respondents}
                                        setDataArray={(arr) =>
                                            setData("respondents", arr)
                                        }
                                        errors={errors}
                                        residentsList={residentsList}
                                    />
                                    <ParticipantSection
                                        title="Witnesses"
                                        dataArray={data.witnesses}
                                        setDataArray={(arr) =>
                                            setData("witnesses", arr)
                                        }
                                        errors={errors}
                                        residentsList={residentsList}
                                    />

                                    <div className="flex w-full justify-end items-center mt-4 gap-4 pt-0">
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                            variant="outline"
                                            className="text-gray-600 border-gray-300 hover:bg-gray-50 transition duration-150"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Reset Form
                                        </Button>

                                        <Button
                                            type="submit"
                                            className="w-40 bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-md"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Submit Report
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
