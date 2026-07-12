import { useMutation } from "@tanstack/react-query";
import { createConversation } from "../actions/create-conversation";

export function useCreateConversation() {
    return useMutation({
        mutationFn: createConversation
    })
}