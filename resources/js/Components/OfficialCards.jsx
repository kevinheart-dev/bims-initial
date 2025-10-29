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

            {/* Profile Image */}
            <div className="flex justify-center mt-4">
                <img
                    src={
                        image instanceof File
                            ? URL.createObjectURL(image)
                            : image
                            ? `/storage/${image}`
                            : "/images/default-avatar.jpg"
                    }
                    alt={name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-indigo-100 object-cover"
                />
            </div>

            {/* Details */}
            <div className="px-4 py-3 text-center">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {name}
                </h2>
                <p className="text-indigo-600 font-semibold text-xs sm:text-sm">
                    {position}
                </p>
                <p className="text-gray-500 text-[9px] sm:text-[10px]">
                    Designation: Purok {purok}
                </p>
                <p className="text-gray-500 text-[9px] sm:text-[10px] mb-2">
                    Term: {term}
                </p>

                {/* Contact Info */}
                <div className="space-y-1 text-[9px] sm:text-xs">
                    {phone && (
                        <p className="flex items-center justify-center space-x-2 overflow-hidden">
                            <Phone className="text-indigo-600 w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {phone}
                            </span>
                        </p>
                    )}
                    {email && (
                        <p className="flex items-center justify-center space-x-2 overflow-hidden">
                            <Mail className="text-indigo-600 w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {email}
                            </span>
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => onEdit(id)}
                        className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm font-semibold py-1 rounded-lg transition-colors duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onView(id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold py-1 rounded-lg transition-colors duration-200"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialCard;
