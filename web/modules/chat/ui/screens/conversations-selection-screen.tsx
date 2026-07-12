"use client"

import { useAtomValue, useSetAtom } from "jotai"
import { chatSessionAtomFamily, screenAtom, userIdAtom } from "../../atoms/chat-atoms";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";

export function ConversationSelectionScreen() {
    const setScreen = useSetAtom(screenAtom);
    const user_id = useAtomValue(userIdAtom);

    const chatSessionId = useAtomValue(
        chatSessionAtomFamily(user_id || "")
    )

    return (
    <>
    <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
               <Button
                    variant="outline"
                    onClick={() => {}}
                    className="h-16 w-full justify-between"
                >
                <div className="flex items-center gap-x-2">
                    <MessageSquareTextIcon className="size-4" />
                    <span>Start chat</span>
                </div>
                <ChevronRightIcon />
               </Button>
            </div>
    </>
    )
}