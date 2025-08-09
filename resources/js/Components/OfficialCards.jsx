import React from "react";
import { Mail, Phone } from "lucide-react";

const OfficialCard = () => {
    return (
        <div className="w-full max-w-[260px] sm:max-w-[280px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-transform duration-300 hover:scale-105">
            {/* Image */}
            <div className="w-full h-[200px] overflow-hidden">
                <img
                    src="/images/default-card-image.jpg"
                    alt="Official photo"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="px-4 py-3">
                <h2 className="text-lg font-bold text-gray-900">Mark Kevin M. Ramos</h2>
                <p className="text-blue-700 font-semibold">Barangay Captain</p>
                <p className="text-gray-500 text-xs">Designation: Purok 4</p>
                <p className="text-gray-500 text-xs mb-3">Term: 2025–2028</p>

                {/* Contact Info */}
                <div className="space-y-1 text-sm">
                    <p className="flex items-center space-x-2">
                        <Phone className="text-blue-600 w-4 h-4" />
                        <span className="text-gray-600">09510177285</span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <Mail className="text-blue-600 w-4 h-4" />
                        <span className="text-gray-600">markkevinramos@gmail.com</span>
                    </p>
                </div>

                {/* View Button */}
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors duration-200">
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default OfficialCard;
