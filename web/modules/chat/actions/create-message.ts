import { apiRequest } from "@/lib/api-request";
import { SendMessageRequest, SendMessageResponse } from "../dtos/message";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export function createMessage(payload: SendMessageRequest) {
    return apiRequest<SendMessageResponse>({
        url: `${BACKEND_API}/message/new-message`,
        method: "POST",
        payload
    })
}