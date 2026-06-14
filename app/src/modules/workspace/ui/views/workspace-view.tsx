"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, FolderIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewFolderModal } from "../components/new-folder-modal";
import { useQuery } from "@tanstack/react-query";
import getFolders from "../../actions/get-folders";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Folder } from "../components/folder";

export function WorkspaceView() {
    const [ newFolderModalOpen, setNewFolderModalOpen ] = useState<boolean>(false);
    
    const { isPending, data:folders, error } = useQuery({
        queryKey: ["get-folders"],
        queryFn: () => getFolders()
    });

    return (
        <>
            <NewFolderModal
                open={newFolderModalOpen}
                setOpen={setNewFolderModalOpen}
            />
            <div className="px-4 py-10 space-y-6 h-[calc(screen-64px)]">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-xl">Folders</h2>
                    <Button
                        className="flex items-center gap-1.5"
                        onClick={() => setNewFolderModalOpen((open) => !open)}
                    >
                        <PlusIcon />
                        New folder
                    </Button>
                </div>

                    {
                        isPending ? (
                            <div className="w-full flex flex-col min-h-[calc(screen-64px)]! justify-center items-center">
                                <LoaderIcon className="size-6 animate-spin text-primary" />
                                <span className="">Please wait...</span>
                            </div>
                        ): error ? (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Could not fetch folders</AlertTitle>
                                <AlertDescription>Something went wrong while fetching your folders. Please try again later.</AlertDescription>
                            </Alert>
                        ): (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                            {
                                folders.map((folder) => (
                                    <Folder key={folder.id} folder={folder} />
                                ))
                            }
                            </div>
                        )
                    }
                </div>
        </>
    )
}