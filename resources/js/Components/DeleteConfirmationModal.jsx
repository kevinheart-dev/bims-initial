// resources/js/Components/DeleteConfirmationModal.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}) {
    const [confirmationText, setConfirmationText] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <svg
                            className="w-6 h-6 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 4h2v6H9V4zm0 8h2v2H9v-2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-center mb-2">
                    Confirm Delete
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-600 text-center mb-4">
                    Are you sure you want to delete this record? This action cannot be undone.
                </p>

                {/* Input */}
                <label className="block text-sm text-gray-500 mb-1">
                    Please type <span className="font-semibold">"Reset settings"</span> to confirm.
                </label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Reset settings"
                />

                {/* Confirm Button */}
                <button
                    onClick={() => {
                        if (confirmationText === "Reset settings") {
                            onConfirm();
                            setConfirmationText("");
                        } else {
                            alert("Please type 'Reset settings' exactly.");
                        }
                    }}
                    className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                    I UNDERSTAND, DELETE
                </button>
            </div>
        </div>
    );
}
