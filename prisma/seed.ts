import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	// Создаем тестовые категории
	const categories = await Promise.all([
		prisma.category.upsert({
			where: { slug: 'politics' },
			update: {},
			create: {
				name: 'Політика',
				slug: 'politics',
				description: 'Політичні новини України та світу',
			},
		}),
		prisma.category.upsert({
			where: { slug: 'economics' },
			update: {},
			create: {
				name: 'Економіка',
				slug: 'economics',
				description: 'Економічні новини та аналітика',
			},
		}),
		prisma.category.upsert({
			where: { slug: 'technology' },
			update: {},
			create: {
				name: 'Технології',
				slug: 'technology',
				description: 'Новини технологій та IT',
			},
		}),
	])

	// Создаем администратора
	const hashedPassword = await bcrypt.hash('admin123', 12)

	const admin = await prisma.user.upsert({
		where: { email: 'admin@newsportal.ua' },
		update: {},
		create: {
			email: 'admin@newsportal.ua',
			name: 'Адміністратор',
			password: hashedPassword,
			role: 'ADMIN',
		},
	})

	// Создаем тестового пользователя
	const userPassword = await bcrypt.hash('user123', 12)

	const user = await prisma.user.upsert({
		where: { email: 'user@example.ua' },
		update: {},
		create: {
			email: 'user@example.ua',
			name: 'Тестовий Користувач',
			password: userPassword,
			role: 'USER',
		},
	})

	// Создаем тестовые новости
	const posts = await Promise.all([
		prisma.post.create({
			data: {
				title: 'Україна та ЄС: нові угоди про співпрацю',
				content:
					'Україна та Європейський Союз підписали нові угоди про поглиблену співпрацю в галузі економіки та безпеки. Це відкриває нові можливості для розвитку країни.',
				excerpt:
					'Нові угоди між Україною та ЄС про співпрацю в галузі економіки та безпеки.',
				authorId: admin.id,
				categoryId: categories[0].id,
				published: true,
				publishedAt: new Date(),
			},
		}),
		prisma.post.create({
			data: {
				title: 'Цифрова економіка України зростає',
				content:
					'За останній рік цифрова економіка України показала значне зростання. IT-сектор став одним з найдинамічніших у країні.',
				excerpt: 'Значне зростання цифрової економіки України за останній рік.',
				authorId: admin.id,
				categoryId: categories[1].id,
				published: true,
				publishedAt: new Date(),
			},
		}),
		prisma.post.create({
			data: {
				title: 'Нові технології в освіті України',
				content:
					'Українські школи та університети впроваджують сучасні технології навчання. Цифровізація освіти прискорюється.',
				excerpt: 'Впровадження сучасних технологій в українській освіті.',
				authorId: admin.id,
				categoryId: categories[2].id,
				published: true,
				publishedAt: new Date(),
			},
		}),
	])

	console.log('Seed data created:')
	console.log('- Categories:', categories.length)
	console.log('- Users: 2 (admin + user)')
	console.log('- Posts:', posts.length)
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
