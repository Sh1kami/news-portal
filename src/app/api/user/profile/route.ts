import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Необхідно увійти в систему' },
				{ status: 401 }
			)
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				bio: true,
				bannerColor: true,
				createdAt: true,
				role: true,
				_count: {
					select: {
						posts: true,
						comments: true,
					},
				},
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
		console.error('Profile fetch error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Необхідно увійти в систему' },
				{ status: 401 }
			)
		}

		const { name, bio, image, bannerColor } = await request.json()

		// Обновляем пользователя
		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				name: name || null,
				bio: bio || null,
				image: image || null,
				bannerColor: bannerColor || null,
			},
			select: {
				id: true,
				name: true,
				email: true,
				bio: true,
				image: true,
				bannerColor: true,
			},
		})

		return NextResponse.json(user)
	} catch (error) {
		console.error('Profile update error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
