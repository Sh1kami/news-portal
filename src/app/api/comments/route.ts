import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Необхідно увійти в систему' },
				{ status: 401 }
			)
		}

		const { postId, content } = await request.json()

		if (!postId || !content) {
			return NextResponse.json(
				{ error: 'ID новини та текст коментаря обовʼязкові' },
				{ status: 400 }
			)
		}

		// Создаем комментарий
		const comment = await prisma.comment.create({
			data: {
				content,
				authorId: session.user.id,
				postId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})

		return NextResponse.json(comment)
	} catch (error) {
		console.error('Comment creation error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
