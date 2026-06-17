"use server";

import crypto from "crypto";

const IV_LENGTH = 16;
const ALGORITHM = process.env.ENCRYPTION_ALGORITH as string;

export function encrypt(secret: string, key:string) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(secret, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
}