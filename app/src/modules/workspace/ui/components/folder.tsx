import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder as FolderDto } from "@/generated/prisma/client"
import { FolderIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FolderProps {
    folder: FolderDto
}

function FolderItem({ name, folderId }: { name: string, folderId: string }) {
    const router = useRouter();

    const handleOpen = () => {
        router.push(`/dashboard/workspace/${folderId}`);
    }
    return (
        <div onClick={handleOpen} className="p-2 hover:bg-muted rounded-md cursor-pointer relative group">
            <FolderIcon className="w-40 h-40 text-primary fill-primary" />
            <h4 className="text-sm">{ name }</h4>
            <span className="text-xs text-muted-foreground">
                last updated at 14:00 today
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-6 w-6 opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity z-555"
                    >
                        <MoreHorizontalIcon className="h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
            </DropdownMenu>
        </div>
    )
}
export function Folder({ folder }:FolderProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <FolderItem name={folder.name} folderId={folder.id} />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Rename</ContextMenuItem>
                <ContextMenuItem>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
            
    )
}