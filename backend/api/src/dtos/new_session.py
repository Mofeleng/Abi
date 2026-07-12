from pydantic import BaseModel
from datetime import datetime

class NewSession(BaseModel):
    user_id: str
    expires_at: datetime