import math
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from langchain.messages import HumanMessage

from api.src.dtos.new_message import NewMessage

from packages.database.dependencies.get_session import get_session
from packages.database.models.message import Message
from packages.database.enums import MessageParticipantEnum

from packages.agent.graph import abi_agent

messages_router = APIRouter()

@messages_router.post("/new-message")
async def new_message(data: NewMessage, session: AsyncSession = Depends(get_session)):
    user_message = Message(
        message_from=MessageParticipantEnum.USER,
        content=data.message,
        conversation_id=data.conversation_id
    )

    res = abi_agent.invoke({
        "messages": [HumanMessage(data.message)],
    }, 
    config={
        "configurable": {
            "thread_id": data.thread_id
        }
    })

    ai_message = Message(
        message_from=MessageParticipantEnum.ASSISTANT,
        content=res["messages"][-1].content,
        conversation_id=data.conversation_id
    )

    session.add(user_message)
    await session.commit()

    session.add(ai_message)
    await session.commit()

    return {"response": res["messages"][-1].content }

@messages_router.get("/get-many")
async def get_many(
    conversation_id: str,
    page: int = 1,
    page_size: int = 20,
    session: AsyncSession = Depends(get_session)
):
    offset = (page - 1) * page_size
    total = await session.scalar(
        select(
            func.count()
        )
        .select_from(Message)
        .where(Message.conversation_id == uuid.UUID(conversation_id))
    )

    messages = (
        await session.scalars(
            select(Message)
            .where(Message.conversation_id == uuid.UUID(conversation_id))
            .order_by(Message.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
    ).all()

    return {
        "items": messages,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": math.ceil(total/page_size),
        "has_previous": page > 1
    }