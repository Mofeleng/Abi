import { AcceptedDatabaseProviderDto } from "./accepted-db-providers";

export interface DataSourceDto {
    name: string;
    type: AcceptedDatabaseProviderDto;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    url: string | null;
    encryptedConnectionString: string | null;
    encryptedKey: string | null;
}