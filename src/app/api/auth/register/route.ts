import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { name, email, password } = await request.json()

		// Валидация
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Всі поля обовʼязкові' },
				{ status: 400 }
			)
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Пароль повинен містити至少 6 символів' },
				{ status: 400 }
			)
		}

		// Проверяем существует ли пользователь
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Користувач з таким email вже існує' },
				{ status: 400 }
			)
		}

		// Хешируем пароль
		const hashedPassword = await bcrypt.hash(password, 12)

		// Создаем пользователя
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'USER',
			},
		})

		return NextResponse.json(
			{ message: 'Користувач успішно зареєстрований' },
			{ status: 201 }
		)
	} catch (error) {
		console.error('Registration error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
