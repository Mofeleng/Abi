import { apiRequest } from "@/lib/api-request";
import { GetConversationRequestBody, GetConversationResponseBody } from "../dtos/conversation";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export function getConversation(payload: GetConversationRequestBody) {
    return apiRequest<GetConversationResponseBody>({
        url: `${BACKEND_API}/conversation/get-one`,
        method: "POST",
        payload
    })
}