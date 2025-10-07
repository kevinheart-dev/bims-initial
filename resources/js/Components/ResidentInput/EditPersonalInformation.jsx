import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { useForm, usePage } from "@inertiajs/react";
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
import toast from "react-hot-toast";
import LivelihoodSection from "./Section6";

const EditPersonalInformation = ({
    puroks,
    occupationTypes = null,
    streets = null,
    households = null,
    barangays = null,
    resident,
}) => {
    const calculateAge = useCallback((birthdate) => {
        if (!birthdate) return 0;
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }, []);

    const barangayList = Object.entries(barangays).map(([id, name]) => ({
        label: name,
        value: id,
    }));

    const householdList = households?.map((house) => ({
        label:
            house.household.house_number.toString().padStart(4, "0") + // pad to 4 digits
            " || " +
            house.lastname +
            "'s Residence",
        value: house.household.id.toString(),
    }));

    const familyHeadList = familyHeads.map((head) => ({
        label: [head.firstname, head.middlename, head.lastname, head.suffix]
            .filter(Boolean) // removes null/undefined/empty strings
            .join(" "), // join with spaces
        value: head.id.toString(),
    }));

    const initial = {
        resident_image: null,
        lastname: resident?.lastname || "",
        firstname: resident?.firstname || "",
        middlename: resident?.middlename || "",
        suffix: resident?.suffix || "",
        birthdate: resident?.birthdate || "",
        age: resident ? calculateAge(resident.birthdate) : 0,
        birthplace: resident?.birthplace || "",
        civil_status: resident?.civil_status || "",
        sex: resident?.sex ? resident?.sex.toString() : "",
        gender: resident?.gender || "",
        maiden_name: resident?.maiden_name || "",
        citizenship: resident?.citizenship || "",
        religion: resident?.religion || "",
        ethnicity: resident?.ethnicity || "",
        employment_status: resident?.employment_status || "",
        contactNumber: resident?.contact_number || "",
        email: resident?.email || "",
        residency_type: resident?.residency_type || "",
        residency_date: resident?.residency_date || "",
        is_household_head: resident?.is_household_head || 0,
        is_family_head: resident?.is_family_head || 0,
        verified: 0,
        purok_number: resident?.purok_number || null,
        purok_id: resident?.street?.purok_id || null,
        street_id: resident?.street?.id || null,
        street_name: resident?.street?.street_name || "",
        subdivision: resident?.household?.subdivision || "",
        housenumber: (() => {
            const match = householdList.find(
                (b) => b.value === String(resident?.household?.id)
            );
            return match?.value || "";
        })(),
        housenumber_label: (() => {
            const match = householdList.find(
                (b) => b.value === String(resident?.household?.id)
            );
            return match?.label || "";
        })(),
        household_id: (() => {
            const match = householdList.find(
                (b) => b.value === String(resident?.household?.id)
            );
            return match?.value || "";
        })(),

        is_4ps_beneficiary:
            resident?.social_welfare_profile?.is_4ps_beneficiary != null
                ? resident.social_welfare_profile.is_4ps_beneficiary.toString()
                : null,
        is_solo_parent:
            resident?.social_welfare_profile?.is_solo_parent != null
                ? resident.social_welfare_profile.is_solo_parent.toString()
                : null,
        solo_parent_id_number:
            resident?.social_welfare_profile?.solo_parent_id_number || "",
        voter_id_number: resident?.voting_information?.voter_id_number || "",
        voting_status: resident?.voting_information?.voting_status || "",
        registered_voter: resident?.registered_voter
            ? resident?.registered_voter.toString()
            : "0",
        registered_barangay:
            resident?.voting_information?.registered_barangay_id?.toString() ||
            null,
        has_vehicle: resident?.vehicles?.length ? 1 : 0,
        vehicles: resident?.vehicles || [],
        educational_histories:
            Array.isArray(resident?.educational_histories) &&
            resident.educational_histories.length
                ? resident.educational_histories.map(
                      ({ educational_attainment, ...rest }) => ({
                          ...rest,
                          education: educational_attainment || "",
                      })
                  )
                : [],
        occupations:
            Array.isArray(resident?.occupations) && resident.occupations.length
                ? resident.occupations.map((occ) => ({
                      ...occ,
                      income: occ.monthly_income || 0,
                      income_frequency: occ.income_frequency || "monthly",
                      work_arrangement: occ.work_arrangement || "",
                  }))
                : [],
        weight_kg: resident?.medical_information?.weight_kg || 0,
        height_cm: resident?.medical_information?.height_cm || 0,
        bmi: resident?.medical_information?.bmi || 0,
        nutrition_status: resident?.medical_information?.nutrition_status || "",
        emergency_contact_name:
            resident?.medical_information?.emergency_contact_name || "",
        emergency_contact_number:
            resident?.medical_information?.emergency_contact_number || null,
        emergency_contact_relationship:
            resident?.medical_information?.emergency_contact_relationship || "",
        blood_type: resident?.medical_information?.blood_type || null,
        has_philhealth:
            resident?.medical_information?.has_philhealth != null
                ? resident.medical_information.has_philhealth.toString()
                : null,
        philhealth_number:
            resident?.medical_information?.philhealth_id_number || "",
        is_pwd: resident?.is_pwd != null ? resident.is_pwd.toString() : null,
        pwd_id_number: resident?.medical_information?.pwd_id_number || "",
        is_alcohol_user:
            resident?.medical_information?.is_alcohol_user != null
                ? resident.medical_information.is_alcohol_user.toString()
                : null,

        is_smoker:
            resident?.medical_information?.is_smoker != null
                ? resident.medical_information.is_smoker.toString()
                : null,
        livelihoods:
            Array.isArray(resident?.livelihoods) && resident.livelihoods.length
                ? resident.livelihoods.map((liv) => ({
                      ...liv,
                      income: liv.income || liv.monthly_income || 0,
                      income_frequency: liv.income_frequency || "monthly",
                      status: liv.status || "active",
                      is_main_livelihood:
                          liv.is_main_livelihood != null
                              ? liv.is_main_livelihood.toString()
                              : "",
                  }))
                : [],
        disabilities: resident?.disabilities || [],
        relationship_to_head:
            resident?.latestHouseholdResident?.relationship_to_head || "",
        household_position:
            resident?.latestHouseholdResident?.household_position || "",
        name_of_head: "",
        is_pensioner: resident?.senior_citizen?.is_pensioner || "",
        living_alone:
            resident?.senior_citizen?.living_alone != null
                ? resident.senior_citizen.living_alone.toString()
                : null,
        osca_id_number:
            resident?.senior_citizen?.osca_id_number != null
                ? resident.senior_citizen.osca_id_number.toString()
                : null,
        pension_type: resident?.senior_citizen?.pension_type || "",
        _method: "PUT",
    };

    const { data, setData, post, errors, processing } = useForm({
        ...initial,
    });

    const existingImagePath = resident?.resident_picture_path
        ? "/storage/" + resident.resident_picture_path
        : null;

    const showMaidenMiddleName =
        ["female"].includes(data.gender) &&
        ["married", "widowed", "Separated"].includes(data.civil_status);

    const householdMap = useMemo(() => {
        return (households || []).reduce((acc, h) => {
            acc[String(h.household.id)] = h;
            return acc;
        }, {});
    }, [households]);

    const handleArrayValues = useCallback(
        (e, index, column, array) => {
            const updated = [...(data[array] || [])];
            updated[index] = {
                ...updated[index],
                [column]: e.target.value,
            };
            setData(array, updated);
        },
        [data, setData]
    );

    // Recalculate age when birthdate changes
    useEffect(() => {
        if (data.birthdate) {
            setData("age", calculateAge(data.birthdate));
        }
    }, [data.birthdate, calculateAge, setData]);

    // BMI and nutrition status
    useEffect(() => {
        if (data.weight_kg > 0 && data.height_cm > 0) {
            const heightInMeters = data.height_cm / 100;
            const bmi = data.weight_kg / (heightInMeters * heightInMeters);
            const roundedBmi = parseFloat(bmi.toFixed(2));
            let status = "";
            if (bmi < 16) status = "severly_underweight";
            else if (bmi < 18.5) status = "underweight";
            else if (bmi < 25) status = "normal";
            else if (bmi < 30) status = "overweight";
            else status = "obese";

            setData((prev) => ({
                ...prev,
                bmi: roundedBmi,
                nutrition_status: status,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                bmi: 0,
                nutrition_status: "",
            }));
        }
    }, [data.weight_kg, data.height_cm, setData]);

    // Sync household-related fields
    useEffect(() => {
        if (!data.housenumber) return;

        // Find the household head record matching the selected housenumber (household_id)
        const head = (households || []).find(
            (h) =>
                String(h.household_id) === String(data.household_id) &&
                (h.is_household_head === 1 || h.is_household_head === true)
        );
        if (!head) return;

        const fullName = [
            head.firstname,
            head.middlename,
            head.lastname,
            head.suffix,
        ]
            .filter(Boolean)
            .join(" ");

        const updates = {
            household_id: head.household.household_id ?? head.household_id,
            street_id: head.household.street_id,
            street_name: head.household?.street?.street_name || "",
            purok_id:
                head.household?.purok?.id || head.household?.purok_id || "",
            purok_number: head.household?.purok?.purok_number || "",
            name_of_head: fullName,
        };

        setData((prev) => ({
            ...prev,
            ...updates,
        }));
    }, [data.housenumber, households, setData]);

    // sira putangian
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("resident.update", resident.id), {
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Section 1 */}
                {/* Personal, Social Welfare and Vehicle Information*/}
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                <Section1
                    data={data}
                    setData={setData}
                    handleArrayValues={handleArrayValues}
                    errors={errors}
                    showMaidenMiddleName={showMaidenMiddleName}
                    barangays={barangays}
                    existingImagePath={existingImagePath}
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

                {/* <LivelihoodSection
                    data={data}
                    setData={setData}
                    errors={errors}
                /> */}

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

export default EditPersonalInformation;
