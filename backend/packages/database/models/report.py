from sqlalchemy import String, UUID, Enum, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
import enum

from .base import Base
from packages.database.mixins import Timestamps
from packages.database.enums import ReportTypeEnum

class Report(Base, Timestamps):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4())
    name: Mapped[str] = mapped_column(String, nullable=False)

    type: Mapped[enum.Enum] = mapped_column(Enum(ReportTypeEnum), nullable=False)
    layout_json: Mapped[dict] = mapped_column(JSON)

    message_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("messages.id"))
    message: Mapped["Message"] = relationship(
        "Message",
        back_populates="report"
    )