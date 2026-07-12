"use client"

import { Button } from "@/components/ui/button"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"
import { ArrowLeftIcon, MenuIcon } from "lucide-react"
import { chatSessionAtomFamily, conversationIdAtom, screenAtom, userIdAtom } from "../../atoms/chat-atoms"
import { getConversation } from "../../actions/get-conversation"
import { useState } from "react"
import { getMessages } from "../../actions/get-messages"
import * as z from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendMessage } from "../../hooks/use-send-message"
import { AIConversation, AIConversationContent } from "../ai/conversation"
import { AIMessage, AIMessageContent } from "../ai/message"
import { AIResponse } from "../ai/response"
import { AIInput, AIInputSubmit, AIInputTextarea, AIInputToolbar, AIInputTools } from "../ai/input"
import { Field } from "@/components/ui/field"

const formSchema = z.object({
    message: z.string()
})


export function ConversationScreen() {
    const [ page, setPage ] = useState<number>(1);

    const conversationId = useAtomValue(conversationIdAtom);
    const userId = useAtomValue(userIdAtom);
    const chatSessionId = useAtomValue(
        chatSessionAtomFamily(userId || "")
    )

    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const queryClient = useQueryClient();

    if (!conversationId) return <></>

    const { data: conversation } = useQuery({
        queryKey: ["get-chat", conversationId],
        queryFn: () => getConversation({
            conversation_id: conversationId
        }),
        enabled: !!conversationId
    });

    const { data: messages } = useQuery({
        queryKey: ["messages", conversationId, page],
        queryFn: () => getMessages({
            conversation_id: conversationId,
            page,
            page_size: 20
        }),
        enabled: !!conversationId
    })

    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            message: ""
        }
    })

    const { mutateAsync: sendMessage } = useSendMessage();

    const onSendMessage = async (values: z.infer<typeof formSchema>) => {
        if (!conversation || !chatSessionId) return;
        form.reset();

        try {
            const message = await sendMessage({
                conversation_id: conversation.id,
                thread_id: conversation.thread_id,
                message: values.message,
                chat_session_id: chatSessionId
            });

            queryClient.invalidateQueries({
                queryKey: ["messages", conversationId, page]
            })
        } catch (error) {
            console.log((error as Error).message)
        }
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
           <AIConversation>
                <AIConversationContent className="flex flex-col flex-col-reverse">
                    { messages ? (
                        messages.items.map((message) => (
                            <AIMessage
                                from={message.message_from}
                                key={message.id}
                            >
                                <AIMessageContent>
                                    <AIResponse>
                                        { message.content }
                                    </AIResponse>
                                </AIMessageContent>
                            </AIMessage>
                        ))
                    ): (
                        <></>
                    )}
                </AIConversationContent>
           </AIConversation>
            <AIInput
                onSubmit={form.handleSubmit(onSendMessage)}
                className="rounded-none border-x-0 border-b-0"
            >
                <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <AIInputTextarea
                                onChange={field.onChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        form.handleSubmit(onSendMessage)();
                                    }
                                }}
                                placeholder="Type your message..."
                                value={field.value}
                            />

                        </Field>
                    )}
                />
                <AIInputToolbar>
                    <AIInputTools />
                    <AIInputSubmit
                        disabled={!form.formState.isValid}
                        status="ready"
                        type="submit"
                    />
                </AIInputToolbar>
            </AIInput>
        </>
    )
}