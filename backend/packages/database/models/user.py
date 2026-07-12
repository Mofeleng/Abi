from typing import List

from sqlalchemy.orm import Mapped, relationship

from fastapi_users.db import SQLAlchemyBaseUserTableUUID

from packages.database.mixins import Timestamps
from packages.database.models.base import Base


class User(SQLAlchemyBaseUserTableUUID, Base, Timestamps):
    __tablename__ = "user"

    sessions: Mapped[List["ConversationSession"]] = relationship(
        "ConversationSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )