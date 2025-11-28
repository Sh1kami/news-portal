# News Portal — README

Коротко про проєкт, інструкції запуску та де що лежить.

## Застосовано технології

- Застосунок для програмування: **VS Code**
- Основа: **Next.js** (App Router, серверні й клієнтські компоненти)
- База данних: **PostgreSQL** + **Prisma ORM**
- Основна мова: **TypeScript**
- Стилі: **Tailwind CSS**
- Auth: **NextAuth.js**
- Іконки: **Lucide React**

## Швидкий старт (локально)

1. Встановіть залежності:

```
npm install
```

2. Створіть `.env` (приклад в `.env.example` якщо є) і вкажіть `DATABASE_URL`.
3. Ініціалізуйте базу даних (Prisma):

```
npx prisma migrate dev --name init
npx prisma db seed
```

4. Запустіть dev‑сервер:

```
npm run dev
```

Примітка (Windows PowerShell): використовуйте звичайні команди PowerShell, наприклад `npm run dev`.

## Корисні скрипти (в `package.json`)

- `dev` — запуск в режимі розробки
- `build` — збірка проєкту
- `start` — запуск production
- `seed` — наповнення БД прикладними даними

## Де що лежить (коротко)

- `src/app` — сторінки (App Router) та API маршрути підпапкою `api`.
- `src/components` — UI компоненти (коментарі, admin tables, layout тощо).
- `src/lib` — Prisma client та помічники (auth helpers).
- `prisma/schema.prisma` — структура бази даних.
- `public/` — статичні файли.
- `src/app/api/*` — серверні API (comments, admin endpoints тощо).

## Адмінка

- Панель: `/admin` (треба залогінитись як ADMIN). Якщо seed створює ADMIN, дані в `prisma/seed.ts`.

Курсова робота студента: Панчишкін Богдан
