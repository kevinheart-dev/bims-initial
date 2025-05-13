import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
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
import { FileUp } from "lucide-react";
import { useRef, useState } from "react";

export default function Index() {
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
            <Head title="Resident Dashboard" />
            <div>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className="flex justify-between items-start w-full gap-10">
                            <div className="flex flex-col justify-center items-center p-4">
                                <p className="text-xl mb-4">
                                    Store Templated Documents
                                </p>
                                <div
                                    className="p-16 border-4 border-dashed border-blue-300 rounded-xl flex items-center justify-center hover:cursor-pointer"
                                    onClick={handleDivClick}
                                >
                                    <FileUp className="w-40 h-40 text-blue-400" />
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
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
                                <TableBody></TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
