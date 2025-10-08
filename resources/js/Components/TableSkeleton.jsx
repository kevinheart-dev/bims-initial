// Components/TableSkeleton.jsx
import React from "react";
import { Skeleton } from "@/Components/ui/skeleton";

const TableSkeleton = ({ rows = 5, columns = 8 }) => {
    return (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
            {/* Header Skeleton */}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={`header-${i}`} className="p-3 bg-gray-100 border-b">
                        <Skeleton className="h-5 w-3/4 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Rows Skeleton */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={`row-${rowIndex}`}
                    className="grid items-center"
                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={`row-${rowIndex}-col-${colIndex}`}
                            className={`p-3 border-b ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                            <Skeleton className="h-5 w-3/4 mx-auto" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;
