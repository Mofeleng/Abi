"use client";

import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { FolderSidebar } from "@/modules/workspace/ui/components/folder-sidebar";
import { usePathname } from "next/navigation";

export function RenderSidebar() {
    const pathname = usePathname();

    const isWorkspace = pathname.startsWith("/dashboard/workspace/");

    return (
        <>
            { isWorkspace ? <FolderSidebar /> : <DashboardSidebar />}
        </>
    )
}