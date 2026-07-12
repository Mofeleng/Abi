from pydantic import BaseModel

class NewConversation(BaseModel):
    user_id: str
    chat_session_id: str