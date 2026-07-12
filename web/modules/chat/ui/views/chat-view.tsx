"use client"

import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/chat-atoms";
import { ChatLoadingScreen } from "../screens/chat-loading";
import { ChatErrorScreen } from "../screens/chat-error-screen";
import { ConversationScreen } from "../screens/conversation-screen";
import { ConversationSelectionScreen } from "../screens/conversations-selection-screen";

interface Props {
    user_id: string;
}

export function ChatView({ user_id }:Props) {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <ChatErrorScreen />,
        loading: <ChatLoadingScreen user_id={user_id} />,
        chat: <ConversationScreen />,
        selection: <ConversationSelectionScreen />
    }
    
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            { screenComponents[screen] }
        </main>
    )
}