import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface Context {
	params: { id: string }
}

export async function GET(_request: Request, context: Context) {
	try {
		const { id } = context.params
		const post = await prisma.post.findUnique({
			where: { id },
			include: { category: true },
		})
		if (!post)
			return NextResponse.json({ error: 'Пост не знайдено' }, { status: 404 })
		return NextResponse.json(post)
	} catch (error) {
		console.error('Get post error:', error)
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
		const { title, content, image, categoryId, published } =
			await request.json()

		if (!title || !content) {
			return NextResponse.json(
				{ error: 'Заголовок і текст обовʼязкові' },
				{ status: 400 }
			)
		}

		const updated = await prisma.post.update({
			where: { id },
			data: {
				title,
				content,
				image: image || null,
				published: !!published,
				categoryId: categoryId || null,
			},
		})

		return NextResponse.json(updated)
	} catch (error) {
		console.error('Update post error:', error)
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
		await prisma.comment.deleteMany({ where: { postId: id } })
		await prisma.rating.deleteMany({ where: { postId: id } })
		await prisma.post.delete({ where: { id } })

		return NextResponse.json({ message: 'Пост видалено' })
	} catch (error) {
		console.error('Delete post error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
