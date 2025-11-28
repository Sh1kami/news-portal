import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { NewsList } from '@/components/news/news-list'
import { prisma } from '@/lib/prisma'

async function getAllNews(categorySlug?: string) {
	try {
		const where = categorySlug
			? {
					published: true,
					category: { slug: categorySlug },
			  }
			: { published: true }

		const news = await prisma.post.findMany({
			where,
			include: {
				author: { select: { name: true } },
				category: { select: { name: true, slug: true } },
				ratings: true,
				_count: { select: { comments: true } },
			},
			orderBy: { createdAt: 'desc' },
		})
		return news
	} catch (error) {
		console.error('Error fetching news:', error)
		return []
	}
}

async function getCategories() {
	try {
		const categories = await prisma.category.findMany()
		return categories
	} catch (error) {
		console.error('Error fetching categories:', error)
		return []
	}
}

interface NewsPageProps {
	searchParams: {
		category?: string
	}
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
	const { category } = searchParams
	const [allNews, categories] = await Promise.all([
		getAllNews(category),
		getCategories(),
	])

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						{category
							? `Новини: ${categories.find(c => c.slug === category)?.name}`
							: 'Всі новини'}
					</h1>
					<p className='text-lg text-gray-300'>
						Актуальні новини з усіх категорій
					</p>
				</div>

				<div className='mb-6'>
					<div className='flex flex-wrap gap-2'>
						<a
							href='/news'
							className={`px-4 py-2 rounded-lg text-sm ${
								!category
									? 'bg-blue-600 text-white'
									: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
							}`}
						>
							Всі
						</a>
						{categories.map(cat => (
							<a
								key={cat.id}
								href={`/news?category=${cat.slug}`}
								className={`px-4 py-2 rounded-lg text-sm ${
									category === cat.slug
										? 'bg-blue-600 text-white'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
								}`}
							>
								{cat.name}
							</a>
						))}
					</div>
				</div>

				<NewsList news={allNews} />
			</main>
			<Footer />
		</div>
	)
}
