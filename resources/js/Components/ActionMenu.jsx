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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
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
