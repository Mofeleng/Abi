import uvicorn
import sys
import asyncio

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

if __name__ == "__main__":
    uvicorn.run("api.src.app:app", host="0.0.0.0", port=5000, log_level="info", reload=True)