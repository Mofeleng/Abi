from langchain_fireworks import ChatFireworks
from dotenv import load_dotenv
import os

load_dotenv()

key = os.getenv("FIREWORKS_API_KEY")
model = "accounts/fireworks/models/gpt-oss-120b"

llm = ChatFireworks(
    model=model,
    api_key=key,
)
