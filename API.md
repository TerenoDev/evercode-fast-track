# API Documentation

Базовый URL: `http://localhost:3000`

Все эндпоинты, кроме `/health`, требуют аутентификации через Bearer Token.

**Заголовок авторизации:**
```bash
Authorization: Bearer <API_KEY>
```

**Тестовый API-ключ:** `test-api-key-123`
(создается скриптом `npm run seed`)

---

## 1. Health Check
### `GET /health`

Проверка работоспособности сервера. Не требует авторизации.

**Ответ `200 OK`:**
```json
{
  "status": "ok"
}
```
## 2. Получить список отслеживаемых монет
### `GET /api/coins`
Возвращает массив всех монет, добавленных в отслеживание.

**Заголовки:**
```bash
Authorization: Bearer test-api-key-123
```
**Ответ `200 OK`:**

```json
[
  {
    "id": 1,
    "symbol": "BTC",
    "added_at": "2026-10-12 08:00:00"
  },
  {
    "id": 2,
    "symbol": "ETH",
    "added_at": "2026-10-12 08:01:00"
  }
]
```
**Ошибки:**
- 401 Unauthorized - отсутствует или неверный токен.
## 3. Добавить монету в отслеживание
### `POST /api/coins`

**Заголовки:**
```bash
Authorization: Bearer test-api-key-123
Content-Type: application/json
```
**Тело запроса:**
```json
{
  "symbol": "BTC"
}
```
**Правила валидации:**

- symbol - строка от 2 до 10 символов;
- приводится к верхнему регистру автоматически.

**Ответ `201 Created`:** 
```json
{
  "id": 1,
  "symbol": "BTC",
  "message": "Coin added successfully"
}
```
**Ошибки:**
- 400 Bad Request - невалидные данные (например, symbol короче 2 символов);
- 401 Unauthorized - отсутствует или неверный токен;
- 409 Conflict - монета уже отслеживается.
## 4. Удалить монету из отслеживания
### `DELETE /api/coins/:id`
**Параметры пути:**
- id (integer) - ID монеты.

**Заголовки:**
```bash
Authorization: Bearer test-api-key-123
```
**Ответ `204 No Content`** - монета удалена (тело ответа пустое).

**Ошибки:**
- 400 Bad Request - невалидный ID (не число);
- 401 Unauthorized - отсутствует или неверный токен;
- 404 Not Found - монета с таким ID не найдена.
## 5. Получить текущую цену монеты
### `GET /api/coins/:symbol/price`
Запрашивает актуальную цену у CoinMarketCap API и сохраняет её в историю.
**Параметры пути:**
- symbol (string) - символ монеты (например, BTC).

**Заголовки:**
```bash
Authorization: Bearer test-api-key-123
```
**Ответ `200 OK`:**
```json
{
  "symbol": "BTC",
  "price": 83768.29
}
```

**Ошибки:**
- 401 Unauthorized - отсутствует или неверный токен;
- 404 Not Found - монета не отслеживается;
- 502 Bad Gateway - ошибка внешнего API CoinMarketCap (недоступен, таймаут, неверный ключ).
## 6. Получить историю цен монеты
### `GET /api/coins/:symbol/history
Возвращает историю цен из базы данных (от новых к старым).

**Параметры пути:**
- symbol (string) - символ монеты (например, BTC).

**Заголовки:**
```bash
Authorization: Bearer test-api-key-123
```
**Ответ `200 OK`:**
```json
{
  "symbol": "BTC",
  "history": [
    {
      "id": 5,
      "coin_id": 1,
      "price": 83768.29,
      "timestamp": "2026-10-12 08:15:00"
    },
    {
      "id": 4,
      "coin_id": 1,
      "price": 83600.00,
      "timestamp": "2026-10-12 08:10:00"
    }
  ]
}
```

**Ошибки:**
- 401 Unauthorized - отсутствует или неверный токен;
- 404 Not Found - монета не отслеживается.
## Коды ошибок (общие)
Все ошибки возвращаются в едином формате:
```json
{
  "error": "Описание ошибки"
}
```
| Код  | Значение |
| ------------- | ------------- |
| 400  | Bad Request - невалидные данные  |
| 401  | Unauthorized - проблема с токеном  |
| 404  | Not Found - ресурс не найден  |
| 409  | Conflict - конфликт (дубликат)  |
| 500  | Internal Server Error - ошибка сервера  |
| 502  | Bad Gateway - ошибка внешнего API  |
## Swagger UI
Интерактивная документация доступна после запуска сервера:
```bash
http://localhost:3000/api-docs
```
Там можно:
- посмотреть все эндпоинты;
- нажать "Authorize" и ввести test-api-key-123;
- отправить тестовый запрос прямо из браузера.
