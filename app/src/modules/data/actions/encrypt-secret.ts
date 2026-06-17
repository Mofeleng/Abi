"use server";

import crypto from "crypto";

const IV_LENGTH = 16;

export function encrypt(secret: string, key:string) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv("aes-256-ccm", key, iv);

    let encrypted = cipher.update(secret, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
}