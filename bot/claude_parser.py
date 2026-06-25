import anthropic

TEAM_MEMBERS = {
    "Лиза": "Маркетинг",
    "Оля": "Маркетинг",
    "Диана": "Гроус",
    "Вася": "Продукт",
    "Женя": "CRM",
    "Руслан": "CRM",
    "Ксюша": None,  # лид, команда не привязана
}

TEAM_KEYWORDS = {
    "Маркетинг": ["маркетинг", "контент", "креатив", "баннер", "рассылка", "промо", "кампания"],
    "Гроус": ["гроус", "growth", "метрики", "конверсия", "ретеншн", "активация", "воронка"],
    "CRM": ["crm", "пуш", "push", "email", "нотификация", "сегмент", "триггер"],
    "Продукт": ["продукт", "фича", "feature", "флоу", "flow", "ux", "интерфейс", "экран"],
}

client = anthropic.Anthropic()


def parse_message(original_message: str, reply_message: str) -> dict:
    """
    Анализирует сообщение из Telegram и возвращает структурированную задачу.
    original_message — то сообщение, на которое ответили
    reply_message — текст reply (может быть пустым, если бота тегнули без reply)
    """
    text = reply_message or original_message

    prompt = f"""Ты помощник, который создаёт задачи для командного бэклога.

Участник команды Яндекс Музыки написал в чат:
"{text}"

Твоя задача:
1. Сформулируй название задачи чётко и кратко (до 80 символов). Начни с глагола.
2. Определи assignee если в тексте упоминается одно из имён: Лиза, Оля, Диана, Вася, Женя, Руслан, Ксюша.
3. Определи команду (Маркетинг / Гроус / CRM / Продукт) по контексту. Если не можешь — верни null.
4. Определи приоритет (Высокий / Средний / Низкий). По умолчанию — Средний.

Верни JSON и только JSON, без пояснений:
{{
  "title": "...",
  "assignee": "имя или null",
  "team": "команда или null",
  "priority": "Высокий | Средний | Низкий"
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    raw = message.content[0].text.strip()
    # убираем markdown-обёртку если модель добавила
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    result = json.loads(raw.strip())

    # если assignee известен — проставляем команду из справочника
    assignee = result.get("assignee")
    if assignee and assignee in TEAM_MEMBERS and result.get("team") is None:
        result["team"] = TEAM_MEMBERS[assignee]

    return result
