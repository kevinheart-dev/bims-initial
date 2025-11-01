import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import { Switch } from "@/Components/ui/switch";
import { toast } from "sonner";

export default function BasicInformation({ details, puroks, streets }) {
    const breadcrumbs = [{ label: "Basic Information", showOnMobile: true }];
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const { data, setData, post, errors, processing } = useForm({
        resident_id: details.id || null,
        firstname: details.firstname || "",
        middlename: details.middlename || "",
        lastname: details.lastname || "",
        maiden_name: details.maiden_name || "",
        suffix: details.suffix || "",
        birthdate: details.birthdate || "",
        birthplace: details.birthplace || "",
        sex: details.sex || "",
        civil_status: details.civil_status || "",
        registered_voter: !!details.registered_voter,
        is_pwd: !!details.is_pwd,
        contact_number: details.contact_number || "",
        email: details.email || "",
        citizenship: details.citizenship || "",
        religion: details.religion || "",
        residency_type: details.residency_type || "",
        residency_date: details.residency_date || "",
        purok_number: details.purok_number?.toString() || "",
        street_id: details.street_id?.toString() || "",
        ethnicity: details.ethnicity || "",
        employment_status: details.employment_status || "",
        is_household_head: !!details.is_household_head,
        is_family_head: !!details.is_family_head,
        is_deceased: !!details.is_deceased,
        // Senior Citizen
        senior_osca_id: details.seniorcitizen?.osca_id_number || "",
        is_pensioner: details.seniorcitizen?.is_pensioner || "no",
        pension_type: details.seniorcitizen?.pension_type || "",
        living_alone: !!details.seniorcitizen?.living_alone,
        // Social Welfare
        is_4ps_beneficiary: !!details.socialwelfareprofile?.is_4ps_beneficiary,
        is_solo_parent: !!details.socialwelfareprofile?.is_solo_parent,
        solo_parent_id_number:
            details.socialwelfareprofile?.solo_parent_id_number || "",
        // Medical Information
        weight_kg: details.medical_information?.weight_kg || "",
        height_cm: details.medical_information?.height_cm || "",
        bmi: details.medical_information?.bmi || "",
        nutrition_status: details.medical_information?.nutrition_status || "",
        blood_type: details.medical_information?.blood_type || "",
        emergency_contact_name:
            details.medical_information?.emergency_contact_name || "",
        emergency_contact_number:
            details.medical_information?.emergency_contact_number || "",
        emergency_contact_relationship:
            details.medical_information?.emergency_contact_relationship || "",
        is_smoker: !!details.medical_information?.is_smoker,
        is_alcohol_user: !!details.medical_information?.is_alcohol_user,
        philhealth_id_number:
            details.medical_information?.philhealth_id_number || "",
        pwd_id_number: details.medical_information?.pwd_id_number || "",
    });

    useEffect(() => {
        if (success)
            toast.success(success, { description: "Operation successful!" });
    }, [success]);

    useEffect(() => {
        if (error) toast.error(error, { description: "Operation failed!" });
    }, [error]);

    const submit = (e) => {
        e.preventDefault();
        post(route("resident.update", data.resident_id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Resident Basic Information" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <pre>{JSON.stringify(details, undefined, 2)}</pre>
            <div className="p-6">
                <div className="mx-auto max-w-7xl bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-6">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Personal Information */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField
                                    label="First Name"
                                    value={data.firstname}
                                    onChange={(e) =>
                                        setData("firstname", e.target.value)
                                    }
                                    error={errors.firstname}
                                />
                                <InputField
                                    label="Middle Name"
                                    value={data.middlename}
                                    onChange={(e) =>
                                        setData("middlename", e.target.value)
                                    }
                                    error={errors.middlename}
                                />
                                <InputField
                                    label="Last Name"
                                    value={data.lastname}
                                    onChange={(e) =>
                                        setData("lastname", e.target.value)
                                    }
                                    error={errors.lastname}
                                />
                                <InputField
                                    label="Maiden Name"
                                    value={data.maiden_name}
                                    onChange={(e) =>
                                        setData("maiden_name", e.target.value)
                                    }
                                    error={errors.maiden_name}
                                />
                                <InputField
                                    label="Suffix"
                                    value={data.suffix}
                                    onChange={(e) =>
                                        setData("suffix", e.target.value)
                                    }
                                    error={errors.suffix}
                                />
                                <InputField
                                    label="Birthdate"
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) =>
                                        setData("birthdate", e.target.value)
                                    }
                                    error={errors.birthdate}
                                />
                                <InputField
                                    label="Birthplace"
                                    value={data.birthplace}
                                    onChange={(e) =>
                                        setData("birthplace", e.target.value)
                                    }
                                    error={errors.birthplace}
                                />
                                <DropdownInputField
                                    label="Sex"
                                    value={data.sex}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                    ]}
                                    onChange={(val) => setData("sex", val)}
                                    error={errors.sex}
                                />
                                <DropdownInputField
                                    label="Civil Status"
                                    value={data.civil_status}
                                    options={[
                                        { value: "single", label: "Single" },
                                        { value: "married", label: "Married" },
                                        { value: "widowed", label: "Widowed" },
                                        {
                                            value: "annulled",
                                            label: "Annulled",
                                        },
                                    ]}
                                    onChange={(val) =>
                                        setData("civil_status", val)
                                    }
                                    error={errors.civil_status}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Registered Voter:</span>
                                    <Switch
                                        checked={data.registered_voter}
                                        onCheckedChange={(val) =>
                                            setData("registered_voter", val)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Person With Disability (PWD):</span>
                                    <Switch
                                        checked={data.is_pwd}
                                        onCheckedChange={(val) =>
                                            setData("is_pwd", val)
                                        }
                                    />
                                </div>
                                <InputField
                                    label="Contact Number"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value
                                        )
                                    }
                                    error={errors.contact_number}
                                />
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    error={errors.email}
                                />
                                <InputField
                                    label="Citizenship"
                                    value={data.citizenship}
                                    onChange={(e) =>
                                        setData("citizenship", e.target.value)
                                    }
                                    error={errors.citizenship}
                                />
                                <InputField
                                    label="Religion"
                                    value={data.religion}
                                    onChange={(e) =>
                                        setData("religion", e.target.value)
                                    }
                                    error={errors.religion}
                                />
                                <DropdownInputField
                                    label="Residency Type"
                                    value={data.residency_type}
                                    options={[
                                        {
                                            value: "permanent",
                                            label: "Permanent",
                                        },
                                        {
                                            value: "temporary",
                                            label: "Temporary",
                                        },
                                    ]}
                                    onChange={(val) =>
                                        setData("residency_type", val)
                                    }
                                    error={errors.residency_type}
                                />
                                <InputField
                                    label="Residency Date"
                                    type="date"
                                    value={data.residency_date}
                                    onChange={(e) =>
                                        setData(
                                            "residency_date",
                                            e.target.value
                                        )
                                    }
                                    error={errors.residency_date}
                                />
                                <DropdownInputField
                                    label="Purok"
                                    value={data.purok_number}
                                    options={puroks.map((p) => ({
                                        value: p.purok_number.toString(),
                                        label: `Purok ${p.purok_number}`,
                                    }))}
                                    onChange={(val) =>
                                        setData("purok_number", val)
                                    }
                                    error={errors.purok_number}
                                />
                                <DropdownInputField
                                    label="Street"
                                    value={data.street_id}
                                    options={streets.map((s) => ({
                                        value: s.id.toString(),
                                        label: s.street_name,
                                    }))}
                                    onChange={(val) =>
                                        setData("street_id", val)
                                    }
                                    error={errors.street_id}
                                />
                            </div>
                        </section>

                        {/* Ethnicity & Employment */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Ethnicity & Employment
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField
                                    label="Ethnicity"
                                    value={data.ethnicity}
                                    onChange={(e) =>
                                        setData("ethnicity", e.target.value)
                                    }
                                    error={errors.ethnicity}
                                />
                                <DropdownInputField
                                    label="Employment Status"
                                    value={data.employment_status}
                                    options={[
                                        {
                                            value: "employed",
                                            label: "Employed",
                                        },
                                        {
                                            value: "unemployed",
                                            label: "Unemployed",
                                        },
                                        { value: "retired", label: "Retired" },
                                    ]}
                                    onChange={(val) =>
                                        setData("employment_status", val)
                                    }
                                    error={errors.employment_status}
                                />
                            </div>
                        </section>

                        {/* Household / Family */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Household / Family
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>Household Head:</span>
                                    <Switch
                                        checked={data.is_household_head}
                                        onCheckedChange={(val) =>
                                            setData("is_household_head", val)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Family Head:</span>
                                    <Switch
                                        checked={data.is_family_head}
                                        onCheckedChange={(val) =>
                                            setData("is_family_head", val)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Deceased:</span>
                                    <Switch
                                        checked={data.is_deceased}
                                        onCheckedChange={(val) =>
                                            setData("is_deceased", val)
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Senior Citizen */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Senior Citizen Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField
                                    label="OSCA ID"
                                    value={data.senior_osca_id}
                                    onChange={(e) =>
                                        setData(
                                            "senior_osca_id",
                                            e.target.value
                                        )
                                    }
                                    error={errors.senior_osca_id}
                                />
                                <DropdownInputField
                                    label="Pensioner Status"
                                    value={data.is_pensioner}
                                    options={[
                                        { value: "yes", label: "Yes" },
                                        { value: "no", label: "No" },
                                    ]}
                                    onChange={(val) =>
                                        setData("is_pensioner", val)
                                    }
                                    error={errors.is_pensioner}
                                />
                                <InputField
                                    label="Pension Type"
                                    value={data.pension_type}
                                    onChange={(e) =>
                                        setData("pension_type", e.target.value)
                                    }
                                    error={errors.pension_type}
                                />
                                <div className="flex items-center gap-2">
                                    <span>Living Alone:</span>
                                    <Switch
                                        checked={data.living_alone}
                                        onCheckedChange={(val) =>
                                            setData("living_alone", val)
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Social Welfare */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Social Welfare Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <span>4Ps Beneficiary:</span>
                                    <Switch
                                        checked={data.is_4ps_beneficiary}
                                        onCheckedChange={(val) =>
                                            setData("is_4ps_beneficiary", val)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Solo Parent:</span>
                                    <Switch
                                        checked={data.is_solo_parent}
                                        onCheckedChange={(val) =>
                                            setData("is_solo_parent", val)
                                        }
                                    />
                                </div>
                                <InputField
                                    label="Solo Parent ID Number"
                                    value={data.solo_parent_id_number}
                                    onChange={(e) =>
                                        setData(
                                            "solo_parent_id_number",
                                            e.target.value
                                        )
                                    }
                                    error={errors.solo_parent_id_number}
                                />
                            </div>
                        </section>

                        {/* Medical Information */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Medical Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField
                                    label="Weight (kg)"
                                    value={data.weight_kg}
                                    onChange={(e) =>
                                        setData("weight_kg", e.target.value)
                                    }
                                    error={errors.weight_kg}
                                />
                                <InputField
                                    label="Height (cm)"
                                    value={data.height_cm}
                                    onChange={(e) =>
                                        setData("height_cm", e.target.value)
                                    }
                                    error={errors.height_cm}
                                />
                                <InputField
                                    label="BMI"
                                    value={data.bmi}
                                    onChange={(e) =>
                                        setData("bmi", e.target.value)
                                    }
                                    error={errors.bmi}
                                />
                                <InputField
                                    label="Nutrition Status"
                                    value={data.nutrition_status}
                                    onChange={(e) =>
                                        setData(
                                            "nutrition_status",
                                            e.target.value
                                        )
                                    }
                                    error={errors.nutrition_status}
                                />
                                <InputField
                                    label="Blood Type"
                                    value={data.blood_type}
                                    onChange={(e) =>
                                        setData("blood_type", e.target.value)
                                    }
                                    error={errors.blood_type}
                                />
                                <InputField
                                    label="Emergency Contact Name"
                                    value={data.emergency_contact_name}
                                    onChange={(e) =>
                                        setData(
                                            "emergency_contact_name",
                                            e.target.value
                                        )
                                    }
                                    error={errors.emergency_contact_name}
                                />
                                <InputField
                                    label="Emergency Contact Number"
                                    value={data.emergency_contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "emergency_contact_number",
                                            e.target.value
                                        )
                                    }
                                    error={errors.emergency_contact_number}
                                />
                                <InputField
                                    label="Emergency Contact Relationship"
                                    value={data.emergency_contact_relationship}
                                    onChange={(e) =>
                                        setData(
                                            "emergency_contact_relationship",
                                            e.target.value
                                        )
                                    }
                                    error={
                                        errors.emergency_contact_relationship
                                    }
                                />
                                <div className="flex items-center gap-2">
                                    <span>Smoker:</span>
                                    <Switch
                                        checked={data.is_smoker}
                                        onCheckedChange={(val) =>
                                            setData("is_smoker", val)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Alcohol User:</span>
                                    <Switch
                                        checked={data.is_alcohol_user}
                                        onCheckedChange={(val) =>
                                            setData("is_alcohol_user", val)
                                        }
                                    />
                                </div>
                                <InputField
                                    label="PhilHealth ID"
                                    value={data.philhealth_id_number}
                                    onChange={(e) =>
                                        setData(
                                            "philhealth_id_number",
                                            e.target.value
                                        )
                                    }
                                    error={errors.philhealth_id_number}
                                />
                                <InputField
                                    label="PWD ID"
                                    value={data.pwd_id_number}
                                    onChange={(e) =>
                                        setData("pwd_id_number", e.target.value)
                                    }
                                    error={errors.pwd_id_number}
                                />
                            </div>
                        </section>

                        <div className="pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? "Saving..."
                                    : "Update Information"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
