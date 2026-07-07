import { DatabaseItemDto } from "../dtos/database-item-dto";
import { SiMongodb, SiMysql, SiPostgresql } from "react-icons/si"

export const databases:DatabaseItemDto[] = [
    {
        id: "POSTGRES",
        label: "PostgreSQL",
        icon: SiPostgresql,
        fill: "#336791"
    },
    {
        id: "MONGO",
        label: "MongoDB",
        icon: SiMongodb,
        fill: "#3FA037"
    },
    {
        id: "MYSQL",
        label: "MySQL",
        icon: SiMysql,
        fill: "#00758f"
    }
]