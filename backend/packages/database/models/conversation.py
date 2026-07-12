import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.database.mixins import Timestamps

from .base import Base


class Conversation(Base, Timestamps):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    thread_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4())

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id")

    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="conversations"
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversation_sessions.id"),
        unique=True,
        nullable=False,
    )

    session: Mapped["ConversationSession"] = relationship(
        "ConversationSession",
        back_populates="conversation",
    )

    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )