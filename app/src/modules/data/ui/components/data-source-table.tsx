import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DatabaseIcon, WholeWordIcon } from "lucide-react";
import { SiLetterboxd } from "react-icons/si";
import { DataSourceDto } from "../../dtos/data-source-dto";
import getDataSources from "../../actions/get-datasources";
import { useQuery } from "@tanstack/react-query";
import { mapDatabaseToLabel } from "../../helpers/database-provider-mapper";

 const columnHelper = createColumnHelper<DataSourceDto>();

const columns = [
    columnHelper.accessor("name", {
        id: "name",
        cell: (info) => info.getValue(),
        header: () => (
            <span className="flex items-center gap-1.5">
                <WholeWordIcon />
                Name
            </span>
        )
    }),
    columnHelper.accessor("type", {
        id: "type",
        cell: (info) => mapDatabaseToLabel(info.getValue()),
        header: () => (
            <span className="flex items-center gap-1.5">
                <DatabaseIcon />
                Database
            </span>
        )
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
    }),
]

export function DataSourceTable() {
    const { data:sources, isPending:loadingSources, error:sourcesError } = useQuery({
        queryKey: ["get-datasources"],
        queryFn: getDataSources
    });

    const table = useReactTable({
        data: sources ?? [],
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    if (loadingSources) {
        return <div className="p-4 text-sm text-muted-foreground">Loading data sources</div>;
    }
    if (sourcesError) {
        return (
            <div className="p-4 text-sm text-red-500">
                Failed to load data sources: { sourcesError.message }
            </div>
        )
    }

    return (
        <div className="border">
            <table className="w-full text-sm">
                <thead>
                    { table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b bg-muted/50">
                            { headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-left font-medium text-muted-foreground"
                                >
                                    { flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    { table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-6 text-center text-muted-foreground"    
                            >
                                No data sources found
                            </td>
                        </tr>
                    ): (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b">
                                { row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2">
                                        { flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}