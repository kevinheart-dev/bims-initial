import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@inertiajs/react";

const ActionMenu = ({ actions = [] }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    className="bg-gray-400 h-9 w-9 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                >
                    <MoreHorizontal className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {actions.map((action, index) => {
                    const item = (
                        <DropdownMenuItem
                            key={index}
                            onClick={action.href ? undefined : action.onClick}
                            className={cn(
                                "flex items-center gap-2",
                                action.className
                            )}
                            disabled={action.disabled}
                            asChild={!!action.href}
                        >
                            {action.href ? (
                                <Link
                                    href={action.href}
                                    className="flex items-center gap-2 w-full"
                                >
                                    {action.icon}
                                    {action.label}
                                </Link>
                            ) : (
                                <>
                                    {action.icon}
                                    {action.label}
                                </>
                            )}
                        </DropdownMenuItem>
                    );

                    return action.tooltip ? (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>{item}</TooltipTrigger>
                                <TooltipContent>
                                    <p>{action.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        item
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionMenu;
