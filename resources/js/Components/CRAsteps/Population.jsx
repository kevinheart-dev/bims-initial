import { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import { useState, useEffect } from "react";

export default function Population() {

    const ageGroups = [
        "0-6 months",
        "7 mos - 2 yrs",
        "3-5 yrs",
        "6-12 yrs",
        "13-17 yrs",
        "18-59 yrs",
        "60+ yrs"
    ];

    const initialPopulation = ageGroups.reduce((acc, group) => {
        acc[group] = {
            male_no_dis: 0,
            male_dis: 0,
            female_no_dis: 0,
            female_dis: 0,
            lgbtq_no_dis: 0,
            lgbtq_dis: 0,
        };
        return acc;
    }, {});

    const [craData, setCraData] = useState({
        population: initialPopulation
    });


    const updatePopulation = (group, field, value) => {
        setCraData(prev => ({
            ...prev,
            population: {
                ...prev.population,
                [group]: {
                    ...prev.population[group],
                    [field]: Number(value) || 0
                }
            }
        }));
    };


    const getRowTotal = (group) => {
        const fields = craData.population[group];
        return Object.values(fields).reduce((a, b) => a + b, 0);
    };

    const getColumnTotal = (field) => {
        return ageGroups.reduce((sum, group) => sum + craData.population[group][field], 0);
    };

    const getGrandTotal = () => {
        return ageGroups.reduce((sum, group) => sum + getRowTotal(group), 0);
    };


    return (
        <div className="space-y-8">
            {/* General Population */}
            <section>
                <h2 className="text-lg font-semibold mb-3">General Population</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="number"
                        placeholder="Total Population"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Total Households"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Total Families"
                        className="border p-2 rounded w-full"
                    />
                </div>
            </section>

            {/* Gender/Sex */}
            <section>
                <h2 className="text-lg font-semibold mb-3">Population by Gender/Sex</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="number"
                        placeholder="Female"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Male"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="LGBTQ+"
                        className="border p-2 rounded w-full"
                    />
                </div>
            </section>

            {/* Age Group Table */}
            <section>
                <h2 className="text-lg font-semibold mb-3">Population by Age Group</h2>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th rowSpan="2" className="border px-2 py-1">Age Group</th>
                            <th colSpan="2" className="border px-2 py-1">Male</th>
                            <th colSpan="2" className="border px-2 py-1">Female</th>
                            <th colSpan="2" className="border px-2 py-1">LGBTQ+</th>
                            <th rowSpan="2" className="border px-2 py-1">Total</th>
                        </tr>
                        <tr>
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ageGroups.map((group, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{group}</td>

                                {Object.keys(craData.population[group]).map((field, i) => (
                                    <td key={i} className="border px-2 py-1">
                                        <input
                                            type="number"
                                            className="w-full border p-1"
                                            value={craData.population[group][field]}
                                            onChange={e => updatePopulation(group, field, e.target.value)}
                                        />
                                    </td>
                                ))}

                                {/* Row Total */}
                                <td className="border px-2 py-1 font-semibold text-center bg-gray-50">
                                    {getRowTotal(group)}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Column Totals */}
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold">
                            <td className="border px-2 py-1 text-center">Total</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("male_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("male_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("female_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("female_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("lgbtq_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("lgbtq_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getGrandTotal()}</td>
                        </tr>
                    </tfoot>
                </table>



            </section>

            {/* Houses by Material */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    Houses by Materials (and Floors)
                </h2>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">TYPES OF HOUSES</th>
                            <th className="border px-2 py-1">Number of Houses with 1 Floor</th>
                            <th className="border px-2 py-1">Number of Houses with 2 or more Floors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            "Concrete",
                            "Semi-Concrete",
                            "Made of wood and light materials",
                            "Salvaged/Makeshift House",
                        ].map((group, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{group}</td>
                                <td className="border px-2 py-1">
                                    <input
                                        type="number"

                                        className="w-full border p-1"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        type="number"

                                        className="w-full border p-1"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Houses by Ownership */}
            <section>
                <h2 className="text-lg font-semibold mb-3">House Ownership</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="number"
                        placeholder="Owned (Land + House)"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Rented"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Shared with Owner"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Shared with Renter"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Owned (House)"
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="number"
                        placeholder="Informal Settler Families"
                        className="border p-2 rounded w-full"
                    />
                    {/* Repeat for Shared with Renter, Owned (House only), Informal Settler */}
                </div>
            </section>
        </div>
    );
}
