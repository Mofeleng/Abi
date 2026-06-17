"use client";

import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BlocksIcon, BriefcaseBusinessIcon, DatabaseIcon, GitGraphIcon, LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


const groupOne = [
    {
        icon: BriefcaseBusinessIcon,
        label: "Workspace",
        link: "/dashboard/workspace"
    },
    
]

const groupTwo = [
    {
        icon: DatabaseIcon,
        label: "Data sources",
        link: "/dashboard/data"
    },
    {
        icon: BlocksIcon,
        label: "Intergrations",
        link: "/dashboard/intergrations"
    }
]

export function DashboardSidebar() {
    const [ logoSrc, setLogoSrc ] = useState<string|null>(null);
    const pathname = usePathname();
    const { resolvedTheme } = useTheme();


    useEffect(() => {
        if (resolvedTheme) {
            setLogoSrc(resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-base.svg");
        } else {
            setLogoSrc("/logo-base.svg")
        }
    }, [resolvedTheme]);


    return (
        <Sidebar variant="inset">
            <SidebarHeader className="h-16 flex-row items-center">
                { logoSrc ? (
                     <Image
                        src={logoSrc}
                        alt="Logo"
                        width={80}
                        height={60}
                    />
                ): (
                    <LoaderIcon className="animate-spin" />
                )}  {/* TODO: Use skeleton */}
               
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Work</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { groupOne.map((item) => (
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
                <SidebarGroup>
                    <SidebarGroupLabel>Manage</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { groupTwo.map((item) => (
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