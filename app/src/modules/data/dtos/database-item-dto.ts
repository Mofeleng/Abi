import { IconType } from "react-icons/lib";
import { AcceptedDatabaseProviderDto } from "./accepted-db-providers";

export interface DatabaseItemDto {
    id: AcceptedDatabaseProviderDto;
    label: string;
    icon: IconType;
    fill: string;
}