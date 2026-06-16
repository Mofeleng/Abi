import { ToolUIPart } from "ai";

export interface MessageDto {
    id: string;
    from: "user" | "abi";
    sources?: {
        href: string;
        title: string;
    }[];
    versions: {
        id: string;
        content: string;
    }[];
    reasoning?: {
        content: string;
        duration: number;
    },
    tools?: {
        name: string;
        description: string;
        status: ToolUIPart["state"],
        parameters: Record<string, unknown>;
        result: string | undefined;
        error: string | undefined;
    }
}