from sqlalchemy import String, ForeignKey, UUID, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
import enum
from datetime import datetime

from .base import Base
from packages.database.mixins import Timestamps
from packages.database.enums import MessageParticipantEnum

class Message(Base, Timestamps):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4())

    message_from: Mapped[enum.Enum] = mapped_column(Enum(MessageParticipantEnum), nullable=False, default=MessageParticipantEnum.USER)
    content: Mapped[str] = mapped_column(String, nullable=False)

    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("reports.id"))
    report: Mapped["Report"] = relationship(
        "Report",
        back_populates="message",
        cascade="all, delete-orphan"
    )
    
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversation_sessions.id"))
    conversation: Mapped["Conversation"] = relationship(
        "ConversationSession",
        back_populates="conversation"
    )
    