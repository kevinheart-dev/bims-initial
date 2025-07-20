import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";

export default function Index() {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Practice Axios", showOnMobile: true },
    ];

    const APP_URL = useAppUrl();

    const [documents, setDocuments] = useState([]);
    const [path, setPath] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                // Fetch female data from the API using async/await
                const response = await axios.get(
                    `${APP_URL}/barangay_officer/document/fetchdocuments`
                );
                console.log(response);
                setDocuments(response.data.documents);
            } catch (error) {
                console.error(
                    "There was an error fetching the female data!",
                    error
                );
            }
        };
        fetchDocs();
    }, []);

    const handleDocumentPath = async (id) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/document/fetchdocumentpath/${id}`
            );

            // Log full response for debugging
            console.log("Fetched document path:", response.data);

            // Assuming response.data.document contains the full file path
            setPath(response.data.document);
        } catch (error) {
            console.error(
                "There was an error fetching the document data!",
                error
            );
        }
    };

    return (
        <AdminLayout>
            <Head title="Documents Dashboard" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className="flex justify-between items-start w-full gap-10">
                            <div className="flex flex-col justify-center items-center p-4">
                                <p className="text-xl mb-4 text-nowrap">
                                    Store Templated Documents
                                </p>
                            </div>
                            <div className="p-4 w-full">
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
                                                    <Button
                                                        className="bg-blue-700 hover:bg-blue-400"
                                                        onClick={() =>
                                                            handleDocumentPath(
                                                                document.id
                                                            )
                                                        }
                                                    >
                                                        Issue
                                                    </Button>
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
