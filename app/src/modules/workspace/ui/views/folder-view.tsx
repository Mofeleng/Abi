"use client";

import { useCallback, useMemo, useState } from "react"
import { MessageDto } from "../../dto/message-dto";
import { PromptInput, PromptInputActionAddAttachments, PromptInputActionMenu, PromptInputActionMenuContent, PromptInputActionMenuTrigger, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputHeader, PromptInputMessage, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ai-elements/prompt-input";
import { toast } from "sonner";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageBranch, MessageBranchContent, MessageBranchNext, MessageBranchPage, MessageBranchPrevious, MessageBranchSelector, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { GlobeIcon } from "lucide-react";

const delay = (ms: number): Promise<void> =>
  // eslint-disable-next-line promise/avoid-new -- setTimeout requires a new Promise
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });


  const suggestions = [
  "What are the latest trends in AI?",
  "How does machine learning work?",
  "Explain quantum computing",
  "Best practices for React development",
  "Tell me about TypeScript benefits",
  "How to optimize database queries?",
  "What is the difference between SQL and NoSQL?",
  "Explain cloud computing basics",
];

const SuggestionItem = ({
    onClick,
    suggestion
}: {
    suggestion: string;
    onClick: (suggestion: string) => void
}) => {
    const handleClick = useCallback(() => {
        onClick(suggestion);
    }, [ onClick, suggestion]);

    return <Suggestion onClick={handleClick} suggestion={suggestion} />
}

export function FolderView() {
    const [ status, setStatus ] = useState<"submitted" | "streaming" | "ready" | "error">("ready");
    const [ messages, setMessages ] = useState<MessageDto[]>([]);
    const [ text, setText ] = useState<string>("");
    const [, setStreamingMessageId] = useState<string|null>(null);

    const updateMessageContent = useCallback((messageId: string, newContent: string) => {
        setMessages((prev) => 
            prev.map((msg) => {
                if (msg.versions.some((v) => v.id === messageId)) {
                    return {
                        ...msg,
                        versions: msg.versions.map((v) => 
                            v.id === messageId ? { ...v, content: newContent } : v
                        ),
                    };
                };
                return msg
            })
        );
    }, []);

    const streamResponse = useCallback(async (messageId: string, content: string) => {
        setStatus("streaming");
        setStreamingMessageId(messageId);

        const words = content.split(" ");
        let currentContent = "";

        for (const [i, word] of words.entries()) {
            currentContent += (i > 0 ? " " : "") + word;
            updateMessageContent(messageId, currentContent);
            await delay(Math.random() * 100 + 50);
        }

        setStatus("ready");
        setStreamingMessageId(null);
    }, [updateMessageContent]);

    const addUserMessage = useCallback((content: string) => {
        const userMessage: MessageDto = {
            id: `user-${Date.now()}`,
            from: "user",
            versions: [
                {
                    content,
                    id: `user-${Date.now()}`,
                }
            ]
        };

        setMessages((prev) => [...prev, userMessage]);

        //TODO: Replace with real response or loader to show that Abi is thinking
        setTimeout(() => {
            const abiMessageId = `abi-${Date.now()}`;

            const baseResponse = "Hey Shadow, im still under prod. sorry";

            const abiMessage: MessageDto = {
                from: "abi",
                id: `abi-${Date.now()}`,
                versions: [
                    {
                        id: abiMessageId,
                        content: ""
                    }
                ]
            };

            setMessages((prev)=>[...prev, abiMessage]);
            streamResponse(abiMessageId, baseResponse);
        }, 500);
    }, [streamResponse]);

    const handleSubmit = useCallback((message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if ((!(hasText || !hasAttachments))) {
            return;
        }

        setStatus("submitted");

        if (message.files?.length) {
            toast.success("Files attached", {
                description: `${message.files.length} file(s) attached to message`
            });
        }

        addUserMessage(message.text || "Sent with attachements");
        setText("");
    }, [addUserMessage]);

    const handleTranscriptionChange = useCallback((transcript: string) => {
        setText((prev) => (prev ? `${prev} ${transcript}`: transcript));
    }, []);

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }, []);

    const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setStatus("submitted");
      addUserMessage(suggestion);
    },
    [addUserMessage]
  );

    const isSubmitDisabled = useMemo(() => !(text.trim() || status) || status === "streaming", [text, status]);
    return (
        <div className="relative mx-auto flex h-dvh w-full max-w-5xl flex-col divide-y overflow-hidden">
            <Conversation className="no-scrollbar overflow-y-auto">
                <ConversationContent>
                    { messages.map(( { versions, ...message } ) => (
                        <MessageBranch defaultBranch={0} key={message.id}>
                            <MessageBranchContent>
                                { versions.map((version) => (
                                    <Message
                                        from={message.from}
                                        key={`${message.id}-${version.id}`}
                                    >
                                        <div>
                                            { message.sources?.length && (
                                                <Sources>
                                                    <SourcesTrigger count={message.sources.length} />
                                                    <SourcesContent>
                                                        { message.sources.map((source) => (
                                                            <Source
                                                                href={source.href}
                                                                key={source.href}
                                                                title={source.title}
                                                            />
                                                        ))}
                                                    </SourcesContent>
                                                </Sources>
                                            )}
                                            { message.reasoning && (
                                                <Reasoning duration={message.reasoning.duration}>
                                                    <ReasoningTrigger />
                                                    <ReasoningContent>
                                                        { message.reasoning.content }
                                                    </ReasoningContent>
                                                </Reasoning>
                                            )}
                                            <MessageContent>
                                                <MessageResponse>{version.content}</MessageResponse> 
                                            </MessageContent>
                                        </div>
                                    </Message>
                                ))}
                            </MessageBranchContent>
                            { versions.length > 1 && (
                                <MessageBranchSelector>
                                    <MessageBranchPrevious />
                                    <MessageBranchPage />
                                    <MessageBranchNext />
                                </MessageBranchSelector>
                            )}
                        </MessageBranch>
                    ))}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
            <div className="grid shrink-0 gap-4 pt-4">
               
                <div className="w-full px-4 pb-4">
                    <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                        <PromptInputHeader>
                            
                        </PromptInputHeader>
                        <PromptInputBody>
                            <PromptInputTextarea onChange={handleTextChange} value={text} />
                        </PromptInputBody>
                        <PromptInputFooter>
                            <PromptInputTools>
                                <PromptInputActionMenu>
                                    <PromptInputActionMenuTrigger />
                                    <PromptInputActionMenuContent>
                                        <PromptInputActionAddAttachments />
                                    </PromptInputActionMenuContent>
                                </PromptInputActionMenu>
                                <SpeechInput
                                    className="shrink-0"
                                    onTranscriptionChange={handleTranscriptionChange}
                                    size="icon-sm"
                                    variant="ghost"
                                />
                                <PromptInputButton

                                >
                                    <GlobeIcon size={16} />
                                    <span>Research</span>
                                </PromptInputButton>
                                { /* TODO: Reuse model selector component as a Data source selector */}
                            </PromptInputTools>
                            <PromptInputSubmit disabled={isSubmitDisabled} status={status} />
                        </PromptInputFooter>
                    </PromptInput>
                </div>
            </div>
       </div>
    )
}