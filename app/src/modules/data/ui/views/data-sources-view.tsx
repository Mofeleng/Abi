"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SiMongodb, SiMysql, SiPostgresql } from "react-icons/si"
import { UploadNewFileModal } from "../components/upload-new-file-modal";
const databases = [
    {
        id: "postgres",
        label: "PostgreSQL",
        icon: SiPostgresql,
        fill: "#336791"
    },
    {
        id: "mongo",
        label: "MongoDB",
        icon: SiMongodb,
        fill: "#3FA037"
    },
    {
        id: "sql",
        label: "MySQL",
        icon: SiMysql,
        fill: "#00758f"
    }
]

export function DataSourcesView() {

    const [ newFileUploadOpen, setNewFileUploadOpen ] = useState<boolean>(false);

    return (
        <>
            <UploadNewFileModal open={newFileUploadOpen} setOpen={setNewFileUploadOpen} />
            <div className="px-4 py-10 h-[calc(screen-64px)] space-y-6">
                <div className="w-full flex justify-between">
                    <h2 className="text-xl">Data sources</h2>
                </div>
                <Alert className="text-center">
                    <AlertTitle>No data sources</AlertTitle>
                    <AlertDescription>Your added data sources will show up here.</AlertDescription>
                </Alert>
                <div className="">
                    <h3>Add a file</h3>
                    <div className="py-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                        <div className="flex flex-col gap-1.5 justify-center items-center hover:bg-muted hover:cursor-pointer"
                            onClick={() => setNewFileUploadOpen((open) => !open)}
                        >
                            <FileIcon className="w-10 h-10 fill-primary" />
                            <span className="text-xs text-muted-foreground truncate">.pdf, .xlsx, .txt, .csv</span>
                        </div>
                    </div>
                </div>
                <div className="">
                    <h3 className="">Add a database</h3>
                    <div className="py-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                        { databases.map((db) => (
                                <div className="p-2 hover:bg-muted hover:cursor-pointer transition-all delay-75 rounded-sm flex flex-col gap-1.5 justify-center items-center" key={db.id}>
                                <db.icon className="w-10 h-10" style={{ fill: db.fill }} />
                                <h4 className="">{ db.label }</h4>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}