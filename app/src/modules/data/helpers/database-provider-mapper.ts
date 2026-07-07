import { AcceptedDatabaseProviderDto } from "../dtos/accepted-db-providers";
import { AcceptedFileExtensionsDto } from "../dtos/accepted-file-extensions";

export function mapDatabaseToLabel(id: AcceptedDatabaseProviderDto): string {
    let label = "";

    switch (id) {
        case "POSTGRES":
            label = "PostgreSQL";
            break;
        case "MONGO":
            label = "MongoDB";
            break;
        case "MYSQL":
            label = "MySQL";
            break;
    }

    return label;
}