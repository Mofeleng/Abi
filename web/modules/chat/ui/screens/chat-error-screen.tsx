"use client";

import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../../atoms/chat-atoms";
import { AlertTriangleIcon } from "lucide-react";

export function ChatErrorScreen() {
    const errorMessage = useAtomValue(errorMessageAtom);

    return (
        <>
            <div className="flex flex-1 flex-col text-muted-foreground items-center justify-center gap-y-4 p-4">
                <AlertTriangleIcon className=""/>
                <p className="text-sm">
                    { errorMessage || "Invalid Configuration" }
                </p>
            </div>
        </>
    )
}