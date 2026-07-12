import { apiRequest } from "@/lib/api-request";
import { GetPaginatedResponse } from "../dtos/paginated_response";
import { GetMessagesRequest, Message } from "../dtos/message";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export function getMessages(payload: GetMessagesRequest) {
    return apiRequest<GetPaginatedResponse<Message>>({
        url: `${BACKEND_API}/message/get-many`,
        method: "GET",
        params: {
            ...payload
        }
    })
}