"use server";

import crypto from "crypto";

const ALGORITHM = process.env.ENCRYPTION_ALGORITH as string;

export function decrypt(encryptedSecret:string, key: string) {
    const [ivHex, encrypted] = encryptedSecret.split(":");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}