import { useState, useEffect, useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import { Button } from "../ui/button";
import TextInput from "../TextInput";
import InputLabel from "../InputLabel";
import RadioGroup from "../RadioGroup";

const PersonalInformation = () => {
    const { data, setData, post, errors } = useForm({
        resident_image: null,
        lastname: "",
        firstname: "",
        middlename: "",
        suffix: "",
        birthdate: "",
        birthplace: "",
        civil_status: "",
        gender: "",
        maiden_middle_name: "",
        citizenship: "",
        religion: "",
        ethnicity: "",
        contactNumber: "",
        email: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("resident.store"));
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                Resident Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Kindly provide the personal information of the resident.
            </p>
            <form onSubmit={onSubmit}>
                <div className="flex justify-between items-center gap-4 mb-4">
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
                        <div className="grid md:grid-cols-2 gap-4">
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
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <InputField
                            type="date"
                            label="Birth Date"
                            name="birthdate"
                            value={data.birthdate}
                            onChange={(e) => {
                                setData("birthdate", e.target.value);
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

                <div className="grid md:grid-cols-4 gap-4">
                    {["female", "LGBTQ"].includes(data.gender) &&
                        ["married", "widowed", "separated"].includes(
                            data.civil_status
                        ) && (
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
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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
                </div>
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
