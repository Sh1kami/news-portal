import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface Context {
	params: { id: string }
}

export async function PUT(request: Request, context: Context) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 })
		}

		const { id } = context.params
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

		const updated = await prisma.category.update({
			where: { id },
			data: { name, slug: generatedSlug },
		})
		return NextResponse.json(updated)
	} catch (error) {
		console.error('Update category error:', error)
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
		const category = await prisma.category.findUnique({ where: { id } })
		if (!category) {
			return NextResponse.json(
				{ error: 'Категорія не знайдена' },
				{ status: 404 }
			)
		}

		// Reassign posts to a default "uncategorized" category (create if missing)
		const postsCount = await prisma.post.count({ where: { categoryId: id } })
		if (postsCount > 0) {
			let defaultCategory = await prisma.category.findUnique({
				where: { slug: 'uncategorized' },
			})
			if (!defaultCategory) {
				defaultCategory = await prisma.category.create({
					data: { name: 'Uncategorized', slug: 'uncategorized' },
				})
			}

			await prisma.post.updateMany({
				where: { categoryId: id },
				data: { categoryId: defaultCategory.id },
			})
		}

		await prisma.category.delete({ where: { id } })

		return NextResponse.json({ message: 'Категорія видалена' })
	} catch (error) {
		console.error('Delete category error:', error)
		return NextResponse.json(
			{ error: 'Внутрішня помилка сервера' },
			{ status: 500 }
		)
	}
}
