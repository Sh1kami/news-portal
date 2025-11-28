import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { prisma } from '@/lib/prisma'
import { ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'

async function getCategoriesWithStats() {
	try {
		const categories = await prisma.category.findMany({
			include: {
				_count: {
					select: {
						posts: {
							where: {
								published: true,
							},
						},
					},
				},
				posts: {
					where: {
						published: true,
					},
					take: 3,
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						author: {
							select: {
								name: true,
							},
						},
						_count: {
							select: {
								comments: true,
								ratings: true,
							},
						},
						ratings: true,
					},
				},
			},
		})
		return categories
	} catch (error) {
		console.error('Error fetching categories:', error)
		return []
	}
}

export default async function CategoriesPage() {
	const categories = await getCategoriesWithStats()

	const calculateAverageRating = (ratings: { value: number }[]) => {
		if (ratings.length === 0) return 0
		const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
		return sum / ratings.length
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
						Категорії новин
					</h1>
					<p className='text-lg text-gray-600'>
						Оберіть категорію для перегляду відповідних новин
					</p>
				</div>

				<div className='grid gap-8'>
					{categories.map(category => (
						<div
							key={category.id}
							className='bg-white rounded-lg shadow-lg overflow-hidden'
						>
							<div className='p-6 border-b border-gray-200'>
								<div className='flex items-center justify-between'>
									<div>
										<h2 className='text-2xl font-bold text-gray-900'>
											{category.name}
										</h2>
										{category.description && (
											<p className='text-gray-600 mt-2'>
												{category.description}
											</p>
										)}
										<p className='text-sm text-gray-500 mt-1'>
											{category._count.posts} публікацій
										</p>
									</div>
									<Link
										href={`/news?category=${category.slug}`}
										className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
									>
										<span>Всі новини</span>
										<ArrowRight size={16} className='ml-2' />
									</Link>
								</div>
							</div>

							{category.posts.length > 0 && (
								<div className='p-6'>
									<h3 className='text-lg font-semibold text-gray-900 mb-4'>
										Останні новини
									</h3>
									<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
										{category.posts.map(post => (
											<Link
												key={post.id}
												href={`/news/${post.id}`}
												className='block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors'
											>
												<h4 className='font-medium text-gray-900 line-clamp-2 mb-2'>
													{post.title}
												</h4>
												<div className='flex items-center justify-between text-sm text-gray-500'>
													<span>{post.author.name}</span>
													<div className='flex items-center space-x-2'>
														<span>
															{calculateAverageRating(post.ratings).toFixed(1)}{' '}
															⭐
														</span>
														<span>{post._count.comments} 💬</span>
													</div>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{categories.length === 0 && (
					<div className='text-center py-12'>
						<FileText size={48} className='mx-auto text-gray-400 mb-4' />
						<p className='text-gray-500 text-lg'>Категорії ще не додані</p>
					</div>
				)}
			</main>
			<Footer />
		</div>
	)
}
