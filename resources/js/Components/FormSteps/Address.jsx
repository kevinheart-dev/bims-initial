import { useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import InputField from '@/Components/InputField';

const Address = () => {
    const { userData, setUserData } = useContext(StepperContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1">Address Information</h2>
            <p className="text-sm text-gray-600 mb-6">Please complete your address.</p>

            <div className="grid md:grid-cols-3 gap-4">
                <InputField
                    label="House/Unit No./Lot/Blk No."
                    name="housenumber" value={userData.housenumber || ''}
                    onChange={handleChange}
                    placeholder="e.g., Lot 12 Blk 7 or Unit 3A" />

                <InputField label="Street Name" name="street" value={userData.street || ''} onChange={handleChange} placeholder="e.g., Rizal St., Mabini Avenue" />
                <InputField label="Purok/Zone/Sitio/Cabisera" name="purok" value={userData.purok || ''} onChange={handleChange} placeholder="e.g., Purok 5, Sitio Lupa" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Subdivision/Village/Compound" name="subdivision" value={userData.subdivision || ''} onChange={handleChange} placeholder="e.g., Villa Gloria Subdivision" />
                <InputField label="Barangay Name" name="barangay" value={userData.barangay || ''} onChange={handleChange} placeholder="e.g., San Felipe" />
                <InputField label="City" name="city" value={userData.city || ''} onChange={handleChange} placeholder="e.g., City of Ilagan" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Province" name="province" value={userData.province || ''} onChange={handleChange} placeholder="e.g., Isabela" />
                <InputField label="Region" name="region" value={userData.region || ''} onChange={handleChange} placeholder="Region II" />
                <InputField label="Zip Code" name="zip_code" value={userData.zip_code || ''} onChange={handleChange} placeholder="e.g., 3300" />
            </div>
        </div>
    );
};

export default Address;
