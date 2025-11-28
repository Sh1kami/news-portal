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

		const { postId, value } = await request.json()

		if (!postId || !value || value < 1 || value > 5) {
			return NextResponse.json(
				{ error: 'ID новини та значення рейтингу (1-5) обовʼязкові' },
				{ status: 400 }
			)
		}

		// Ищем существующий рейтинг
		const existingRating = await prisma.rating.findUnique({
			where: {
				userId_postId: {
					userId: session.user.id,
					postId,
				},
			},
		})

		let rating

		if (existingRating) {
			// Обновляем существующий рейтинг
			rating = await prisma.rating.update({
				where: {
					id: existingRating.id,
				},
				data: {
					value,
				},
			})
		} else {
			// Создаем новый рейтинг
			rating = await prisma.rating.create({
				data: {
					value,
					userId: session.user.id,
					postId,
				},
			})
		}

		return NextResponse.json(rating)
	} catch (error) {
		console.error('Rating creation error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
