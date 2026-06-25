# Backlog Bot

Telegram-бот для добавления задач в командный бэклог Яндекс Музыки.

## Как работает

1. Участник делает reply на сообщение с идеей и тегает бота (`@bot_name`)
2. Бот через Claude API формулирует задачу и определяет команду
3. Если команда не ясна — бот спрашивает через кнопки
4. Задача появляется в бэклоге со статусом «Бэклог» и `source: telegram`

## Локальный запуск

```bash
# 1. Установить зависимости
pip install -r requirements.txt

# 2. Создать .env из примера
cp .env.example .env
# Заполнить значения в .env

# 3. Запустить
python bot.py
```

## Переменные окружения

| Переменная | Где взять |
|---|---|
| `TELEGRAM_BOT_TOKEN` | @BotFather в Telegram |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role |
| `BACKLOG_URL` | Ссылка на задеплоенный фронтенд |

## Деплой на Railway

1. Запушить папку `backlog-bot` в GitHub-репозиторий
2. Зайти на [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Выбрать репозиторий
4. В Railway → Variables добавить все переменные из `.env.example`
5. Railway задеплоит автоматически

## Структура

```
bot.py             — основной файл, хендлеры Telegram
claude_parser.py   — парсинг сообщения через Claude API
supabase_client.py — запись задачи в Supabase
requirements.txt   — зависимости
railway.toml       — конфиг деплоя
```
