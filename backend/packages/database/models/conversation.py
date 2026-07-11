from typing import List
from sqlalchemy import String, ForeignKey, UUID, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
from datetime import datetime

from .base import Base
from packages.database.mixins import Timestamps

class Conversation(Base, Timestamps):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4())

    conversation_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversation_sessions.id"))
    conversation_session: Mapped["ConversationSession"] = relationship(
        "ConversationSession",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )

    messages: Mapped[List["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )
    
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)