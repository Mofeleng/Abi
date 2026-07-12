import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "../actions/create-message";

export function useSendMessage() {
    return useMutation({
        mutationFn: createMessage
    })
}