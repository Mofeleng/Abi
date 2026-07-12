export interface CreateConversationRequestBody {
    user_id: string;
    chat_session_id: string;
}

export interface CreateConversationResponseBody {
    conversation_id: string;
}

export interface GetConversationRequestBody {
    conversation_id: string;
}

export interface GetConversationResponseBody {
    id: string;
    thread_id: string;
}