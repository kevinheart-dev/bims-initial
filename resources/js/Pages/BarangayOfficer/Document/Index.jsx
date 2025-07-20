import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/Components/Pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilePlus2, FileUp, SquarePlus } from "lucide-react";
import { useRef, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";

export default function Index({ documents }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Documents", showOnMobile: true },
    ];
    const fileInputRef = useRef(null);
    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            const formData = new FormData();
            formData.append("file", file);

            router.post(route("document.store"), formData, {
                forceFormData: true,
                onSuccess: () => {
                    console.log("Upload successful!");
                },
                onError: (errors) => {
                    console.error("Upload failed:", errors);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Documents Dashboard" />
            <div>
                {/* <pre>{JSON.stringify(residents, undefined, 3)}</pre> */}
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-gray-50 shadow-sm rounded-xl sm:rounded-lg p-4 my-8 ">
                        <div className="flex justify-between items-start w-full gap-10 ">
                            <div className="p-4 w-full">
                                <Button
                                    className="bg-blue-700 hover:bg-blue-400"
                                    onClick={handleDivClick}
                                >
                                    <FilePlus2 />
                                </Button>
                                <Input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[400px]">
                                                Document Name
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.map((document) => (
                                            <TableRow key={document.id}>
                                                <TableCell className="w-[400px]">
                                                    {document.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <a
                                                        href={route(
                                                            "document.fill",
                                                            [1, document.id]
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button className="bg-blue-700 hover:bg-blue-400">
                                                            Issue
                                                        </Button>
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
