import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface Context {
	params: {
		id: string
	}
}

export async function GET(_request: Request, context: Context) {
	try {
		const { id } = context.params

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Користувача не знайдено' },
				{ status: 404 }
			)
		}

		return NextResponse.json(user)
	} catch (error) {
		console.error('Get user error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request, context: Context) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 })
		}

		const { id } = context.params
		const { name, role } = await request.json()

		if (!name || !role) {
			return NextResponse.json(
				{ error: 'Імʼя та роль обовʼязкові' },
				{ status: 400 }
			)
		}

		if (!['USER', 'ADMIN'].includes(role)) {
			return NextResponse.json({ error: 'Невідома роль' }, { status: 400 })
		}

		const user = await prisma.user.findUnique({ where: { id } })

		if (!user) {
			return NextResponse.json(
				{ error: 'Користувача не знайдено' },
				{ status: 404 }
			)
		}

		const updated = await prisma.user.update({
			where: { id },
			data: { name, role },
		})

		return NextResponse.json(updated)
	} catch (error) {
		console.error('Update user error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}

export async function DELETE(_request: Request, context: Context) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 })
		}

		const { id } = context.params

		const user = await prisma.user.findUnique({ where: { id } })

		if (!user) {
			return NextResponse.json(
				{ error: 'Користувача не знайдено' },
				{ status: 404 }
			)
		}

		// Remove dependent records safely
		const userPosts = await prisma.post.findMany({
			where: { authorId: id },
			select: { id: true },
		})
		const postIds = userPosts.map(p => p.id)

		await prisma.$transaction(async tx => {
			await tx.rating.deleteMany({ where: { userId: id } })
			await tx.comment.deleteMany({ where: { authorId: id } })

			if (postIds.length > 0) {
				await tx.rating.deleteMany({ where: { postId: { in: postIds } } })
				await tx.comment.deleteMany({ where: { postId: { in: postIds } } })
				await tx.post.deleteMany({ where: { id: { in: postIds } } })
			}

			await tx.user.delete({ where: { id } })
		})

		return NextResponse.json({ message: 'Користувача успішно видалено' })
	} catch (error) {
		console.error('Delete user error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
