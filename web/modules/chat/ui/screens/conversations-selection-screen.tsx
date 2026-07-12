"use client"

import { useAtomValue, useSetAtom } from "jotai"
import { chatSessionAtomFamily, conversationIdAtom, errorMessageAtom, screenAtom, userIdAtom } from "../../atoms/chat-atoms";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { useCreateConversation } from "../../hooks/use-create-conversation";

export function ConversationSelectionScreen() {
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const user_id = useAtomValue(userIdAtom);

    const chatSessionId = useAtomValue(
        chatSessionAtomFamily(user_id || "")
    )
    const { mutateAsync: createConversation, isPending: isCreatingConversation } = useCreateConversation();

    const handleNewConversation = async () => {
        if (!user_id) {
            setErrorMessage("User id is required");
            setScreen("error");
            return;
        }

         if (!chatSessionId) {
            setScreen("loading")
            return;
        }

        try {
            const conversation = await createConversation({
                user_id,
                chat_session_id: chatSessionId
            });

            setConversationId(conversation.conversation_id);
            setScreen("chat");

        } catch (error) {
            setErrorMessage((error as Error).message);
            setScreen("error");
        }
    }
    return (
    <>
    <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
               <Button
                    variant="outline"
                    onClick={handleNewConversation}
                    disabled={isCreatingConversation}
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