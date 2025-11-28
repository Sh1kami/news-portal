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

## Відомі нюанси / підказки

- Якщо бачите помилку про `Event handlers cannot be passed to Client Component props`, перевірте, що компоненти з `onError`/`onLoad` мають `"use client"` і не передаються як пропс у серверні компоненти.
- Якщо є проблема з сесією `getServerSession is not defined`, переконайтеся, що у файлах, де він використовується, доданий імпорт `import { getServerSession } from 'next-auth'` та що `authOptions` правильно експортований.
- Поле `Post.categoryId` не допускає `null` — при видаленні категорії постам переназначається категорія `uncategorized`.

## Якщо потрібно — додам

- Документацію по розгортанню (Docker, Vercel)
- Опис API ендпоїнтів

---

Якщо хочеш, можу додати `README` українською/англійською з прикладами запитів або автоматизованими командами для Windows.
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
=======

Курсова робота студента: Панчишкін Богдан
