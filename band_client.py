"""
band_client.py — lightweight wrapper around the Thenvoi/Band REST SDK.

Each Abby agent (Abi Data, Abi Convert, Abi Design, Abi Present) has its own
Band agent identity (token + id). This module lets each one post a status
message into the shared Band chat room as it completes work.
"""

import os
from dotenv import load_dotenv
from thenvoi_rest import RestClient, ChatMessageRequest, ChatMessageRequestMentionsItem

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

BAND_REST_URL = os.getenv("BAND_REST_URL", "https://app.band.ai")
BAND_CHAT_ID = os.getenv("BAND_CHAT_ID")

# Per-agent credentials
AGENT_CREDS = {
    "abi_data": {
        "token": os.getenv("TOKEN_ABI_DATA"),
        "id": os.getenv("ID_ABI_DATA"),
    },
    "abi_convert": {
        "token": os.getenv("TOKEN_ABI_CONVERT"),
        "id": os.getenv("ID_ABI_CONVERT"),
    },
    "abi_design": {
        "token": os.getenv("TOKEN_ABI_DESIGN"),
        "id": os.getenv("ID_ABI_DESIGN"),
    },
    "abi_present": {
        "token": os.getenv("TOKEN_ABI_PRESENT"),
        "id": os.getenv("ID_ABI_PRESENT"),
    },
}

_clients = {}


def _get_client(agent_name: str):
    if agent_name not in _clients:
        token = AGENT_CREDS[agent_name]["token"]
        if not token:
            return None
        _clients[agent_name] = RestClient(api_key=token, base_url=BAND_REST_URL)
    return _clients[agent_name]


def post_to_band(content: str, agent_name: str):
    """
    Posts a status message to the shared Band room AS the given agent.
    agent_name must be one of: abi_data, abi_convert, abi_design, abi_present
    """
    creds = AGENT_CREDS.get(agent_name)
    if not creds or not creds["token"] or not creds["id"]:
        print(f"[Band] Skipped ({agent_name} not configured): {content}")
        return None

    if not BAND_CHAT_ID:
        print(f"[Band] Skipped (no BAND_CHAT_ID configured): {content}")
        return None

    client = _get_client(agent_name)
    if not client:
        print(f"[Band] Skipped (no client for {agent_name}): {content}")
        return None

    try:
        mention_items = [ChatMessageRequestMentionsItem(id=creds["id"])]
        result = client.agent_api_messages.create_agent_chat_message(
            chat_id=BAND_CHAT_ID,
            message=ChatMessageRequest(
                content=content,
                mentions=mention_items,
            ),
        )
        print(f"[Band] {agent_name} posted: {content[:60]}...")
        return result
    except Exception as e:
        print(f"[Band] {agent_name} failed to post (continuing pipeline): {e}")
        return None