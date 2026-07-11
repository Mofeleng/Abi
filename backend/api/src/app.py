from fastapi import FastAPI
from api.src.dtos.new_message import NewMessage
from langchain.messages import HumanMessage

from packages.agent.graph import abi_agent
from packages.database.setup import create_tables

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

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