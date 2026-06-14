import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Dashboard - Abi"
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <main>
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