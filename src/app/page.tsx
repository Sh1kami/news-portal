import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { NewsList } from '@/components/news/news-list'
import { prisma } from '@/lib/prisma'

async function getLatestNews() {
	try {
		const news = await prisma.post.findMany({
			where: { published: true },
			include: {
				author: { select: { name: true } },
				category: { select: { name: true } },
				ratings: true,
				_count: { select: { comments: true } },
			},
			orderBy: { createdAt: 'desc' },
			take: 6,
		})
		return news
	} catch (error) {
		console.error('Error fetching news:', error)
		return []
	}
}

export default async function Home() {
	const latestNews = await getLatestNews()

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
				{/* Hero Section */}
				<section className='mb-12 text-center'>
					<h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4'>
						Новини України
					</h1>
					<p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
						Актуальні новини з усіх куточків України. Будьте в курсі подій!
					</p>
				</section>

				{/* Latest News */}
				<section>
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
						Останні новини
					</h2>
					<NewsList news={latestNews} />
				</section>
			</main>
			<Footer />
		</div>
	)
}
