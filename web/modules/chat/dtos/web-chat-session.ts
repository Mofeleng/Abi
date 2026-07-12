export interface ChatSessionRequestBody {
    user_id: string;
    expires_at: string;
}

export interface ChatSessionResponseBody {
    id: string;
}