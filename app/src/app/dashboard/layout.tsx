import { RenderSidebar } from "@/components/render-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { FolderSidebar } from "@/modules/workspace/ui/components/folder-sidebar"
import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Dashboard - Abi"
}

export default function Layout({ children }: { children: React.ReactNode }) {
    

    return (
        <SidebarProvider>
            <RenderSidebar />
            <SidebarInset>
                <main className="flex h-dvh flex-col overflow-hidden">
                    <DashboardNavbar />
                    <div className="px-4 w-full">
                        <Separator />
                    </div>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}