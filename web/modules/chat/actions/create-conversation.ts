import { apiRequest } from "@/lib/api-request";
import { CreateConversationRequestBody, CreateConversationResponseBody } from "../dtos/conversation";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export function createConversation(payload: CreateConversationRequestBody) {
    return apiRequest<CreateConversationResponseBody>({
        url: `${BACKEND_API}/conversation/create`,
        method: "POST",
        payload
    })
}