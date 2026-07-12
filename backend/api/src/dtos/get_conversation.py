from pydantic import BaseModel

class GetConversation(BaseModel):
    conversation_id: str