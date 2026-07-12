"use client"

import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"
import { ArrowLeftIcon, MenuIcon } from "lucide-react"
import { chatSessionAtomFamily, conversationIdAtom, screenAtom, userIdAtom } from "../../atoms/chat-atoms"
import { getConversation } from "../../actions/get-conversation"
import { GetConversationRequestBody } from "../../dtos/conversation"

export function ConversationScreen() {
    const conversationId = useAtomValue(conversationIdAtom);
    const userId = useAtomValue(userIdAtom);
    const chatSessionId = useAtomValue(
        chatSessionAtomFamily(userId || "")
    )

    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    if (!conversationId) return <></>

    const { data: conversation } = useQuery({
        queryKey: ["get-chat", conversationId],
        queryFn: () => getConversation({
            conversation_id: conversationId
        })
    });

    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onBack}
                        className="hover:text-foreground/80"
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>Chat</p>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:text-foreground/80"
                >
                    <MenuIcon />
                </Button>
            </div>
            <div className="flex flex-col flex-1 gap-y-4 text-muted-foreground">
                { JSON.stringify(conversation) }
            </div>
        </>
    )
}