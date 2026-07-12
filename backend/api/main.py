import uvicorn
import sys
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    uvicorn.run("api.src.app:app", host="0.0.0.0", port=port, log_level="info", reload=True)