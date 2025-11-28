import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 })
		}

		const { title, content, image, categoryId, published } =
			await request.json()

		if (!title || !content) {
			return NextResponse.json(
				{ error: 'Заголовок і текст обовʼязкові' },
				{ status: 400 }
			)
		}

		const post = await prisma.post.create({
			data: {
				title,
				content,
				image: image || undefined,
				published: !!published,
				category: categoryId ? { connect: { id: categoryId } } : undefined,
				author: { connect: { id: session.user.id } },
			},
		})

		return NextResponse.json(post)
	} catch (error) {
		console.error('Create post error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
