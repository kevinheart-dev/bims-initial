import { Mail, Phone, X } from "lucide-react";

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
    const handleEdit = () => {
        window.location.href = `/barangay_officer/officials/${id}/edit`;
    };

    return (
        <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-transform duration-300 hover:scale-105">
            {/* Transparent Delete Button */}
            <button
                onClick={() => onDelete(id)}
                className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors duration-200"
                title="Delete"
            >
                <X className="w-3 h-3 sm:w-5 sm:h-5" />
            </button>

            <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] overflow-hidden">
                <img
                    src={
                        image instanceof File
                            ? URL.createObjectURL(image)
                            : image
                            ? `/storage/${image}`
                            : "/images/default-avatar.jpg"
                    }
                    alt="Official Image"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="px-3 py-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {name}
                </h2>
                <p className="text-blue-700 font-semibold text-xs sm:text-sm">
                    {position}
                </p>
                <p className="text-gray-500 text-[9px] sm:text-[10px]">
                    Designation: Purok {purok}
                </p>
                <p className="text-gray-500 text-[9px] sm:text-[10px] mb-1">
                    Term: {term}
                </p>

                {/* Contact Info */}
                <div className="space-y-1 text-[9px] sm:text-xs">
                    {phone && (
                        <p className="flex items-center space-x-2 overflow-hidden">
                            <Phone className="text-blue-600 w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {phone}
                            </span>
                        </p>
                    )}
                    {email && (
                        <p className="flex items-center space-x-2 overflow-hidden">
                            <Mail className="text-blue-600 w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {email}
                            </span>
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => onEdit(id)}
                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-xs font-semibold py-1 rounded-lg transition-colors duration-200"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => onView(id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-xs font-semibold py-1 rounded-lg transition-colors duration-200"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialCard;
