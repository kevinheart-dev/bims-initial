import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const BreadCrumbsHeader = ({ breadcrumbs }) => {
    return (
        <header className="flex items-center p-4 bg-white border-b border-gray-200">
            <SidebarTrigger className="text-gray-700 text-xl mr-2 hover:text-gray-900" />
            <Separator orientation="vertical" className="mr-2 h-4 border-gray-300" />
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                        const isLink = !!item.href;
                        const visibility = !item.showOnMobile ? "hidden md:block" : "";

                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem className={visibility}>
                                    {isLink ? (
                                        <BreadcrumbLink
                                            href={item.href}
                                            className="text-gray-600 text-sm hover:text-gray-900"
                                        >
                                            {item.label}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="text-gray-900 text-sm font-semibold">
                                            {item.label}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator className={visibility + " text-gray-400"} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
};

export default BreadCrumbsHeader;
