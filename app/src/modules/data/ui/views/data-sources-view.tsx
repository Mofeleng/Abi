"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, DatabaseIcon, FileIcon, Fullscreen, LetterTextIcon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { UploadNewFileModal } from "../components/upload-new-file-modal";
import { ConfigureDatabaseModal } from "../components/configure-db-modal";
import { AcceptedDatabaseProviderDto } from "../../dtos/accepted-db-providers";
import { databases } from "../../constants/data-sources-options";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, useReactTable } from "@tanstack/react-table";
import getDataSources from "../../actions/get-datasources";
import { SiLetterboxd } from "react-icons/si";
import { DataSourceTable } from "../components/data-source-table";

export function DataSourcesView() {

    const [ newFileUploadOpen, setNewFileUploadOpen ] = useState<boolean>(false);
    const [ newDatabaseOpen, setNewDatabaseOpen ] = useState<boolean>(false);
    const [ selectedDatabase, setSelectedDatabase ] = useState<AcceptedDatabaseProviderDto>();

   
    const handleSelectDatabase = (db: AcceptedDatabaseProviderDto) => {
        setSelectedDatabase(db);
        setNewDatabaseOpen(true);
    }
    return (
        <>
            <UploadNewFileModal open={newFileUploadOpen} setOpen={setNewFileUploadOpen} />
            <ConfigureDatabaseModal key={selectedDatabase} db={selectedDatabase ?? "POSTGRES"} open={newDatabaseOpen} setOpen={setNewDatabaseOpen} />

            <div className="px-4 py-10 h-[calc(screen-64px)] space-y-6">
                <div className="w-full flex justify-between">
                    <h2 className="text-xl">Data sources</h2>
                </div>
                <DataSourceTable />
                <div className="">
                    <h3 className="">Add a database</h3>
                    <div className="py-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                        { databases.map((db) => (
                                <div 
                                    className="p-2 hover:bg-muted hover:cursor-pointer transition-all delay-75 rounded-sm flex flex-col gap-1.5 justify-center items-center"
                                    key={db.id}
                                    onClick={() => handleSelectDatabase(db.id)}
                                >
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