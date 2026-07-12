from pydantic import BaseModel


class NewMessage(BaseModel):
    message: str
    thread_id: str
    conversation_id: str
    chat_session_id: str