import { chatSessionAtomFamily, errorMessageAtom, loadingMessageAtom, screenAtom, userIdAtom } from "@/modules/chat/atoms/chat-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useCreateChatSession } from "../../hooks/use-create-chat-session";
import { LoaderIcon } from "lucide-react";

interface Props {
    user_id: string | null;
}

type InitStep = "storage" | "user" | "settings" | "session" | "done";

export function ChatLoadingScreen({ user_id }:Props) {
    const [ step, setStep ] = useState<InitStep>("user");
    const [ sessionId, setSessionId ] = useState<boolean>();
    const [ sessionValid, setSessionValid ] = useState<boolean>();

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const chatSessionId = useAtomValue(chatSessionAtomFamily(user_id || ""));

    const setUserId = useSetAtom(userIdAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setScreen = useSetAtom(screenAtom);
    const setChatSessionId = useSetAtom(chatSessionAtomFamily(user_id || ""))
    // Todo: validate user and session
    const { mutateAsync: createChatSession } = useCreateChatSession();
    useEffect(() => {
        if (step != "user") return;
        
        setLoadingMessage("Configuring chat");
        if (!user_id) {
            setErrorMessage("User ID is required");
            setScreen("error");
            return;
        }

        setUserId(user_id);
        setStep("session");
    }, [
        step,
        user_id,
        setLoadingMessage,
        setUserId,
        setStep,
        setErrorMessage
    ]);

    useEffect(() => {
        if (step !== "session") return;

        setLoadingMessage("Finding chat session...");
        if (!chatSessionId) {
            setSessionValid(false);
            setStep("done");
            return;
        }

        setStep("done");
        setSessionValid(true);
    }, [
        step,
        chatSessionId,
        setSessionValid,
        setStep
    ]);

    useEffect(() => {
        if (step !== "done") return;
        const validateSession = async () => {
            const hasValidSession = chatSessionId && sessionValid;
            if (!sessionValid && user_id) {
                try {
                    const now = Date.now();
                    const dateInMs = now +  (24 * 60 * 60 * 1000);

                    const chatSession = await createChatSession({
                        user_id: user_id,
                        expires_at: new Date(dateInMs).toISOString()
                    });

                    setChatSessionId(chatSession.id);
                } catch (error) {
                    console.log((error as Error).message)
                }
            }
        }

        validateSession()
        setScreen("selection");
    })

    return (
        <>
            <div className="flex flex-1 flex-col text-muted-foreground items-center justify-center gap-y-4 p-4">
                <LoaderIcon className="animate-spin" />
                { loadingMessage || "Loading..."}
            </div>
        </>
    )

}