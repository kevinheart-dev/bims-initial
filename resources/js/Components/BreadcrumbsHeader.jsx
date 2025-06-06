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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const BreadCrumbsHeader = ({ breadcrumbs }) => {
    return (
        <header className="flex items-center p-4 bg-gray-800">
            <SidebarTrigger className="text-white text-xl mr-2" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                        const isLink = !!item.href;
                        const visibility = !item.showOnMobile
                            ? "hidden md:block"
                            : "";

                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem className={visibility}>
                                    {isLink ? (
                                        <BreadcrumbLink
                                            href={item.href}
                                            className="text-gray-400 text-sm hover:underline hover:text-white"
                                        >
                                            {item.label}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="text-gray-400 text-sm">
                                            {item.label}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator
                                        className={visibility}
                                    />
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
