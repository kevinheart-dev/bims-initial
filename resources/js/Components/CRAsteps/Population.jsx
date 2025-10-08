import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import Accordion from "../Accordion";
import Livelihood from "./Livelihood";
import Building from "./Building";
import InstitutionHuman from "./InstitutionHuman";

export default function Population() {
    const { craData, setCraData } = useContext(StepperContext);

    const Ownership = [
        "Owned (Land and House)",
        "Rented",
        "Shared with Owner",
        "Shared with Renter",
        "Owned (House)",
        "Informal Settler Families",
    ];

    const houseTypes = [
        "Concrete",
        "Semi-Concrete",
        "Made of wood and light materials",
        "Salvaged/Makeshift House",
    ];

    const ageGroups = [
        "0_6_mos",
        "7_mos_to_2_yrs",
        "3_to_5_yrs",
        "6_to_12_yrs",
        "13_to_17_yrs",
        "18_to_59_yrs",
        "60_plus_yrs",
    ];

    // Initialize CRA data
    useEffect(() => {
        console.log("CRA Data:", craData);

        if (!craData.population || craData.population.length === 0) {
            setCraData((prev) => ({
                ...prev,
                population: ageGroups.map((group) => ({
                    ageGroup: group,
                    male_no_dis: "",
                    male_dis: "",
                    female_no_dis: "",
                    female_dis: "",
                    lgbtq_no_dis: "",
                    lgbtq_dis: "",
                })),
            }));
        }

        if (!craData.houses || craData.houses.length === 0) {
            setCraData((prev) => ({
                ...prev,
                houses: houseTypes.map((type) => ({
                    houseType: type,
                    oneFloor: "",
                    multiFloor: "",
                })),
            }));
        }
    }, [craData, setCraData]);

    // Update population values
    const updatePopulation = (index, field, value) => {
        setCraData((prev) => {
            const newPopulation = [...prev.population];
            newPopulation[index][field] = value === "" ? "" : Number(value);
            return { ...prev, population: newPopulation };
        });
    };

    const getRowTotal = (index) => {
        const fields = craData.population?.[index] || {};
        return Object.entries(fields)
            .filter(([key]) => key !== "ageGroup")
            .reduce((a, [, b]) => a + (b || 0), 0);
    };

    const getColumnTotal = (field) => {
        return craData.population?.reduce(
            (sum, group) => sum + (group[field] || 0),
            0
        );
    };

    const getGrandTotal = () => {
        return craData.population?.reduce(
            (sum, _, index) => sum + getRowTotal(index),
            0
        );
    };

    const updateHouse = (index, field, value) => {
        setCraData((prev) => {
            const newHouses = [...prev.houses];
            newHouses[index][field] = value === "" ? "" : Number(value);
            return { ...prev, houses: newHouses };
        });
    };

    const getHouseColumnTotal = (field) => {
        return craData.houses?.reduce(
            (sum, house) => sum + (house[field] || 0),
            0
        );
    };

    const getHouseGrandTotal = () => {
        return craData.houses?.reduce(
            (sum, house) =>
                sum + (house.oneFloor || 0) + (house.multiFloor || 0),
            0
        );
    };

    useEffect(() => {
        if (
            !craData.populationGender ||
            craData.populationGender.length === 0
        ) {
            setCraData((prev) => ({
                ...prev,
                populationGender: [
                    { gender: "male", value: prev.malePopulation ?? "" },
                    { gender: "female", value: prev.femalePopulation ?? "" },
                    { gender: "lgbtq", value: prev.lgbtqPopulation ?? "" },
                ],
            }));
        }
    }, []); // run only once

    return (
        <div className="space-y-4">
            <Accordion title="A. Information on Population and Resident">
                {/* General Population */}
                <div className="flex flex-col md:flex-row gap-8">
                    <section className="flex-1">
                        <h2 className="text-lg font-semibold mb-0">
                            General Population
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField
                                type="number"
                                name="barangayPopulation"
                                label="Barangay Population"
                                placeholder="Total Population"
                                value={craData.barangayPopulation ?? ""}
                                onChange={(e) =>
                                    setCraData((prev) => ({
                                        ...prev,
                                        barangayPopulation:
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                            <InputField
                                type="number"
                                name="householdsPopulation"
                                label="Households Population"
                                placeholder="Total Households"
                                value={craData.householdsPopulation ?? ""}
                                onChange={(e) =>
                                    setCraData((prev) => ({
                                        ...prev,
                                        householdsPopulation:
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                            <InputField
                                type="number"
                                name="familiesPopulation"
                                label="Families Population"
                                placeholder="Total Families"
                                value={craData.familiesPopulation ?? ""}
                                onChange={(e) =>
                                    setCraData((prev) => ({
                                        ...prev,
                                        familiesPopulation:
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </section>
                    {/* Gender/Sex */}
                    <section className="flex-1">
                        <h2 className="text-lg font-semibold mb-0">
                            Population Based on Gender/Sex
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {["female", "male", "lgbtq"].map((gender, idx) => (
                                <InputField
                                    key={gender}
                                    type="number"
                                    name={`${gender}Population`}
                                    label={`${
                                        gender.charAt(0).toUpperCase() +
                                        gender.slice(1)
                                    } Population`}
                                    placeholder={
                                        gender.charAt(0).toUpperCase() +
                                        gender.slice(1)
                                    }
                                    value={
                                        craData.populationGender?.[idx]
                                            ?.value ?? ""
                                    }
                                    onChange={(e) => {
                                        const value =
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value);
                                        setCraData((prev) => {
                                            const updatedGender = [
                                                ...(prev.populationGender ||
                                                    []),
                                            ];
                                            updatedGender[idx] = {
                                                gender,
                                                value,
                                            };
                                            return {
                                                ...prev,
                                                populationGender: updatedGender,
                                            };
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Age Group Table */}
                <section>
                    <h2 className="text-lg font-semibold mb-3 mt-6">
                        Population according to Age
                    </h2>
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th rowSpan="2" className="border px-2 py-1">
                                    Age Group
                                </th>
                                <th colSpan="2" className="border px-2 py-1">
                                    Male
                                </th>
                                <th colSpan="2" className="border px-2 py-1">
                                    Female
                                </th>
                                <th colSpan="2" className="border px-2 py-1">
                                    LGBTQ+
                                </th>
                                <th rowSpan="2" className="border px-2 py-1">
                                    Total
                                </th>
                            </tr>
                            <tr>
                                <th className="border px-2 py-1">
                                    Without Disability
                                </th>
                                <th className="border px-2 py-1">
                                    With Disability
                                </th>
                                <th className="border px-2 py-1">
                                    Without Disability
                                </th>
                                <th className="border px-2 py-1">
                                    With Disability
                                </th>
                                <th className="border px-2 py-1">
                                    Without Disability
                                </th>
                                <th className="border px-2 py-1">
                                    With Disability
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {craData.population?.map((groupObj, idx) => (
                                <tr key={idx}>
                                    <td className="border px-2 py-1">
                                        {groupObj.ageGroup}
                                    </td>
                                    {Object.keys(groupObj)
                                        .filter((key) => key !== "ageGroup")
                                        .map((field, i) => (
                                            <td
                                                key={i}
                                                className="border px-2 py-1"
                                            >
                                                <input
                                                    type="number"
                                                    className="w-full border p-1"
                                                    value={
                                                        groupObj[field] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        updatePopulation(
                                                            idx,
                                                            field,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                        ))}
                                    <td className="border px-2 py-1 font-semibold text-center bg-gray-50">
                                        {getRowTotal(idx)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-semibold">
                                <td className="border px-2 py-1 text-center">
                                    Total
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("male_no_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("male_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("female_no_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("female_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("lgbtq_no_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getColumnTotal("lgbtq_dis")}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {getGrandTotal()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                {/* Houses Section (Side by Side, Same Height) */}
                <div className="flex flex-col md:flex-row gap-8 mt-6">
                    {/* Houses by Material */}
                    <section className="flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold mb-3">
                            Number of Houses according to Build (Materials Used)
                        </h2>
                        <div className="flex-1">
                            <table className="w-full border text-sm h-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">
                                            TYPES OF HOUSES
                                        </th>
                                        <th className="border px-2 py-1">
                                            Number of Houses with 1 Floor
                                        </th>
                                        <th className="border px-2 py-1">
                                            Number of Houses with 2 or more
                                            Floors
                                        </th>
                                        <th className="border px-2 py-1">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {craData.houses?.map((house, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-2 py-1">
                                                {house.houseType}
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input
                                                    type="number"
                                                    className="w-full border p-1"
                                                    value={house.oneFloor ?? ""}
                                                    onChange={(e) =>
                                                        updateHouse(
                                                            idx,
                                                            "oneFloor",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input
                                                    type="number"
                                                    className="w-full border p-1"
                                                    value={
                                                        house.multiFloor ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        updateHouse(
                                                            idx,
                                                            "multiFloor",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="border px-2 py-1 font-semibold text-center bg-gray-50">
                                                {(house.oneFloor || 0) +
                                                    (house.multiFloor || 0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="border px-2 py-1 text-center">
                                            Total
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {getHouseColumnTotal("oneFloor")}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {getHouseColumnTotal("multiFloor")}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {getHouseGrandTotal()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>

                    {/* Houses by Ownership */}
                    <section className="flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold mb-3">
                            Number of Houses according to Type of Ownership
                        </h2>
                        <div className="flex-1">
                            <table className="w-full border text-sm h-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">
                                            Type of Ownership
                                        </th>
                                        <th className="border px-2 py-1">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Ownership.map((own, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-2 py-1">
                                                {own}
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input
                                                    type="number"
                                                    className="w-full border p-1"
                                                    value={
                                                        craData.ownership?.[
                                                            own
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        setCraData((prev) => ({
                                                            ...prev,
                                                            ownership: {
                                                                ...prev.ownership,
                                                                [own]:
                                                                    e.target
                                                                        .value ===
                                                                    ""
                                                                        ? ""
                                                                        : Number(
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          ),
                                                            },
                                                        }))
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="border px-2 py-1 text-center">
                                            Total
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {Object.values(
                                                craData.ownership || {}
                                            ).reduce(
                                                (sum, val) => sum + (val || 0),
                                                0
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>
                </div>
            </Accordion>

            {/* dito nakalagay yung dalang step B and C */}
            <Livelihood />
            {/* dito step d and e */}
            <Building />
            {/* g and f here */}
            <InstitutionHuman />
        </div>
    );
}
