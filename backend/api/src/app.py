from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.src.routes.session import session_router
from api.src.routes.conversation import conversations_router
from api.src.routes.message import messages_router

from api.src.dtos.new_message import NewMessage
from api.src.dtos.new_session import NewSession

from api.src.dtos.user.create import UserCreate
from api.src.dtos.user.read import UserRead
from api.src.dtos.user.update import UserUpdate

from langchain.messages import HumanMessage

from packages.agent.graph import abi_agent
from packages.database.setup import create_tables
from packages.database.models.conversation_session import ConversationSession

from packages.database.users import auth_backend, current_active_user, fast_api_users


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://abi-blond.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(fast_api_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router(fast_api_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"])
app.include_router(fast_api_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router(fast_api_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
app.include_router(fast_api_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])

app.include_router(session_router, prefix="/api/session", tags=["session"])
app.include_router(conversations_router, prefix="/api/conversation", tags=["conversation"])
app.include_router(messages_router, prefix="/api/message", tags=["message"])

"""
@app.post("/api/message")
def message_abi(data: NewMessage):
    res = abi_agent.invoke({
        "messages": HumanMessage(data.message)
    }, 
    config={
        "configurable": {
            "thread_id": data.thread_id
        }
    })

    return res["messages"][-1].content
"""