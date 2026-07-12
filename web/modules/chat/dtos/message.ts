

export interface Message {
    id: string;
    message_from: "user" | "assistant";
    content: string;
    conversation_id: string;
    report_id: string | null | undefined;
}

export interface GetMessagesRequest {
    conversation_id: string;
    page: number;
    page_size: number;
}

export interface SendMessageRequest {
    message: string;
    conversation_id: string;
    thread_id: string;
    chat_session_id: string;
}

export interface SendMessageResponse {
    response: string;
}