import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.database.mixins import Timestamps

from .base import Base


class ConversationSession(Base, Timestamps):
    __tablename__ = "conversation_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id"),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="sessions",
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    conversation: Mapped["Conversation"] = relationship(
        "Conversation",
        back_populates="session",
        uselist=False,
        cascade="all, delete-orphan",
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )