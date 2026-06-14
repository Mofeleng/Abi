"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [ commandOpen, setCommandOpen ] = useState<boolean>(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [])
    return (
        <>
            <DashboardCommand 
                open={commandOpen}
                setOpen={setCommandOpen}
            />
            <nav className="flex px-4 gap-4 items-center bg-background h-16">
                <Button
                    variant="outline"
                    onClick={toggleSidebar}
                >
                    { 
                        (state === "collapsed" || isMobile) ?
                        <PanelLeftIcon className="size-5" /> :
                        <PanelLeftCloseIcon className="size-5" />
                    }
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommandOpen((open) => !open)}
                    className="h-10 w-60 justify-start font-normal text-muted-foreground hover:bg-muted"
                >
                    <SearchIcon />
                    Search
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">&#8984;</span>K
                    </kbd>
                </Button>
            </nav>
        </>
    )
}