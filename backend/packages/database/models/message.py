import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.database.enums import MessageParticipantEnum
from packages.database.mixins import Timestamps

from .base import Base


class Message(Base, Timestamps):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    message_from: Mapped[enum.Enum] = mapped_column(
        Enum(MessageParticipantEnum),
        nullable=False,
        default=MessageParticipantEnum.USER,
    )

    content: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id"),
        nullable=False,
    )

    conversation: Mapped["Conversation"] = relationship(
        "Conversation",
        back_populates="messages",
    )

    report_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reports.id"),
        unique=True,
        nullable=True,
    )

    report: Mapped["Report | None"] = relationship(
        "Report",
        back_populates="message",
        uselist=False,
    )