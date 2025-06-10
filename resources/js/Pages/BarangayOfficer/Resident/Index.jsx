import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserRoundPlus, HousePlus } from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";

import ResidentTable from "@/Components/ResidentTable";

export default function Index({ residents, queryParams = null, puroks }) {
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };

    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("resident.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Table", showOnMobile: true },
    ];

    // Determine if showing all or paginated by checking queryParams.all
    const [showAll, setShowAll] = useState(queryParams.all === "true");

    // Update showAll state if queryParams change (for sync)
    useEffect(() => {
        setShowAll(queryParams.all === "true");
    }, [queryParams.all]);

    // Toggle handler to switch all param and reload
    const toggleShowAll = () => {
        let newQueryParams = { ...queryParams };

        if (showAll) {
            // Currently showing all, remove 'all' param to go back to paginated
            delete newQueryParams.all;
        } else {
            // Currently paginated, add 'all=true'
            newQueryParams.all = "true";
        }

        // Remove page param so it resets
        if (newQueryParams.page) {
            delete newQueryParams.page;
        }

        setShowAll(!showAll);
        router.get(route("resident.index", newQueryParams), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <Link href={route("resident.create")}>
                                    <Button className="bg-green-700 hover:bg-green-400 ">
                                        <HousePlus /> Add a Household
                                    </Button>
                                </Link>
                                <Link href={route("resident.createresident")}>
                                    <Button className="bg-green-700 hover:bg-green-400 ">
                                        <UserRoundPlus /> Add a Resident
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex w-full justify-end items-end space-x-1">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e.target.value)
                                        }
                                        className="ml-4"
                                    />
                                    <Button type="submit">
                                        <Search />
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <ResidentTable
                            residents={residents}
                            queryParams={queryParams}
                            route={route}
                            searchFieldName={searchFieldName}
                            puroks={puroks}
                            toggleShowAll={toggleShowAll}
                            showAll={showAll}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
