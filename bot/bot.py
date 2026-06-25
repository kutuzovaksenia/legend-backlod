import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
)
from claude_parser import parse_message
from supabase_client import add_task

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BACKLOG_URL = os.environ.get("BACKLOG_URL", "")

TEAMS = ["Маркетинг", "Гроус", "CRM", "Продукт"]

# Временное хранилище пока пользователь выбирает команду
# { callback_query_message_id: {title, assignee, priority} }
pending_tasks: dict[int, dict] = {}


async def handle_mention(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message
    if message is None:
        return

    # Бот должен быть упомянут
    bot_username = (await context.bot.get_me()).username
    mentioned = any(
        entity.type == "mention" and
        message.text[entity.offset:entity.offset + entity.length] == f"@{bot_username}"
        for entity in (message.entities or [])
    )
    if not mentioned:
        return

    # Берём текст reply или само сообщение
    original_text = ""
    if message.reply_to_message and message.reply_to_message.text:
        original_text = message.reply_to_message.text
    reply_text = message.text or ""

    if not original_text and not reply_text:
        await message.reply_text("Перешли сообщение с задачей и тегни меня.")
        return

    try:
        parsed = parse_message(original_text, reply_text)
    except Exception as e:
        logger.error("Ошибка парсинга: %s", e)
        await message.reply_text("Не смог разобрать сообщение, попробуй ещё раз.")
        return

    title = parsed.get("title", "")
    team = parsed.get("team")
    assignee = parsed.get("assignee")
    priority = parsed.get("priority", "Средний")

    if team:
        # Команда определена — сразу добавляем задачу
        await _create_and_confirm(message, title, team, assignee, priority)
    else:
        # Просим выбрать команду
        keyboard = [[InlineKeyboardButton(t, callback_data=f"team:{t}")] for t in TEAMS]
        sent = await message.reply_text(
            f'Задача: *{title}*\n\nКакой команде?',
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )
        pending_tasks[sent.message_id] = {
            "title": title,
            "assignee": assignee,
            "priority": priority,
        }


async def handle_team_choice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if not query.data.startswith("team:"):
        return

    team = query.data[len("team:"):]
    msg_id = query.message.message_id
    task_data = pending_tasks.pop(msg_id, None)

    if task_data is None:
        await query.edit_message_text("Задача уже была добавлена или истекло время.")
        return

    await _create_and_confirm(
        query.message,
        task_data["title"],
        team,
        task_data["assignee"],
        task_data["priority"],
        edit=True,
    )


async def _create_and_confirm(message, title, team, assignee, priority, edit=False):
    try:
        add_task(title=title, team=team, assignee=assignee, priority=priority)
    except Exception as e:
        logger.error("Ошибка записи в Supabase: %s", e)
        text = "Не смог добавить задачу в бэклог, что-то пошло не так."
        if edit:
            await message.edit_text(text)
        else:
            await message.reply_text(text)
        return

    assignee_part = f" → {assignee}" if assignee else ""
    link_part = f"\n{BACKLOG_URL}" if BACKLOG_URL else ""
    text = f"✅ Задача добавлена: *{title}*\nКоманда: {team}{assignee_part}{link_part}"

    if edit:
        await message.edit_text(text, parse_mode="Markdown")
    else:
        await message.reply_text(text, parse_mode="Markdown")


def main():
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    app = ApplicationBuilder().token(token).build()

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_mention))
    app.add_handler(CallbackQueryHandler(handle_team_choice))

    logger.info("Бот запущен")
    app.run_polling()


if __name__ == "__main__":
    main()
