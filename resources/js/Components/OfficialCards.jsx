import React from "react";
import { Mail, Phone, X, MapPin, Calendar, User } from "lucide-react";

const OfficialCard = ({
    id,
    name,
    position,
    purok,
    term,
    phone,
    email,
    image,
    onView,
    onDelete,
    onEdit,
}) => {
    // Image source handler
    const imgSrc =
        image instanceof File
            ? URL.createObjectURL(image)
            : image
            ? `/storage/${image}`
            : "/images/default-avatar.jpg";

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* TOP BANNER & DELETE ACTION */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete Official"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* PROFILE IMAGE (Overlapping) */}
            <div className="flex justify-center -mt-12 relative z-10">
                <div className="p-1.5 bg-white rounded-full shadow-sm">
                    <img
                        src={imgSrc}
                        alt={name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 bg-gray-50"
                    />
                </div>
            </div>

            {/* CARD BODY */}
            <div className="flex-grow flex flex-col px-5 pt-3 pb-6 text-center">
                {/* Identity */}
                <div className="mb-4">
                    <h3
                        className="text-lg font-bold text-gray-800 leading-tight truncate"
                        title={name}
                    >
                        {name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mt-1">
                        {position}
                    </p>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                    <div className="flex flex-col items-center border-r border-gray-200 pr-2">
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>Purok</span>
                        </div>
                        <span className="font-semibold text-gray-800 truncate w-full">
                            {purok}
                        </span>
                    </div>
                    <div className="flex flex-col items-center pl-2">
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Term</span>
                        </div>
                        <span className="font-semibold text-gray-800 truncate w-full">
                            {term}
                        </span>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 mb-4 w-full">
                    {phone ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-white border border-gray-100 py-1.5 px-3 rounded-md">
                            <Phone className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="truncate">{phone}</span>
                        </div>
                    ) : (
                        <div className="h-8"></div> // Spacer to keep cards aligned
                    )}

                    {email && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-white border border-gray-100 py-1.5 px-3 rounded-md">
                            <Mail className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="truncate">{email}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onEdit(id)}
                        className="py-2 px-4 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onView(id)}
                        className="py-2 px-4 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialCard;
