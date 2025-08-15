import React from 'react'
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from '@/Components/FilterButtons/DynamicTableControls';
const BarangayInfrastucture = (infrastructure) => {

    // const allColumns = [
    //     { key: "id", label: "ID" },
    //     { key: "title", label: "Title" },
    //     { key: "description", label: "Description" },
    //     { key: "project_category", label: "Category" },
    //     { key: "budget", label: "Budget" },
    //     { key: "founding_source", label: "Source" },
    //     { key: "start_date", label: "Start" },
    //     { key: "end_date", label: "End" },
    //     { key: "actions", label: "Actions" },
    // ];
    return (
        <div className="p-2 md:p-4">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                        <pre>{JSON.stringify(infrastructure, undefined, 3)}</pre>
                        {/* <div className="flex items-center gap-2 flex-wrap">
                            <DynamicTableControls
                                allColumns={allColumns}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                onPrint={handlePrint}
                                showFilters={showFilters}
                                toggleShowFilters={() =>
                                    setShowFilters((prev) => !prev)
                                }
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarangayInfrastucture
