import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { CalendarCheck, Plus, RotateCcw } from "lucide-react";
import SelectField from "@/Components/SelectField";
import { Textarea } from "@/Components/ui/textarea";
import { ParticipantSection } from "@/Components/ParticipantSection";
import { Toaster, toast } from "sonner";

export default function Elevate({ residents, blotter_details }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        {
            label: "Blotter Reports",
            href: route("blotter_report.index"),
            showOnMobile: false,
        },
        {
            label: "Summons",
            href: route("summon.index"),
            showOnMobile: false,
        },
        { label: "Elevate to Summon", showOnMobile: true },
    ];

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const mapParticipants = (participants, role) => {
        return (
            participants
                ?.filter((p) => p.role_type === role)
                .map((p) => ({
                    resident_id: p.resident_id || "",
                    resident_name: p.name || p.display_name || "",
                    birthdate: p.resident?.birthdate || "",
                    gender: p.resident?.gender || "",
                    purok_number: p.resident?.purok_number || "",
                    email: p.resident?.email || "",
                    contact_number: p.resident?.contact_number || "",
                    notes: p.notes || "",
                })) || [{ resident_id: "" }]
        );
    };

    const { data, setData, post, errors, reset } = useForm({
        // 📝 Main report details
        type_of_incident: blotter_details?.type_of_incident || "",
        narrative_details: blotter_details?.narrative_details || "",
        actions_taken: blotter_details?.actions_taken || "",
        report_status: blotter_details?.report_status || "pending",
        location: blotter_details?.location || "",
        resolution: blotter_details?.resolution || "",
        recommendations: blotter_details?.recommendations || "",
        incident_date: blotter_details?.incident_date || "",
        recorded_by: blotter_details?.recorded_by || null,

        // 👥 Participants
        complainants: mapParticipants(
            blotter_details?.participants,
            "complainant"
        ),
        respondents: mapParticipants(
            blotter_details?.participants,
            "respondent"
        ),
        witnesses: mapParticipants(blotter_details?.participants, "witness"),

        // 📝 Summon details
        summons: blotter_details?.summons || [],
        newSession:
            {
                session_number: "",
                hearing_date: "",
                session_status: "scheduled",
                session_remarks: "",
            } || {},
        summon_status: blotter_details?.summons?.length
            ? blotter_details.summons[blotter_details.summons.length - 1].status
            : "",
        summon_remarks: blotter_details?.summons?.length
            ? blotter_details.summons[blotter_details.summons.length - 1]
                  .remarks
            : "",
        blotter_id: blotter_details.id,
    });

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("summon.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i} class="mb-1">• ${msg}</div>`
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            className="text-sm text-red-700 space-y-1"
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 5000,
                    closeButton: true,
                });
            },
        });
    };

    // Check if there is an originally scheduled session
    const hasOriginallyScheduledSession = data.summons?.some((s) =>
        s.takes?.some(
            (t) => t.originallyScheduled || t.session_status === "scheduled"
        )
    );

    // Check if any session number has reached 3 or more
    const maxSessionNumberReached = data.summons?.some((s) =>
        s.takes?.some((t) => (t.session_number ?? 0) >= 3)
    );

    // Only show the new session form if neither condition is true
    const showNewSessionForm =
        !hasOriginallyScheduledSession && !maxSessionNumberReached;

    useEffect(() => {
        if (success) {
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
            <Head title="Resident Dashboard" />
            <Toaster richColors />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(blotter_details, undefined, 2)}</pre> */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-2 p-5">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <form onSubmit={onSubmit}>
                                    {/* Form Title & Description */}
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold text-blue-800 mb-2">
                                            {data.summon_status === "closed"
                                                ? "Summon Details (Closed)"
                                                : data.summons?.length > 0 &&
                                                  data.summons[0]?.takes
                                                      ?.length > 0
                                                ? "Update Summon Details"
                                                : "Create Summon Schedule"}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {data.summon_status === "closed" ? (
                                                <>
                                                    This summon has been{" "}
                                                    <span className="font-semibold text-red-600">
                                                        closed
                                                    </span>
                                                    . You can review the blotter
                                                    details, participants, and
                                                    hearing history, but no new
                                                    sessions can be scheduled.
                                                </>
                                            ) : data.summons?.length > 0 &&
                                              data.summons[0]?.takes?.length >
                                                  0 ? (
                                                <>
                                                    You can{" "}
                                                    <span className="font-semibold text-gray-800">
                                                        update summon details
                                                    </span>{" "}
                                                    for this blotter report.
                                                    Review past sessions, adjust
                                                    status or remarks, and make
                                                    necessary updates to the
                                                    summon information.
                                                </>
                                            ) : (
                                                <>
                                                    This form allows you to
                                                    create a{" "}
                                                    <span className="font-semibold text-gray-800">
                                                        summon
                                                    </span>{" "}
                                                    for the selected{" "}
                                                    <span className="font-semibold text-gray-800">
                                                        blotter report
                                                    </span>
                                                    . Review the blotter
                                                    details, update fields like{" "}
                                                    <span className="font-semibold">
                                                        actions taken
                                                    </span>
                                                    ,{" "}
                                                    <span className="font-semibold">
                                                        recommendations
                                                    </span>
                                                    , status, and participants,
                                                    and schedule the new hearing
                                                    session.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    {/* Blotter Details (Read-only) */}
                                    <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow-sm space-y-4">
                                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                                            Blotter Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <InputLabel value="Type of Incident" />
                                                <p className="text-gray-900 font-semibold">
                                                    {data.type_of_incident}
                                                </p>
                                            </div>
                                            <div>
                                                <InputLabel value="Incident Date" />
                                                <p className="text-gray-900 font-semibold">
                                                    {data.incident_date}
                                                </p>
                                            </div>
                                            <div>
                                                <InputLabel value="Location" />
                                                <p className="text-gray-900 font-semibold">
                                                    {data.location}
                                                </p>
                                            </div>
                                            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                                                <InputLabel value="Narrative Details" />
                                                <p className="whitespace-pre-line text-gray-800 font-medium">
                                                    {data.narrative_details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Editable Fields */}
                                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel value="Actions Taken" />
                                            <Textarea
                                                value={data.actions_taken || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "actions_taken",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="What actions were taken?"
                                                rows={3}
                                                className="border-blue-300 focus:ring-blue-400 focus:border-blue-400"
                                            />
                                            <InputError
                                                message={errors.actions_taken}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Recommendations" />
                                            <Textarea
                                                value={
                                                    data.recommendations || ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "recommendations",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Any recommendations?"
                                                rows={3}
                                                className="border-blue-300 focus:ring-blue-400 focus:border-blue-400"
                                            />
                                            <InputError
                                                message={errors.recommendations}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <SelectField
                                                label="Report Status"
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
                                                className="font-semibold text-gray-800"
                                            />
                                            <InputError
                                                message={errors.report_status}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <SelectField
                                                value={data.summon_status || ""}
                                                label="Summon Status"
                                                onChange={(value) =>
                                                    setData(
                                                        "summon_status",
                                                        value.target.value
                                                    )
                                                }
                                                items={[
                                                    {
                                                        label: "On Going",
                                                        value: "on_going",
                                                    },
                                                    {
                                                        label: "Closed",
                                                        value: "closed",
                                                    },
                                                ]}
                                                placeholder="Select Summon Status"
                                                className="font-semibold text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value="Summon Remarks" />
                                        <Textarea
                                            value={data.summon_remarks || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "summon_remarks",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter summon remarks"
                                            rows={3}
                                            className="mb-4 border-blue-300 focus:ring-blue-400 focus:border-blue-400"
                                        />
                                        <InputError
                                            message={errors.summon_remarks}
                                            className="mt-1"
                                        />
                                    </div>
                                    {/* Participants */}
                                    <div className="space-y-6">
                                        <ParticipantSection
                                            title="Complainants"
                                            dataArray={data.complainants}
                                            setDataArray={(arr) =>
                                                setData("complainants", arr)
                                            }
                                            errors={errors}
                                            residentsList={residentsList}
                                            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
                                            disableAdd={
                                                data.summon_status == "closed"
                                            }
                                        />
                                        <ParticipantSection
                                            title="Respondents"
                                            dataArray={data.respondents}
                                            setDataArray={(arr) =>
                                                setData("respondents", arr)
                                            }
                                            errors={errors}
                                            residentsList={residentsList}
                                            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg"
                                            disableAdd={
                                                data.summon_status == "closed"
                                            }
                                        />
                                        <ParticipantSection
                                            title="Witnesses"
                                            dataArray={data.witnesses}
                                            setDataArray={(arr) =>
                                                setData("witnesses", arr)
                                            }
                                            errors={errors}
                                            residentsList={residentsList}
                                            className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg"
                                            disableAdd={
                                                data.summon_status == "closed"
                                            }
                                        />
                                    </div>

                                    {data.summons &&
                                        data.summons.length > 0 && (
                                            <div className="mt-8 p-6 bg-gray-50 border-l-4 border-gray-400 rounded-xl space-y-4 shadow-sm">
                                                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                                                    Previous Summon Sessions
                                                </h3>

                                                {data.summons.map(
                                                    (summon, sIndex) => (
                                                        <div
                                                            key={sIndex}
                                                            className="space-y-3"
                                                        >
                                                            {summon.takes.map(
                                                                (
                                                                    session,
                                                                    tIndex
                                                                ) => {
                                                                    if (
                                                                        session.originallyScheduled ===
                                                                        undefined
                                                                    ) {
                                                                        session.originallyScheduled =
                                                                            session.session_status ===
                                                                            "scheduled";
                                                                    }
                                                                    const wasOriginallyScheduled =
                                                                        session.originallyScheduled;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                tIndex
                                                                            }
                                                                            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-4 bg-white rounded-lg shadow"
                                                                        >
                                                                            {/* Session # */}
                                                                            <div>
                                                                                <InputLabel value="Session #" />
                                                                                {wasOriginallyScheduled ? (
                                                                                    <InputField
                                                                                        type="number"
                                                                                        value={
                                                                                            session.session_number ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const updated =
                                                                                                [
                                                                                                    ...data.summons,
                                                                                                ];
                                                                                            updated[
                                                                                                sIndex
                                                                                            ].takes[
                                                                                                tIndex
                                                                                            ].session_number =
                                                                                                e.target.value;
                                                                                            setData(
                                                                                                "summons",
                                                                                                updated
                                                                                            );
                                                                                        }}
                                                                                        className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 font-semibold rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <p className="text-gray-900 font-semibold">
                                                                                        {
                                                                                            session.session_number
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Hearing Date */}
                                                                            <div>
                                                                                <InputLabel value="Hearing Date" />
                                                                                {wasOriginallyScheduled ? (
                                                                                    <InputField
                                                                                        type="date"
                                                                                        value={
                                                                                            session.hearing_date ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const updated =
                                                                                                [
                                                                                                    ...data.summons,
                                                                                                ];
                                                                                            updated[
                                                                                                sIndex
                                                                                            ].takes[
                                                                                                tIndex
                                                                                            ].hearing_date =
                                                                                                e.target.value;
                                                                                            setData(
                                                                                                "summons",
                                                                                                updated
                                                                                            );
                                                                                        }}
                                                                                        className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 font-semibold rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <p className="text-gray-900 font-semibold">
                                                                                        {
                                                                                            session.hearing_date
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Status */}
                                                                            <div>
                                                                                <InputLabel value="Status" />
                                                                                {wasOriginallyScheduled ? (
                                                                                    <SelectField
                                                                                        value={
                                                                                            session.session_status ||
                                                                                            "scheduled"
                                                                                        }
                                                                                        onChange={(
                                                                                            valueOrEvent
                                                                                        ) => {
                                                                                            const value =
                                                                                                valueOrEvent
                                                                                                    ?.target
                                                                                                    ?.value ??
                                                                                                valueOrEvent;
                                                                                            const updated =
                                                                                                [
                                                                                                    ...data.summons,
                                                                                                ];
                                                                                            updated[
                                                                                                sIndex
                                                                                            ].takes[
                                                                                                tIndex
                                                                                            ].session_status =
                                                                                                value;
                                                                                            setData(
                                                                                                "summons",
                                                                                                updated
                                                                                            );
                                                                                        }}
                                                                                        items={[
                                                                                            {
                                                                                                label: "Scheduled",
                                                                                                value: "scheduled",
                                                                                            },
                                                                                            {
                                                                                                label: "In Progress",
                                                                                                value: "in_progress",
                                                                                            },
                                                                                            {
                                                                                                label: "Completed",
                                                                                                value: "completed",
                                                                                            },
                                                                                            {
                                                                                                label: "Adjourned",
                                                                                                value: "adjourned",
                                                                                            },
                                                                                            {
                                                                                                label: "Cancelled",
                                                                                                value: "cancelled",
                                                                                            },
                                                                                            {
                                                                                                label: "No Show",
                                                                                                value: "no_show",
                                                                                            },
                                                                                        ]}
                                                                                        className="font-semibold text-gray-800 rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <p className="capitalize text-gray-900 font-semibold">
                                                                                        {
                                                                                            session.session_status
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Remarks */}
                                                                            <div>
                                                                                <InputLabel value="Remarks" />
                                                                                {wasOriginallyScheduled ? (
                                                                                    <InputField
                                                                                        value={
                                                                                            session.session_remarks ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const updated =
                                                                                                [
                                                                                                    ...data.summons,
                                                                                                ];
                                                                                            updated[
                                                                                                sIndex
                                                                                            ].takes[
                                                                                                tIndex
                                                                                            ].session_remarks =
                                                                                                e.target.value;
                                                                                            setData(
                                                                                                "summons",
                                                                                                updated
                                                                                            );
                                                                                        }}
                                                                                        placeholder="Optional remarks"
                                                                                        className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 font-medium rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <p className="text-gray-900 font-medium">
                                                                                        {session.session_remarks ||
                                                                                            "-"}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* Show "New Summon Session" form only if NOT closed */}
                                    {data.summon_status !== "closed" &&
                                        showNewSessionForm && (
                                            <div className="mt-8 p-6 bg-gray-50 border-l-4 border-blue-600 rounded-xl space-y-4 shadow-sm">
                                                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                                                    New Summon Session
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    {/* Session # */}
                                                    <div>
                                                        <InputLabel value="Session #" />
                                                        <InputField
                                                            type="number"
                                                            value={
                                                                data.newSession
                                                                    ?.session_number ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "newSession",
                                                                    {
                                                                        ...data.newSession,
                                                                        session_number:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 rounded-lg p-2 w-full font-semibold text-gray-800"
                                                        />
                                                    </div>
                                                    {/* Hearing Date */}
                                                    <div>
                                                        <InputLabel value="Hearing Date" />
                                                        <InputField
                                                            type="date"
                                                            value={
                                                                data.newSession
                                                                    ?.hearing_date ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "newSession",
                                                                    {
                                                                        ...data.newSession,
                                                                        hearing_date:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 rounded-lg p-2 w-full font-semibold text-gray-800"
                                                        />
                                                    </div>
                                                    {/* Session Status */}
                                                    <div>
                                                        <InputLabel value="Session Status" />
                                                        <SelectField
                                                            value={
                                                                data.newSession
                                                                    ?.session_status ||
                                                                "scheduled"
                                                            }
                                                            onChange={(
                                                                valueOrEvent
                                                            ) => {
                                                                const value =
                                                                    valueOrEvent
                                                                        ?.target
                                                                        ?.value ??
                                                                    valueOrEvent;
                                                                setData(
                                                                    "newSession",
                                                                    {
                                                                        ...data.newSession,
                                                                        session_status:
                                                                            value,
                                                                    }
                                                                );
                                                            }}
                                                            items={[
                                                                {
                                                                    label: "Scheduled",
                                                                    value: "scheduled",
                                                                },
                                                                {
                                                                    label: "In Progress",
                                                                    value: "in_progress",
                                                                },
                                                                {
                                                                    label: "Completed",
                                                                    value: "completed",
                                                                },
                                                                {
                                                                    label: "Adjourned",
                                                                    value: "adjourned",
                                                                },
                                                                {
                                                                    label: "Cancelled",
                                                                    value: "cancelled",
                                                                },
                                                                {
                                                                    label: "No Show",
                                                                    value: "no_show",
                                                                },
                                                            ]}
                                                            className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 rounded-lg p-2 w-full font-semibold text-gray-800"
                                                        />
                                                    </div>
                                                    {/* Remarks */}
                                                    <div>
                                                        <InputLabel value="Remarks" />
                                                        <InputField
                                                            value={
                                                                data.newSession
                                                                    ?.session_remarks ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "newSession",
                                                                    {
                                                                        ...data.newSession,
                                                                        session_remarks:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            placeholder="Optional remarks"
                                                            className="border-gray-300 focus:ring-gray-400 focus:border-gray-400 rounded-lg p-2 w-full font-medium text-gray-700"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {/* Submit Buttons */}

                                    <div className="flex w-full justify-end items-center mt-7 gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            className={`w-60 ${
                                                data.summon_status === "closed"
                                                    ? "bg-red-700 hover:bg-red-600"
                                                    : "bg-blue-700 hover:bg-blue-600"
                                            } text-white`}
                                        >
                                            <CalendarCheck className="w-4 h-4 mr-1" />
                                            {data.summon_status === "closed"
                                                ? "Update Summon Details"
                                                : "Create Summon Schedule"}
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
