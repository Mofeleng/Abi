import { CommandEmpty, CommandGroup, CommandInput, CommandList, CommandResponsiveDialog } from "@/components/ui/command";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export function DashboardCommand({ open, setOpen }:Props) {
    const [ search, setSearch ] = useState<string>("");
    return (
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            showCloseButton={false}
        >
            <CommandInput
                placeholder="Search for folders, presentations or files..."
                value={search}
                onValueChange={(value) => setSearch(value)}
            />
            <CommandList>
                <CommandGroup heading="Folders">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">No folders found</span>
                    </CommandEmpty>
                    { /* TODO: Map through returned folders */ }
                </CommandGroup>

                <CommandGroup heading="Files and Presentations">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">No files or presentations found</span>
                    </CommandEmpty>
                    { /* TODO: Map through returned files and presentations */ }
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    )
}