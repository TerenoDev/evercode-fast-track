# Crypto Tracker API

Backend-сервис для отслеживания и агрегации курсов криптовалют с использованием публичного API CoinMarketCap. Сервис предоставляет REST API для управления списком отслеживаемых монет, получения актуальных и исторических цен, а также выполняет фоновые задачи по синхронизации данных.

## Стек технологий

- **Node.js** 18+
- **TypeScript**
- **Express.js** — веб-фреймворк
- **SQLite** — встраиваемая реляционная БД (raw SQL, **без ORM**)
- **Axios** — HTTP-клиент для работы с внешним API
- **Zod** — валидация входных данных
- **Jest + Supertest** — E2E-тестирование
- **Swagger (OpenAPI 3.0)** — документация API
- **Docker + docker-compose** — контейнеризация

## Требования

- Node.js 18 или выше
- npm или yarn
- Docker (опционально, для запуска в контейнере)
- API-ключ CoinMarketCap (получить можно на [coinmarketcap.com/api](https://coinmarketcap.com/api/))

## Установка и запуск

### Локальный запуск

1. **Клонируй репозиторий:**
   ```bash
   git clone https://github.com/TerenoDev/fast-track.git
   cd fast-track
   ```
2. **Установи зависимости:**
   ```bash
   npm install
   ```
3. **Создай файл .env в корне проекта:**
   ```bash
   PORT=3000
   CMC_API_KEY=твой_ключ_coinmarketcap
   ```
4. **Создай тестовый API-ключ для аутентификации:**
   ```bash
   npx ts-node scripts/seed.ts
   ```
5. **Запусти сервер:**
   ```bash
   npm start
   ```
6. **Открой Swagger-документацию:**
   ```bash
   http://localhost:3000/api-docs
   ```
### Запуск через Docker
1. **Убедись, что Docker Desktop запущен.**
2. **Создай файл .env с ключом CMC_API_KEY (см. выше).**
3. **Запусти:**
    ```bash
    docker-compose up --build
    ```
4. **Открой Swagger-документацию:**
    ```bash
    http://localhost:3000/api-docs
    ```
### Тестирование
1. **Тесты используют базу данных в памяти (:memory:), что изолирует их от рабочей БД. Покрыты все эндпоинты (позитивные и негативные сценарии), обработка ошибок аутентификации, валидации и внешнего API:**
    ```bash
    npm test
    ```
### Аутентификация
1. **Тестовый ключ: test-api-key-123. Все эндпоинты /api/coins/ требуют заголовок:**
    ```bash
    Authorization: Bearer <API_KEY>
    ```
### Примеры запросов
Добавить монету:
   ```bash
   curl -X POST http://localhost:3000/api/coins \
     -H "Authorization: Bearer test-api-key-123" \
     -H "Content-Type: application/json" \
     -d '{"symbol": "BTC"}'
   ```
Получить текущую цену:
   ```bash
   curl http://localhost:3000/api/coins/BTC/price \
      -H "Authorization: Bearer test-api-key-123"
   ```
### Фоновые задачи
Сервис использует TaskScheduler для автоматического обновления цен всех отслеживаемых монет каждые 5 минут. Обновление происходит через CoinMarketCap API, результаты сохраняются в таблицу price_history.
### Graceful Shutdown
При получении сигналов SIGINT (Ctrl+C) или SIGTERM сервис корректно завершает работу:
1. **Останавливает фоновый планировщик (clearInterval).**
2. **Закрывает HTTP-сервер (перестает принимать новые запросы).**
3. **Закрывает соединение с базой данных SQLite.**
### Структура проекта
    ```bash
      fast-track
      ├── Dockerfile
      ├── docker-compose.yml
      ├── jest.config.js
      ├── package.json
      ├── src
      │   ├── app.ts
      │   ├── controllers
      │   │   └── coin.controller.ts
      │   ├── db
      │   │   ├── index.ts
      │   │   └── schema.sql
      │   ├── index.ts
      │   ├── middlewares
      │   │   └── auth.middleware.ts
      │   ├── repositories
      │   │   └── coin.repository.ts
      │   ├── routes
      │   │   └── coin.routes.ts
      │   ├── services
      │   │   ├── coinmarketcap.service.ts
      │   │   └── scheduler.service.ts
      │   ├── swagger.ts
      │   ├── tests
      │   │   ├── coins.test.ts
      │   │   ├── price.test.ts
      │   │   └── setup.ts
      │   └── types
      │       ├── coin.types.ts
      │       └── errors.ts
      └── tsconfig.json
      ```
### Обработка ошибок
1. **Все входные данные проходят валидацию через Zod.**
2. **Внешние запросы к CoinMarketCap имеют таймаут 5 секунд и обработку ошибок.**
3. **Кастомный класс ExternalApiError для ошибок внешнего API (возвращает 502 Bad Gateway).**
4. **Все SQL-запросы параметризованы (защита от SQL-инъекций).**
## Лицензия
Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для подробностей.
