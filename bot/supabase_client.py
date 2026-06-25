import os
from typing import Optional
from supabase import create_client

_client = None


def get_client():
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_KEY"]
        _client = create_client(url, key)
    return _client


def add_task(title: str, team: Optional[str], assignee: Optional[str], priority: str) -> dict:
    client = get_client()
    data = {
        "title": title,
        "team": team,
        "assignee": assignee,
        "priority": priority,
        "status": "Бэклог",
        "source": "telegram",
        "archived": False,
    }
    response = client.table("tasks").insert(data).execute()
    return response.data[0]
