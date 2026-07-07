"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function getDataSources() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) throw new Error("Unauhorized");

    return prisma.dataSource.findMany({
        where: {
            userId: session.session.userId
        }
    });
}