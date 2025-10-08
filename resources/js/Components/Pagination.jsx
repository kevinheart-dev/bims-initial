import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams }) {
    queryParams = queryParams || {}; // safeguard

    if (!Array.isArray(links)) return null;

    const getLinkWithQueryParams = (link) => {
        if (!link.url) return null;

        const url = new URL(link.url, window.location.origin);

        // Preserve additional query params
        for (const [key, value] of Object.entries(queryParams)) {
            if (key !== "page") {
                url.searchParams.set(key, value);
            }
        }

        return url.pathname + url.search; // return relative path only
    };

    return (
        <nav className="text-center mt-4 space-x-1">
            {links.map((link, index) => {
                const urlWithParams = getLinkWithQueryParams(link);

                return (
                    <Link
                        key={index}
                        href={urlWithParams || "#"}
                        className={
                            "inline-block py-2 px-3 rounded-lg text-gray-700 text-xs " +
                            (link.active ? "bg-blue-400 text-white " : "") +
                            (!link.url
                                ? " !text-gray-400 cursor-not-allowed "
                                : "hover:bg-blue-300 ")
                        }
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
