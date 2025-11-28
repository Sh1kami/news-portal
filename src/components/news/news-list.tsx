import { MessageCircle, Star } from 'lucide-react'
import Link from 'next/link'

interface NewsItem {
	id: string
	title: string
	excerpt?: string
	image?: string
	createdAt: Date
	author: { name: string | null }
	category: { name: string }
	ratings: { value: number }[]
	_count: { comments: number }
}

interface NewsListProps {
	news: NewsItem[]
}

export function NewsList({ news }: NewsListProps) {
	const calculateAverageRating = (ratings: { value: number }[]) => {
		if (ratings.length === 0) return 0
		const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
		return sum / ratings.length
	}

	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{news.map(item => (
				<article
					key={item.id}
					className='bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
				>
					{item.image && (
						<div className='w-full h-48 bg-gray-700 overflow-hidden'>
							<img
								src={item.image}
								alt={item.title}
								className='w-full h-full object-cover'
								onError={e => {
									e.currentTarget.style.display = 'none'
								}}
							/>
						</div>
					)}
					<div className='p-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-blue-400 font-medium'>
								{item.category.name}
							</span>
							<span className='text-sm text-gray-400'>
								{new Date(item.createdAt).toLocaleDateString('uk-UA')}
							</span>
						</div>

						<h3 className='text-xl font-bold text-white mb-3 line-clamp-2'>
							{item.title}
						</h3>

						{item.excerpt && (
							<p className='text-gray-300 mb-4 line-clamp-3'>{item.excerpt}</p>
						)}

						<div className='flex items-center justify-between text-sm text-gray-400'>
							<span>Автор: {item.author.name}</span>
							<div className='flex items-center space-x-4'>
								<div className='flex items-center space-x-1'>
									<Star size={16} className='text-yellow-500' />
									<span>{calculateAverageRating(item.ratings).toFixed(1)}</span>
								</div>
								<div className='flex items-center space-x-1'>
									<MessageCircle size={16} />
									<span>{item._count.comments}</span>
								</div>
							</div>
						</div>

						<Link
							href={`/news/${item.id}`}
							className='mt-4 inline-block text-blue-400 hover:text-blue-300 font-medium'
						>
							Читати далі →
						</Link>
					</div>
				</article>
			))}
		</div>
	)
}
