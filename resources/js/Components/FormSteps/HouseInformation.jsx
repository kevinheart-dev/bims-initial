import { useState, useEffect, useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import YearDropdown from '../YearDropdown';
import InputField from '../InputField';

function HouseInformation() {
    const { userData, setUserData } = useContext(StepperContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">House Information</h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide the necessary house information to continue.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
                {/* <InputField
                    type="number"
                    label="House Number"
                    name="house_number"
                    value={userData.house_number || ''}
                    onChange={handleChange}
                    placeholder="Enter house number"
                /> */}

                <DropdownInputField
                    label="Ownership Type"
                    name="ownership_type"
                    value={userData.ownership_type || ''}
                    onChange={handleChange}
                    placeholder="Select or enter ownership type"
                    items={['owned', 'rented', 'shared', 'goverment-provided', 'inherited']}
                />

                <DropdownInputField
                    label="Housing Condition"
                    name="housing_condition"
                    value={userData.housing_condition || ''}
                    onChange={handleChange}
                    placeholder="Select house condition"
                    items={['good', 'needs repair', 'dilapidated']}
                />


                <DropdownInputField
                    label="House Structure"
                    name="house_structure"
                    value={userData.house_structure}
                    onChange={handleChange}
                    placeholder="Select or Enter house structure"
                    items={['concrete', 'semi-concrete', 'wood', 'makeshift']}
                />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <YearDropdown
                    label="Year Establish"
                    name="year_establish"
                    value={userData.year_establish}
                    onChange={handleChange}
                    placeholder="Select year"
                />

                <InputField
                    type="number"
                    label="Number of Rooms"
                    name="number_of_rooms"
                    value={userData.number_of_rooms || ''}
                    onChange={handleChange}
                    placeholder="Enter number of rooms"
                />

                <InputField
                    type="number"
                    label="Number of Floors"
                    name="number_of_floors"
                    value={userData.number_of_floors || ''}
                    onChange={handleChange}
                    placeholder="Enter number of floors"
                />

                <DropdownInputField
                    label="Bath and Wash Area"
                    name="bath_and_wash_area"
                    value={userData.bath_and_wash_area || ''}
                    onChange={handleChange}
                    placeholder="Select or Enter"
                    items={[
                        { label: 'with own sink and bath', value: 'with_own_sink_and_bath' },
                        { label: 'with own sink only', value: 'with_own_sink_only' },
                        { label: 'with own bath only', value: 'with_own_bath_only' },
                        { label: 'shared or communal', value: 'shared_or_communal' },
                        { label: 'none', value: 'none' }
                    ]}
                />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <DropdownInputField
                    label="Type of Toilet"
                    name="toilet_type"
                    value={userData.toilet_type || ''}
                    onChange={handleChange}
                    placeholder="Select or enter toilet type"
                    items={[
                        { label: 'water sealed', value: 'water_sealed' },
                        { label: 'compost pit toilet', value: 'compost_pit_toilet' },
                        { label: 'shared communal public toilet', value: 'shared_communal_public_toilet' },
                        { label: 'shared or communal', value: 'shared_or_communal' },
                        { label: 'no latrine', value: 'no_latrine' }
                    ]}
                />

                <DropdownInputField
                    label="Source of Electricity"
                    name="electricity_type"
                    value={userData.electricity_type || ''}
                    onChange={handleChange}
                    placeholder="Select or enter electricity source"
                    items={[
                        { label: 'ISELCO II (Distribution Company)', value: 'distribution_company_iselco_ii' },
                        { label: 'Generator', value: 'generator' },
                        { label: 'Solar / Renewable Energy Source', value: 'solar_renewable_energy_source' },
                        { label: 'Battery', value: 'battery' },
                        { label: 'None', value: 'none' }
                    ]}
                />

                <DropdownInputField
                    label="Water Source Type"
                    name="water_source_type"
                    value={userData.water_source_type || ''}
                    onChange={handleChange}
                    placeholder="Select water source type"
                    items={[
                        { label: 'Level II Water System', value: 'level_ii_water_system' },
                        { label: 'Level III Water System', value: 'level_iii_water_system' },
                        { label: 'Deep Well Level I', value: 'deep_well_level_i' },
                        { label: 'Artesian Well Level I', value: 'artesian_well_level_i' },
                        { label: 'Shallow Well Level I', value: 'shallow_well_level_i' },
                        { label: 'Commercial Water Refill Source', value: 'commercial_water_refill_source' },
                        { label: 'None', value: 'none' }
                    ]}
                />
                <DropdownInputField
                    label="Waste Disposal Method"
                    name="waste_management_type"
                    value={userData.waste_management_type || ''}
                    onChange={handleChange}
                    placeholder="Select waste disposal method"
                    items={[
                        { label: 'Open Dump Site', value: 'open_dump_site' },
                        { label: 'Sanitary Landfill', value: 'sanitary_landfill' },
                        { label: 'Compost Pits', value: 'compost_pits' },
                        { label: 'Material Recovery Facility', value: 'material_recovery_facility' },
                        { label: 'Garbage is Collected', value: 'garbage_is_collected' },
                        { label: 'None', value: 'none' }
                    ]}
                />

            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <DropdownInputField
                    label="Internet Connection Type"
                    name="type_of_internet"
                    value={userData.type_of_internet || ''}
                    onChange={handleChange}
                    placeholder="Select internet connection type"
                    items={[
                        { label: 'Mobile Data', value: 'mobile_data' },
                        { label: 'Wireless Fidelity (Wi-Fi)', value: 'wireless_fidelity' },
                        { label: 'None', value: 'none' }
                    ]}
                />

            </div>


        </div>

    )
}

export default HouseInformation
