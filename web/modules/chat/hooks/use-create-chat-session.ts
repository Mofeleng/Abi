import { useMutation } from "@tanstack/react-query";
import { createChatSession } from "../actions/create-session";

export function useCreateChatSession() {
    return useMutation({
        mutationFn: createChatSession
    })
}