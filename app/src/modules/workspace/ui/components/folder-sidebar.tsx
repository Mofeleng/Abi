"use client";

import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BriefcaseBusinessIcon, DatabaseIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";


const sidebarItems = [
    {
        icon: BriefcaseBusinessIcon,
        label: "Workspace",
        link: "/dashboard/workspace"
    },
    {
        icon: DatabaseIcon,
        label: "Data sources",
        link: "/dashboard/data"
    },
]

export function FolderSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="h-16 flex-row items-center">
                <Image
                    src="/logo-base.svg"
                    alt="Logo"
                    width={80}
                    height={60}
                />
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Recent files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { sidebarItems.map((item) => (
                                <SidebarMenuItem key={item.link}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-primary/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.link && "bg-linear-to-r/oklch border-primary/10"
                                        )}
                                        isActive={pathname === item.link}
                                    >
                                        <Link href={item.link}>
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">
                                                { item.label }
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}