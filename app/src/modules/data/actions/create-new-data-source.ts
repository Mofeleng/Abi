"use server";

import prisma from "@/lib/prisma";
import { ConfigureNewDatabaseDto } from "../dtos/configure-new-db-dto";
import { encrypt } from "./encrypt-secret";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DATABASE_ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY;
const MASTER_ENCRYPTION_KEY = process.env.MASTER_ENCRYPTION_KEY;

export async function createNewDatabaseSource(values: ConfigureNewDatabaseDto) {
    if (!DATABASE_ENCRYPTION_KEY || !MASTER_ENCRYPTION_KEY) throw new Error("Invalid encryption keys");
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) throw new Error("Unauthorized");

    const encryptedConnectionString = await encrypt(values.databaseConnectionString, DATABASE_ENCRYPTION_KEY);
    const encryptedDEK =await encrypt(DATABASE_ENCRYPTION_KEY, MASTER_ENCRYPTION_KEY);

    return prisma.dataSource.create({
        data: {
            userId: session.session.userId,
            name: values.name,
            encryptedConnectionString,
            encryptedKey: encryptedDEK,
            type: values.type
        }
    });
}