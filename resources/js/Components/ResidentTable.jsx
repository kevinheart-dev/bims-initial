import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
    SquarePen,
    Trash2,
    Network,
    Columns3,
    Rows4,
    Rows3,
    Printer,
} from "lucide-react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import Pagination from "@/components/Pagination"; // your custom pagination component
import {
    RESIDENT_CIVIL_STATUS_TEXT,
    RESIDENT_EMPLOYMENT_STATUS_TEXT,
    RESIDENT_GENDER_TEXT,
    RESIDENT_REGISTER_VOTER_CLASS,
    RESIDENT_REGISTER_VOTER_TEXT,
} from "@/constants";
import ResidentFilterBar from "@/Components/ResidentFilterBar";

const ResidentTable = ({
    residents,
    queryParams,
    route,
    searchFieldName,
    puroks,
    toggleShowAll,
    showAll,
}) => {
    const printRef = useRef(null);

    const allColumns = [
        { key: "resident_id", label: "ID" },
        { key: "resident_picture", label: "Resident Image" },
        { key: "name", label: "Name" },
        { key: "gender", label: "Gender" },
        { key: "age", label: "Age" },
        { key: "civil_status", label: "Civil Status" },
        { key: "employment_status", label: "Employment" },
        { key: "occupation", label: "Occupation" },
        { key: "citizenship", label: "Citizenship" },
        { key: "registered_voter", label: "Registered Voter" },
        { key: "contact_number", label: "Contact Number" },
        { key: "email", label: "Email" },
        { key: "purok_number", label: "Purok" },
        { key: "actions", label: "Actions" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );

    const handleEdit = (id) => {
        // Your edit logic here
    };

    const handleDelete = (id) => {
        // Your delete logic here
    };
    const residentData = Array.isArray(residents.data)
        ? residents.data
        : residents;

    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <>
            {/* Column Toggle + Print */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns3 />
                                Select Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={
                                    visibleColumns.length === allColumns.length
                                }
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setVisibleColumns(
                                            allColumns.map((col) => col.key)
                                        );
                                    }
                                }}
                            >
                                Select All
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleColumns.length === 0}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setVisibleColumns([]);
                                    }
                                }}
                            >
                                Deselect All
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            {allColumns.map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.key}
                                    checked={visibleColumns.includes(col.key)}
                                    onCheckedChange={() => {
                                        setVisibleColumns((prev) =>
                                            prev.includes(col.key)
                                                ? prev.filter(
                                                      (k) => k !== col.key
                                                  )
                                                : [...prev, col.key]
                                        );
                                    }}
                                >
                                    {col.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={toggleShowAll}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        {showAll ? <Rows3 /> : <Rows4 />}
                        {showAll ? "Show Paginated" : "Show Full List"}
                    </Button>
                    <Button onClick={() => reactToPrintFn()}>
                        <Printer />
                        Print
                    </Button>
                </div>
                <h2 className="text-2xl font-semibold text-gray-700">
                    Total Records:{" "}
                    <span className="text-blue-600">{residentData.length}</span>
                </h2>
            </div>

            {/* resident filter */}
            <ResidentFilterBar
                queryParams={queryParams}
                searchFieldName={searchFieldName}
                puroks={puroks}
            />

            {/* Table */}
            <div
                className={`w-full ${
                    showAll ? "overflow-auto max-h-[600px]" : "max-h-[1500px] "
                }`}
            >
                <table ref={contentRef} className="min-w-full">
                    <thead className="shadow-md sticky top-0 ">
                        <tr>
                            {allColumns.map(
                                (col) =>
                                    visibleColumns.includes(col.key) && (
                                        <th
                                            key={col.key}
                                            className=" bg-blue-600 text-white p-4 text-nowrap font-semibold text-sm text-start"
                                        >
                                            {col.label}
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {residentData.length > 0 ? (
                            residentData.map((resident) => (
                                <tr key={resident.id}>
                                    {allColumns.map((col) =>
                                        visibleColumns.includes(col.key) ? (
                                            <td
                                                key={col.key}
                                                className="p-2 text-start"
                                            >
                                                {col.key === "resident_id" &&
                                                    resident.id}
                                                {col.key ===
                                                    "resident_picture" && (
                                                    <img
                                                        src={
                                                            resident.resident_picture
                                                                ? `/storage/${resident.resident_picture}`
                                                                : "/images/default-avatar.jpg"
                                                        }
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                "/images/default-avatar.jpg";
                                                        }}
                                                        alt="Resident"
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                )}
                                                {col.key === "name" &&
                                                    `${resident.firstname} ${
                                                        resident.middlename ??
                                                        ""
                                                    } ${
                                                        resident.lastname ?? ""
                                                    } ${resident.suffix ?? ""}`}
                                                {col.key === "gender" &&
                                                    RESIDENT_GENDER_TEXT[
                                                        resident.gender
                                                    ]}
                                                {col.key === "age" &&
                                                    resident.age}
                                                {col.key === "civil_status" &&
                                                    RESIDENT_CIVIL_STATUS_TEXT[
                                                        resident.civil_status
                                                    ]}
                                                {col.key ===
                                                    "employment_status" &&
                                                    RESIDENT_EMPLOYMENT_STATUS_TEXT[
                                                        resident
                                                            .employment_status
                                                    ]}
                                                {col.key === "occupation" &&
                                                    (resident.occupation ??
                                                        "N/A")}
                                                {col.key === "citizenship" &&
                                                    resident.citizenship}
                                                {col.key ===
                                                    "registered_voter" && (
                                                    <span
                                                        className={
                                                            RESIDENT_REGISTER_VOTER_CLASS[
                                                                resident
                                                                    .registered_voter
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            RESIDENT_REGISTER_VOTER_TEXT[
                                                                resident
                                                                    .registered_voter
                                                            ]
                                                        }
                                                    </span>
                                                )}
                                                {col.key === "contact_number" &&
                                                    resident.contact_number}
                                                {col.key === "purok_number" &&
                                                    `Purok ${resident.purok_number}`}
                                                {col.key === "email" &&
                                                    resident.email}
                                                {col.key === "actions" && (
                                                    <ActionMenu
                                                        actions={[
                                                            {
                                                                label: "Edit",
                                                                icon: (
                                                                    <SquarePen className="w-4 h-4 text-green-500" />
                                                                ),
                                                                onClick: () =>
                                                                    handleEdit(
                                                                        resident.id
                                                                    ),
                                                            },
                                                            {
                                                                label: "Delete",
                                                                icon: (
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                ),
                                                                onClick: () =>
                                                                    handleDelete(
                                                                        resident.id
                                                                    ),
                                                            },
                                                            {
                                                                label: "Family Tree",
                                                                icon: (
                                                                    <Network className="w-4 h-4 text-blue-500" />
                                                                ),
                                                                href: route(
                                                                    "resident.familytree",
                                                                    resident.id
                                                                ),
                                                                tooltip:
                                                                    "See Family Tree",
                                                            },
                                                        ]}
                                                    />
                                                )}
                                            </td>
                                        ) : null
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={visibleColumns.length}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {visibleColumns.length === 0 ? (
                    <div className="p-2 text-sm text-red-600 font-medium w-full text-center rounded-lg border border-gray-200">
                        All columns are hidden.
                    </div>
                ) : (
                    <div>
                        {Array.isArray(residents.links) &&
                            residents.links.length > 0 && (
                                <Pagination
                                    links={residents.links}
                                    queryParams={queryParams}
                                />
                            )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ResidentTable;
