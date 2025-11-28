import { MessageCircle, Star } from 'lucide-react'
import Link from 'next/link'

interface NewsItemProps {
	id: string
	title: string
	excerpt?: string
	image?: string
	createdAt: Date
	author: { name: string | null }
	category: { name: string }
	ratings: { value: number }[]
	_count: { comments: number }
	featured?: boolean
}

export function NewsItem({
	id,
	title,
	excerpt,
	image,
	createdAt,
	author,
	category,
	ratings,
	_count,
	featured = false,
}: NewsItemProps) {
	const calculateAverageRating = (ratings: { value: number }[]) => {
		if (ratings.length === 0) return 0
		const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
		return sum / ratings.length
	}

	return (
		<article
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
				featured ? 'md:col-span-2' : ''
			}`}
		>
			{image && (
				<img
					src={image}
					alt={title}
					className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
				/>
			)}
			<div className='p-6'>
				<div className='flex items-center justify-between mb-3'>
					<span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
						{category.name}
					</span>
					<span className='text-sm text-gray-500 dark:text-gray-400'>
						{new Date(createdAt).toLocaleDateString('uk-UA')}
					</span>
				</div>

				<h3
					className={`font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 ${
						featured ? 'text-2xl' : 'text-xl'
					}`}
				>
					{title}
				</h3>

				{excerpt && (
					<p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'>
						{excerpt}
					</p>
				)}

				<div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
					<span>Автор: {author.name}</span>
					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-1'>
							<Star size={16} className='text-yellow-500' />
							<span>{calculateAverageRating(ratings).toFixed(1)}</span>
						</div>
						<div className='flex items-center space-x-1'>
							<MessageCircle size={16} />
							<span>{_count.comments}</span>
						</div>
					</div>
				</div>

				<Link
					href={`/news/${id}`}
					className='mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'
				>
					Читати далі →
				</Link>
			</div>
		</article>
	)
}
