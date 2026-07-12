import { apiRequest } from "@/lib/api-request";
import { ChatSessionRequestBody, ChatSessionResponseBody } from "../dtos/web-chat-session";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export async function createChatSession(payload: ChatSessionRequestBody) {
    return apiRequest<ChatSessionResponseBody>({
        url: `${BACKEND_API}/session/create-session`,
        method: "POST",
        payload: payload
    })
}