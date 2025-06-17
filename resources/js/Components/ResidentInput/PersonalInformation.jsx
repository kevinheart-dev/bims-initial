import { useState, useEffect, useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import {
    IoIosAddCircleOutline,
    IoIosArrowDown,
    IoIosArrowUp,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import { Button } from "../ui/button";
import TextInput from "../TextInput";
import InputLabel from "../InputLabel";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";

const PersonalInformation = ({ puroks, occupationTypes = null }) => {
    const { data, setData, post, errors } = useForm({
        resident_image: null,
        lastname: "",
        firstname: "",
        middlename: "",
        suffix: "",
        birthdate: "",
        age: 0,
        birthplace: "",
        civil_status: "",
        gender: "",
        maiden_middle_name: "",
        citizenship: "",
        religion: "",
        ethnicity: "",
        contactNumber: "",
        email: "",
        residency_type: "",
        residency_date: "",
        purok_number: "",
        registered_voter: 0,
        is_student: 0,
        school_name: "",
        school_type: "",
        current_level: "",
        education: "",
        education_status: "",
        osc: 0,
        osy: 0,
        year_started: "",
        year_ended: "",
        program: "",
        year_graduated: "",
        occupations: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("resident.store"));
    };

    const showMaidenMiddleName =
        ["female", "LGBTQ"].includes(data.gender) &&
        ["married", "widowed", "Separated"].includes(data.civil_status);

    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
    };

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    return (
        <div>
            <form onSubmit={onSubmit}>
                {/* Section 1 */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                        Resident Information
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Kindly provide the personal information of the resident.
                    </p>
                </div>
                {/* image, firstname, lastname, middlename, maidenname, suffix */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                        <InputLabel
                            htmlFor="resident-image-path"
                            value="Resident Image"
                        />

                        <img
                            src={
                                data.resident_image instanceof File
                                    ? URL.createObjectURL(data.resident_image)
                                    : data.resident_image ||
                                      "/images/default-avatar.jpg"
                            }
                            alt="Resident"
                            className="w-40 h-40 object-cover rounded-full mb-4"
                        />

                        <TextInput
                            id="resident-image-path"
                            type="file"
                            name="resident_image"
                            className="mt-1"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData("resident_image", file);
                                }
                            }}
                        />

                        <InputError
                            message={errors.resident_image}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col w-full items-stretch">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <InputField
                                    label="Last Name"
                                    name="lastname"
                                    value={data.lastname || ""}
                                    placeholder="Enter last name"
                                    onChange={(e) => {
                                        setData("lastname", e.target.value);
                                    }}
                                />
                                <InputError
                                    message={errors.lastname}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="First Name"
                                    name="firstname"
                                    value={data.firstname}
                                    placeholder="Enter first name"
                                    onChange={(e) => {
                                        setData("firstname", e.target.value);
                                    }}
                                />
                                <InputError
                                    message={errors.firstname}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div
                            className={`grid gap-4 ${
                                showMaidenMiddleName
                                    ? "grid-cols-3"
                                    : "grid-cols-2"
                            } md:${
                                showMaidenMiddleName
                                    ? "grid-cols-3"
                                    : "grid-cols-2"
                            }`}
                        >
                            <div>
                                <InputField
                                    label="Middle Name"
                                    name="middlename"
                                    value={data.middlename}
                                    placeholder="Enter middle name"
                                    onChange={(e) => {
                                        setData("middlename", e.target.value);
                                    }}
                                />
                                <InputError
                                    message={errors.middlename}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Suffix"
                                    name="suffix"
                                    value={data.suffix}
                                    items={["Jr.", "Sr.", "III", "IV"]}
                                    placeholder="Enter or select suffix"
                                    onChange={(e) => {
                                        setData("suffix", e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                {showMaidenMiddleName && (
                                    <InputField
                                        label="Maiden Middle Name"
                                        name="maiden_middle_name"
                                        value={data.maiden_middle_name}
                                        placeholder="Enter maiden middle name"
                                        onChange={(e) => {
                                            setData(
                                                "maiden_middle_name",
                                                e.target.value
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* birthday, birthplace, civil_status, gender */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <InputField
                            type="date"
                            label="Birth Date"
                            name="birthdate"
                            value={data.birthdate}
                            onChange={(e) => {
                                setData("birthdate", e.target.value);
                                // Calculate age based on birthdate
                                const birthDate = new Date(e.target.value);
                                const today = new Date();
                                const calculatedAge =
                                    today.getFullYear() -
                                    birthDate.getFullYear();
                                if (calculatedAge >= 0) {
                                    setData("age", calculatedAge);
                                }
                            }}
                        />
                        <InputError
                            message={errors.birthdate}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputField
                            label="Birth Place"
                            name="birthplace"
                            value={data.birthplace}
                            placeholder="Enter birth place"
                            onChange={(e) => {
                                setData("birthplace", e.target.value);
                            }}
                        />
                        <InputError
                            message={errors.birthplace}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <DropdownInputField
                            label="Civil Status"
                            name="civil_status"
                            value={data.civil_status}
                            items={[
                                "Single",
                                "Married",
                                "Widowed",
                                "Divorced",
                                "Separated",
                                "Annulled",
                            ]}
                            placeholder="Select civil status"
                            onChange={(e) => {
                                setData(
                                    "civil_status",
                                    e.target.value.toLowerCase()
                                );
                            }}
                        />
                        <InputError
                            message={errors.civil_status}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <RadioGroup
                            label="Gender"
                            name="gender"
                            options={[
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" },
                                { label: "LGBTQIA+", value: "LGBTQ" },
                            ]}
                            selectedValue={data.gender || ""}
                            onChange={(e) => setData("gender", e.target.value)}
                        />

                        <InputError message={errors.gender} className="mt-2" />
                    </div>
                </div>

                {/* religion, ethnicity, citizenship, contact number */}
                <div className="grid md:grid-cols-4 gap-4">
                    <DropdownInputField
                        label="Religion"
                        name="religion"
                        value={data.religion}
                        items={[
                            "Roman Catholic",
                            "Iglesia ni Cristo",
                            "Born Again",
                            "Baptists",
                        ]}
                        placeholder="Enter or select religion"
                        onChange={(e) => {
                            setData("religion", e.target.value);
                        }}
                    />

                    <DropdownInputField
                        label="Ethnicity"
                        name="ethnicity"
                        value={data.ethnicity}
                        items={[
                            "Ilocano",
                            "Ibanag",
                            "Tagalog",
                            "Indigenous People",
                        ]}
                        placeholder="Enter or select ethnicity"
                        onChange={(e) => {
                            setData("ethnicity", e.target.value);
                        }}
                    />
                    <div>
                        <DropdownInputField
                            label="Citizenship"
                            name="citizenship"
                            value={data.citizenship}
                            items={["Filipino", "Chinese", "American "]}
                            placeholder="Enter or select citizenship"
                            onChange={(e) => {
                                setData("citizenship", e.target.value);
                            }}
                        />
                        <InputError
                            message={errors.citizenship}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputField
                            label="Contact Number"
                            name="contactNumber"
                            value={data.contactNumber}
                            placeholder="Enter contact number"
                            onChange={(e) => {
                                setData("contactNumber", e.target.value);
                            }}
                        />
                        <InputError
                            message={errors.contactNumber}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* email, residency type, residency date, purok, registered voter */}
                <div className="grid md:grid-cols-5 gap-4">
                    <div>
                        <InputField
                            label="Email"
                            name="email"
                            value={data.email}
                            placeholder="Enter email"
                            onChange={(e) => {
                                setData("email", e.target.value);
                            }}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <DropdownInputField
                            label="Residency type"
                            name="residency_type"
                            value={data.residency_type}
                            onChange={(e) =>
                                setData("residency_type", e.target.value)
                            }
                            placeholder="Select residency type"
                            items={["permanent", "temporary", "migrant"]}
                        />
                        <InputError
                            message={errors.residency_type}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <YearDropdown
                            label="Residency date"
                            name="residency_date"
                            value={data.residency_date}
                            onChange={(e) =>
                                setData("residency_date", e.target.value)
                            }
                            placeholder="Select residency date"
                        />
                        <InputError
                            message={errors.residency_date}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <DropdownInputField
                            label="Purok Number"
                            name="purok_number"
                            value={data.purok_number || ""}
                            onChange={(e) =>
                                setData("purok_number", e.target.value)
                            }
                            placeholder="Select Purok Number"
                            items={purok_numbers}
                        />
                        <InputError
                            message={errors.purok_number}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <RadioGroup
                            label="Registered Voter"
                            name="registered_voter"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.registered_voter || ""}
                            onChange={(e) =>
                                setData("registered_voter", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.registered_voter}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Section 2 */}
                <div className="flex flex-col mt-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                        Education and Occupation
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">
                        Please provide the resident education background and
                        current occupation.
                    </p>
                </div>

                {/* ask student if studying or not */}
                <div className="grid md:grid-cols-4 gap-4">
                    <RadioGroup
                        label="Currently studying"
                        name="is_student"
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        selectedValue={data.is_student || ""}
                        onChange={(e) => setData("is_student", e.target.value)}
                    />
                </div>

                {data.is_student == 1 && (
                    <div className="grid md:grid-cols-4 gap-4 my-4">
                        <div>
                            <InputField
                                label="School Name"
                                name="school_name"
                                type="text"
                                value={data.school_name || ""}
                                onChange={(e) =>
                                    setData("school_name", e.target.value)
                                }
                                placeholder="Enter school name"
                            />
                            <InputError
                                message={errors.school_name}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <RadioGroup
                                label="School Type"
                                name="school_type"
                                options={[
                                    { label: "Public", value: "public" },
                                    { label: "Private", value: "private" },
                                ]}
                                selectedValue={data.school_type || ""}
                                onChange={(e) =>
                                    setData("school_type", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.school_type}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                label="Current Level"
                                name="current_level"
                                value={data.current_level || ""}
                                onChange={(e) =>
                                    setData("current_level", e.target.value)
                                }
                                items={[
                                    {
                                        label: "Elementary",
                                        value: "elementary",
                                    },
                                    {
                                        label: "High School",
                                        value: "high_school",
                                    },
                                    { label: "College", value: "college" },
                                    {
                                        label: "Vocational",
                                        value: "vocational",
                                    },
                                    { label: "Post Grad", value: "post_grad" },
                                ]}
                                placeholder="Select school level"
                            />
                            <InputError
                                message={errors.current_level}
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}
                {data.is_student == 0 && (
                    <>
                        <div className="grid md:grid-cols-2 gap-10 mt-4">
                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <DropdownInputField
                                        label="Highest Educational Attainment"
                                        name="education"
                                        value={data.education || ""}
                                        onChange={(e) =>
                                            setData("education", e.target.value)
                                        }
                                        items={[
                                            {
                                                label: "No Formal Education",
                                                value: "no_formal_education",
                                            },
                                            {
                                                label: "Elementary",
                                                value: "elementary",
                                            },
                                            {
                                                label: "High School",
                                                value: "high_school",
                                            },
                                            {
                                                label: "College",
                                                value: "college",
                                            },
                                            {
                                                label: "Post Grad",
                                                value: "post_grad",
                                            },
                                            {
                                                label: "Vocational",
                                                value: "vocational",
                                            },
                                        ]}
                                        placeholder="Select your Educational Attainment"
                                    />
                                    <InputError
                                        message={errors.education}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <RadioGroup
                                        label="Educational Status"
                                        name="education_status"
                                        options={[
                                            {
                                                label: "Graduate",
                                                value: "graduate",
                                            },
                                            {
                                                label: "Undergraduate",
                                                value: "undergraduate",
                                            },
                                        ]}
                                        selectedValue={
                                            data.education_status || ""
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "education_status",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.education_status}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {data.age >= 6 && data.age <= 14 && (
                                    <div>
                                        <RadioGroup
                                            label="Out of School Children (6-14 years old)"
                                            name="osc"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={data.osc || ""}
                                            onChange={(e) =>
                                                setData("osc", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.osc}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                                {data.age >= 15 && data.age <= 24 && (
                                    <div>
                                        <RadioGroup
                                            label="Out of School Youth (15-24 years old)"
                                            name="osy"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={data.osy || ""}
                                            onChange={(e) =>
                                                setData("osy", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.osy}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <InputField
                                    label="School Name"
                                    name="school_name"
                                    type="text"
                                    value={data.school_name || ""}
                                    onChange={(e) =>
                                        setData("school_name", e.target.value)
                                    }
                                    placeholder="Enter school name"
                                    disabled={
                                        data.education === "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={errors.school_name}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="School Type"
                                    name="school_type"
                                    options={[
                                        { label: "Public", value: "public" },
                                        { label: "Private", value: "private" },
                                    ]}
                                    selectedValue={data.school_type || ""}
                                    onChange={(e) =>
                                        setData("school_type", e.target.value)
                                    }
                                    disabled={
                                        data.education === "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={errors.school_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Started"
                                    name="year_started"
                                    value={data.year_started || ""}
                                    onChange={(e) =>
                                        setData("year_started", e.target.value)
                                    }
                                    disabled={
                                        data.education === "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={errors.year_started}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Ended"
                                    name="year_ended"
                                    value={data.year_ended || ""}
                                    onChange={(e) =>
                                        setData("year_ended", e.target.value)
                                    }
                                    disabled={
                                        data.education === "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={errors.year_ended}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 my-4">
                            {data.education === "college" && (
                                <div>
                                    <InputField
                                        label="Finised Course"
                                        name="program"
                                        type="text"
                                        value={data.program || ""}
                                        onChange={(e) =>
                                            setData("program", e.target.value)
                                        }
                                        placeholder="Enter your course"
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.program}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {data.education_status === "graduate" && (
                                <div>
                                    <YearDropdown
                                        label="Year Graduated"
                                        name="year_graduated"
                                        value={data.year_ended || ""}
                                        onChange={(e) =>
                                            setData(
                                                "year_graduated",
                                                e.target.value
                                            )
                                        }
                                        disabled
                                    />
                                    <InputError
                                        message={errors.year_graduated}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
                <p className="font-bold my-2 text-lg">Occupation Background</p>

                {/* occupations */}
                {Array.isArray(data.occupations) &&
                    data.occupations.map((occupation, occIndex) => (
                        <div
                            key={occIndex}
                            className="border p-4 mb-4 rounded-md relative bg-gray-50"
                        >
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <DropdownInputField
                                        label="Employment Status"
                                        name="employment_status"
                                        value={
                                            occupation.employment_status || ""
                                        }
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                employment_status:
                                                    e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Select employment status"
                                        items={[
                                            {
                                                label: "Employed",
                                                value: "employed",
                                            },
                                            {
                                                label: "Unemployed",
                                                value: "unemployed",
                                            },
                                            {
                                                label: "Student",
                                                value: "student",
                                            },
                                        ]}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.employment_status`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <DropdownInputField
                                        label="Occupation"
                                        name="occupation"
                                        value={occupation.occupation || ""}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                occupation: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Select or Enter Occupation"
                                        items={occupationTypes}
                                        disabled={
                                            occupation.employment_status ===
                                            "unemployed"
                                        }
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.occupation`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <DropdownInputField
                                        label="Employment Type"
                                        name="employment_type"
                                        value={occupation.employment_type || ""}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                employment_type: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Select employment type"
                                        items={[
                                            {
                                                label: "Full-time",
                                                value: "full_time",
                                            },
                                            {
                                                label: "Part-time",
                                                value: "part_time",
                                            },
                                            {
                                                label: "Seasonal",
                                                value: "seasonal",
                                            },
                                            {
                                                label: "Contractual",
                                                value: "contractual",
                                            },
                                            {
                                                label: "Self-employed",
                                                value: "self_employed",
                                            },
                                        ]}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.employment_type`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <DropdownInputField
                                        label="Status"
                                        name="occupation_status"
                                        value={
                                            occupation.occupation_status || ""
                                        }
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                occupation_status:
                                                    e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Select occupation status"
                                        items={[
                                            "active",
                                            "inactive",
                                            "ended",
                                            "retired",
                                        ]}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.occupation_status`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <RadioGroup
                                        label="Work Arrangement"
                                        name="work_arrangement"
                                        options={[
                                            {
                                                label: "Remote",
                                                value: "remote",
                                            },
                                            {
                                                label: "On-site",
                                                value: "on_site",
                                            },
                                            {
                                                label: "Hybrid",
                                                value: "hybrid",
                                            },
                                        ]}
                                        selectedValue={
                                            occupation.work_arrangement || ""
                                        }
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                work_arrangement:
                                                    e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.work_arrangement`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputField
                                        label="Employer name"
                                        name="employer"
                                        type="text"
                                        value={occupation.employer || ""}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                employer: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Enter employer name"
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.employer`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <YearDropdown
                                            label="Year Started"
                                            name="started_at"
                                            value={occupation.started_at || ""}
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    started_at: e.target.value,
                                                };
                                                setData("occupations", updated);
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `occupations.${occIndex}.started_at`
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <YearDropdown
                                            label="Year Ended"
                                            name="ended_at"
                                            value={occupation.ended_at || ""}
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    ended_at: e.target.value,
                                                };
                                                setData("occupations", updated);
                                            }}
                                            disabled={
                                                occupation.occupation_status ===
                                                "active"
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `occupations.${occIndex}.ended_at`
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputField
                                        type="number"
                                        label="Income"
                                        name="income"
                                        value={occupation.income || ""}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                income: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                        placeholder="Enter Income"
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.income`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <RadioGroup
                                        label="Income Frequency"
                                        name="income_frequency"
                                        options={[
                                            {
                                                label: "Weekly",
                                                value: "weekly",
                                            },
                                            {
                                                label: "Monthly",
                                                value: "monthly",
                                            },
                                            {
                                                label: "Annually",
                                                value: "annually",
                                            },
                                        ]}
                                        selectedValue={
                                            occupation.income_frequency || ""
                                        }
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                income_frequency:
                                                    e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `occupations.${occIndex}.income_frequency`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeOccupation(occIndex)}
                                className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                            >
                                <IoIosCloseCircleOutline className="text-2xl" />
                            </button>
                        </div>
                    ))}

                <button
                    type="button"
                    onClick={addOccupation}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                >
                    <IoIosAddCircleOutline className="text-2xl" />
                    <span>Add Occupation</span>
                </button>

                {/* Submit Button */}
                <div className="flex w-full justify-center items-center mt-7">
                    <Button className="w-40" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInformation;
