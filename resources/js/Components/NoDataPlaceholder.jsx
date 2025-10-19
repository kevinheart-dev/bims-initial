// Components/NoDataPlaceholder.jsx
import { router } from "@inertiajs/react";

export default function NoDataPlaceholder({ message, tip }) {
    return (
        <div className="flex flex-col items-center justify-center mt-20 bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <img
                src="/images/chart_error.png"
                alt="No data"
                className="w-48 h-48 mb-6 animate-bounce"
            />
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                No Data Available
            </h2>
            <p className="text-gray-600 text-center mb-4 max-w-lg text-lg">
                {message ||
                    "The dashboard cannot display data for the selected year. Please select a year to view statistics and insights. Ensure that the year chosen has data collected."}
            </p>
            {tip && (
                <p className="text-gray-500 text-center mb-6 max-w-md text-sm italic">
                    {tip}
                </p>
            )}
            <button
                onClick={() => router.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg"
            >
                Refresh Page
            </button>
        </div>
    );
}
