from pydantic import BaseModel


class NewMessage(BaseModel):
    message: str
    thread_id: str