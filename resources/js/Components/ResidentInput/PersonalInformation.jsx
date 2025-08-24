import { useState, useEffect, useContext } from "react";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import { Button } from "../ui/button";
import InputLabel from "../InputLabel";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";
import SelectField from "../SelectField";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Checkbox from "../Checkbox";
import LivelihoodSection from "./Section6";

const PersonalInformation = ({
    puroks,
    occupationTypes = null,
    streets = null,
    households = null,
    barangays = null,
}) => {
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
        sex: "",
        maiden_middle_name: "",
        citizenship: "",
        religion: "",
        ethnicity: "",
        contactNumber: "",
        email: "",
        residency_type: "",
        residency_date: "",
        is_household_head: 0,
        is_family_head: 0,
        verified: 0,
        purok_number: null,
        purok_id: null,
        street_id: null,
        street_name: "",
        subdivision: "",
        housenumber: null,
        household_id: null,
        is_4ps_benificiary: null,
        is_solo_parent: null,
        solo_parent_id_number: "",
        voter_id_number: "",
        voting_status: "",
        registered_voter: 0,
        registered_barangay: null,
        employment_status: "",
        has_vehicle: null,
        vehicles: [],
        educational_histories: [],
        occupations: [],
        is_pensioner: "",
        osca_id_number: "",
        pension_type: "",
        living_alone: null,
        weight_kg: 0,
        height_cm: 0,
        bmi: 0,
        nutrition_status: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_contact_relationship: "",
        blood_type: "",
        has_philhealth: null,
        philhealth_number: "",
        is_pwd: null,
        pwd_id_number: "",
        is_alcohol_user: null,
        is_smoker: null,
        disabilities: [],
        livelihoods: [],
        relationship_to_head: "",
        household_position: "",
        name_of_head: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("resident.store"), {
            onSuccess: () => {
                console.log("Successfully submitted!");
            },
            onError: (error) => {
                console.log("error", error);
            },
        });
    };

    const showMaidenMiddleName =
        ["female"].includes(data.sex) &&
        ["married", "widowed", "Separated"].includes(data.civil_status);

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    useEffect(() => {
        if (data.weight_kg > 0 && data.height_cm > 0) {
            const heightInMeters = data.height_cm / 100;
            const bmi = data.weight_kg / (heightInMeters * heightInMeters);
            const roundedBmi = bmi.toFixed(2);

            let status = "";

            if (bmi < 16) {
                status = "severly_underweight";
            } else if (bmi >= 16 && bmi < 18.5) {
                status = "underweight";
            } else if (bmi >= 18.5 && bmi < 25) {
                status = "normal";
            } else if (bmi >= 25 && bmi < 30) {
                status = "overweight";
            } else {
                status = "obese";
            }

            setData("bmi", roundedBmi);
            setData("nutrition_status", status);
        } else {
            setData("bmi", 0);
            setData("nutrition_status", "");
        }
    }, [data.weight_kg, data.height_cm]);

    useEffect(() => {
        if (data.housenumber) {
            const selectedHousehold = households.find(
                (house) => house.household.id === Number(data.housenumber)
            );

            if (selectedHousehold) {
                const { household } = selectedHousehold;
                const updates = {
                    household_id: household.household_id,
                    street_id: household.street_id,
                    street_name: household.street?.street_name || "",
                    purok_id: household.purok_id,
                    purok_number: household.purok?.purok_number || "",
                };

                Object.entries(updates).forEach(([key, value]) =>
                    setData(key, value)
                );
            }
        }
    }, [data.housenumber, households]);

    return (
        <div>
            <form onSubmit={onSubmit}>
                {/* Section 1 */}
                {/* Personal, Social Welfare and Vehicle Information*/}
                <Section1
                    data={data}
                    setData={setData}
                    handleArrayValues={handleArrayValues}
                    errors={errors}
                    showMaidenMiddleName={showMaidenMiddleName}
                    barangays={barangays}
                />

                {/* Section 2 */}
                {/* Education Information */}
                <Section2
                    data={data}
                    setData={setData}
                    errors={errors}
                    handleArrayValues={handleArrayValues}
                />

                {/* Section 3 */}
                {/* Occupation Information */}
                <Section3
                    data={data}
                    setData={setData}
                    errors={errors}
                    occupationTypes={occupationTypes}
                />

                <LivelihoodSection
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                {/* Section 4 */}
                {/* Medical Information */}
                <Section4 data={data} setData={setData} errors={errors} />

                {/* Section 5 */}
                {/* House Information */}
                <Section5
                    data={data}
                    setData={setData}
                    handleArrayValues={handleArrayValues}
                    errors={errors}
                    puroks={puroks}
                    streets={streets}
                    households={households}
                />
                <section className="space-y-4 border border-gray-200 p-4 rounded-md my-4">
                    <label className="flex items-start space-x-2">
                        <Checkbox
                            name="verified"
                            value={data.verified}
                            checked={
                                data.verified === 1 || data.verified === true
                            }
                            onChange={(e) =>
                                setData("verified", e.target.checked ? 1 : 0)
                            }
                        />
                        <span className="text-sm text-gray-700">
                            I hereby certify that the above information is true
                            and correct to the best of my knowledge. I
                            understand that for the Barangay to carry out its
                            mandate pursuant to Section 394(d)(6) of the Local
                            Government Code of 1991, it must necessarily process
                            my personal information for easy identification of
                            inhabitants, as a tool in planning, and as an
                            updated reference for the number of inhabitants in
                            the Barangay. Therefore, I grant my consent and
                            recognize the authority of the Barangay to process
                            my personal information, subject to the provisions
                            of the Philippine Data Privacy Act of 2012.
                        </span>
                    </label>
                </section>
                {/* Submit Button */}
                <div className="flex w-full justify-center items-center mt-7">
                    <Button
                        className="w-40"
                        type="submit"
                        disabled={data.verified === 0}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInformation;
