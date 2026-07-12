import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.dtos.new_conversation import NewConversation
from api.src.dtos.get_conversation import GetConversation

from packages.database.dependencies.get_session import get_session
from packages.database.models.conversation_session import ConversationSession
from packages.database.models.conversation import Conversation

conversations_router = APIRouter()

@conversations_router.post("/create")
async def create_conversation(data: NewConversation, session: AsyncSession = Depends(get_session)):
    chat_session = await session.get(ConversationSession, uuid.UUID(data.chat_session_id))

    if chat_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session does not exist"
        )
    
    conversation = Conversation(
        user_id=uuid.UUID(data.user_id),
        session_id=uuid.UUID(data.chat_session_id)
    )

    session.add(conversation)
    await session.commit()
    await session.refresh(conversation)

    return {
        "conversation_id": conversation.id,
    }

@conversations_router.post("/get-one")
async def get_one_conversation(data: GetConversation, session: AsyncSession = Depends(get_session)):
    conversation = await session.get(Conversation, uuid.UUID(data.conversation_id))

    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return {
        "id": conversation.id,
        "thread_id": conversation.thread_id
    }
