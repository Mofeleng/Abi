import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";


export function decrypt(payload: string, encryptionKey: string): string {
    const [ivHex, tagHex, encryptedHex] = payload.split(":");
    const key = Buffer.from(encryptionKey, "hex");

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(tagHex, "hex")
    );

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}