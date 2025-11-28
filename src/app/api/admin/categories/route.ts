import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { createdAt: 'desc' },
		})
		return NextResponse.json(categories)
	} catch (error) {
		console.error('Get categories error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 })
		}

		const { name, slug } = await request.json()
		if (!name) {
			return NextResponse.json(
				{ error: 'Назва категорії обовʼязкова' },
				{ status: 400 }
			)
		}

		const generatedSlug =
			(slug && String(slug).trim()) ||
			String(name).trim().toLowerCase().replace(/\s+/g, '-')

		const existing = await prisma.category.findUnique({
			where: { slug: generatedSlug },
		})
		if (existing) {
			return NextResponse.json(
				{ error: 'Категорія з таким slug вже існує' },
				{ status: 400 }
			)
		}

		const created = await prisma.category.create({
			data: { name, slug: generatedSlug },
		})
		return NextResponse.json(created)
	} catch (error) {
		console.error('Create category error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
