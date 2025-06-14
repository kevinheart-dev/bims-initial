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
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
            <div className="mb-4 flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Columns3 />
                            Select Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
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
                                            ? prev.filter((k) => k !== col.key)
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
            {/* resident filter */}
            <ResidentFilterBar
                queryParams={queryParams}
                searchFieldName={searchFieldName}
                puroks={puroks}
            />

            {/* Table */}
            <div className="max-h-[600px] overflow-auto w-full">
                <Table ref={contentRef} className="min-w-full">
                    <TableCaption>
                        {Array.isArray(residents.links) &&
                            residents.links.length > 0 && (
                                <Pagination
                                    links={residents.links}
                                    queryParams={queryParams}
                                />
                            )}
                    </TableCaption>
                    <TableHeader className="shadow-md">
                        <TableRow>
                            {allColumns.map(
                                (col) =>
                                    visibleColumns.includes(col.key) && (
                                        <TableHead
                                            key={col.key}
                                            className=" bg-blue-600 text-white p-4 text-nowrap"
                                        >
                                            {col.label}
                                        </TableHead>
                                    )
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {residentData.length > 0 ? (
                            residentData.map((resident) => (
                                <TableRow key={resident.id}>
                                    {allColumns.map((col) =>
                                        visibleColumns.includes(col.key) ? (
                                            <TableCell key={col.key}>
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
                                                   (resident.occupation ?? "N/A")}
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
                                            </TableCell>
                                        ) : null
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumns.length}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end items-center p-4  rounded shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Total Records:{" "}
                        <span className="text-blue-600">
                            {residentData.length}
                        </span>
                    </h2>
                </div>
            </div>
        </>
    );
};

export default ResidentTable;
