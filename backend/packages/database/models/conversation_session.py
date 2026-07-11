from sqlalchemy import String, ForeignKey, UUID, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
from datetime import datetime

from .base import Base
from packages.database.mixins import Timestamps

class ConversationSession(Base, Timestamps):
    __tablename__ = "conversation_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4())
    name: Mapped[str] = mapped_column(String, nullable=False)
    
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)