# Cosmorum  

Серверна частина системи для збору, обробки та поширення астрономічних спостережень.

## Опис системи

Cosmorum – це платорма для збору, обробки та поширення астрономічних спостережень, яка відкриває нові можливості в галузі популяризації науки, збереження астрономічних спостережень і розвитку цифрової астрономічної спільноти. Вона орієнтована на аматорських астрономів, студентів, а також усіх, хто цікавиться астрономією, але не має доступу до складних наукових інструментів. 

## Технології

-	FastAPI – фреймворк для створення асинхронного REST API на Python
-	React – клієнтський інтерфейс з кастомним дизайном (TailwindCSS)
-	MongoDB – гнучка нереляційна база даних
-	Pydantic – валідація та серіалізація даних на бекенді
-	Uvicorn – ASGI-сервер для розгортання FastAPI
-	Motor – асинхронна робота з MongoDB

## Передумови

Перед запуском необхідно переконатися, що встановлені:
- **Python 3.10+**
- **MongoDB** (локально або Atlas)
- **Uvicorn** (для запуску сервера)
- **Git** (для клонування)
- **SendGrid API Key** (для надсилання email)
- **Astrometry.net API Key** (опційно, для аналізу фото)
- (Опціонально) **Docker**

## Розгортання

```bash
git clone https://github.com/NureShevchenkoOlesia/apz-pzpi-22-8-shevchenko-olesia/tree/53669c18ac15bacbbf1695a691dea7f950500468/Lab5/pzpi-22-8-shevchenko-olesia-lab5/Server 
cd COSMORUM

python -m venv venv
source venv/bin/activate

//Встановлення залежностей
pip install -r requirements.txt

//Створення .env
cp .env.example .env

//Актуалізація .env
SENDGRID_API_KEY=...
EMAIL_FROM=olesia.shevchenko245@gmail.com
FRONTEND_URL=http://localhost:5173
MOBILE_URL=http://localhost:8080

//Запуск сервера
uvicorn main:app --reload
```

## Основні функції API

Реєстрація користувача:	/auth/register	POST
Логін та отримання токена:	/auth/login	POST
Скидання пароля:	/auth/request-password-reset	POST
Створення/редагування профілю:	/users/me	GET/PUT
Завантаження астроспостереження:	/observations/	POST
Публікація подій:	/events/	POST
Отримання подій за фільтрами:	/events/search	GET
Нагадування про події (через SendGrid):	автоматично	

## Структура серверної частини

backend/
│
├── main.py               # Точка входу FastAPI
├── .env.example          # Приклад змінних середовища
├── requirements.txt      # Залежності Python
│
├── app/
│   ├── routes/           # Ендпоінти (автентифікація, користувачі, події тощо)
│   ├── models/           # Pydantic-моделі (DTO)
│   ├── db/               # Підключення до MongoDB (motor)
│   ├── services/         # Бізнес-логіка (email, обробка фото)
│   └── utils/            # Допоміжні утиліти


## Безпека

- JWT авторизація: захищені ендпоінти вимагають передачі Bearer Token.
- Хешування паролів: bcrypt + salt
- Email-підтвердження та скидання пароля через SendGrid
- CORS-захист: дозволяє тільки обрані домени (налаштовується)
- Валідація даних: всі вхідні запити перевіряються через Pydantic
- Обмеження доступу: до приватних спостережень/дій доступ мають лише автентифіковані користувачі
