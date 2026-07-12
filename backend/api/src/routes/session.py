import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.dtos.new_session import NewSession

from packages.database.dependencies.get_session import get_session
from packages.database.models.conversation_session import ConversationSession

session_router = APIRouter()

@session_router.post("/create-session")
async def create_session(data: NewSession, session: AsyncSession = Depends(get_session)):
    conversation_session = ConversationSession(
        expires_at=data.expires_at,
        user_id=uuid.UUID(data.user_id),
        name="Coversation"
    )

    session.add(conversation_session)
    await session.commit()
    await session.refresh(conversation_session)

    return {
        "id": conversation_session.id
    }