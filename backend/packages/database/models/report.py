import enum
import uuid

from sqlalchemy import Enum, JSON, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.database.enums import ReportTypeEnum
from packages.database.mixins import Timestamps

from .base import Base


class Report(Base, Timestamps):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    type: Mapped[enum.Enum] = mapped_column(
        Enum(ReportTypeEnum),
        nullable=False,
    )

    layout_json: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    message: Mapped["Message"] = relationship(
        "Message",
        back_populates="report",
        uselist=False,
    )