import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface Context {
	params: {
		id: string
	}
}

export async function PUT(request: Request, context: Context) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Необхідно увійти в систему' },
				{ status: 401 }
			)
		}

		const { id } = context.params
		const { content } = await request.json()

		if (!content) {
			return NextResponse.json(
				{ error: 'Текст коментаря обовʼязковий' },
				{ status: 400 }
			)
		}

		// Проверяем, принадлежит ли комментарий пользователю
		const comment = await prisma.comment.findUnique({
			where: { id },
			include: { author: true },
		})

		if (!comment) {
			return NextResponse.json(
				{ error: 'Коментар не знайдено' },
				{ status: 404 }
			)
		}

		// Allow the author or an ADMIN to edit
		if (comment.authorId !== session.user.id && session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Недостатньо прав для редагування цього коментаря' },
				{ status: 403 }
			)
		}

		// Обновляем комментарий
		const updatedComment = await prisma.comment.update({
			where: { id },
			data: {
				content,
			},
			include: {
				author: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		})

		return NextResponse.json(updatedComment)
	} catch (error) {
		console.error('Comment update error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}

export async function DELETE(request: Request, context: Context) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Необхідно увійти в систему' },
				{ status: 401 }
			)
		}

		const { id } = context.params

		// Проверяем, принадлежит ли комментарий пользователю
		const comment = await prisma.comment.findUnique({
			where: { id },
			include: { author: true },
		})

		if (!comment) {
			return NextResponse.json(
				{ error: 'Коментар не знайдено' },
				{ status: 404 }
			)
		}

		// Allow the author or an ADMIN to delete
		if (comment.authorId !== session.user.id && session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ error: 'Недостатньо прав для видалення цього коментаря' },
				{ status: 403 }
			)
		}

		// Удаляем комментарий
		await prisma.comment.delete({
			where: { id },
		})

		return NextResponse.json({ message: 'Коментар успішно видалено' })
	} catch (error) {
		console.error('Comment deletion error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
