import { CommentsSection } from '@/components/comments/comments-section'
import { RatingSection } from '@/components/ratings/rating-section'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Calendar, MessageCircle, Star, User } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getPost(id: string) {
	const post = await prisma.post.findUnique({
		where: { id },
		include: {
			author: { select: { name: true, email: true } },
			category: { select: { name: true, slug: true } },
			comments: {
				include: {
					author: { select: { name: true, email: true } },
					ratings: true,
					_count: { select: { ratings: true } },
				},
				orderBy: { createdAt: 'desc' },
			},
			ratings: true,
			_count: { select: { comments: true, ratings: true } },
		},
	})

	return post
}

interface PostPageProps {
	params: {
		id: string
	}
}

export default async function PostPage({ params }: PostPageProps) {
	const session = await getServerSession(authOptions)
	const post = await getPost(params.id)

	if (!post) {
		notFound()
	}

	const userRating = session
		? post.ratings.find(rating => rating.userId === session.user.id)
		: null
	const averageRating =
		post.ratings.length > 0
			? post.ratings.reduce((acc, rating) => acc + rating.value, 0) /
			  post.ratings.length
			: 0

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				{/* Кнопка назад */}
				<Link
					href='/news'
					className='inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6'
				>
					<ArrowLeft size={16} className='mr-2' />
					Назад до новин
				</Link>

				{/* Заголовок и мета-информация */}
				<article className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
					{post.image && (
						<img
							src={post.image}
							alt={post.title}
							className='w-full h-64 object-cover'
						/>
					)}

					<div className='p-6'>
						{/* Категория */}
						<div className='mb-4'>
							<span className='inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full'>
								{post.category.name}
							</span>
						</div>

						{/* Заголовок */}
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
							{post.title}
						</h1>

						{/* Мета-информация */}
						<div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6'>
							<div className='flex items-center'>
								<User size={16} className='mr-2' />
								{post.author.name}
							</div>
							<div className='flex items-center'>
								<Calendar size={16} className='mr-2' />
								{new Date(post.createdAt).toLocaleDateString('uk-UA')}
							</div>
							<div className='flex items-center'>
								<MessageCircle size={16} className='mr-2' />
								{post._count.comments} коментарів
							</div>
							<div className='flex items-center'>
								<Star size={16} className='mr-2 text-yellow-500' />
								{averageRating.toFixed(1)} ({post._count.ratings} оцінок)
							</div>
						</div>

						{/* Контент */}
						<div
							className='prose dark:prose-invert max-w-none mb-8'
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>

						{/* Рейтинг */}
						<div className='border-t border-gray-200 dark:border-gray-700 pt-6 mb-6'>
							<RatingSection
								postId={post.id}
								userRating={userRating?.value || null}
								averageRating={averageRating}
								totalRatings={post._count.ratings}
							/>
						</div>
					</div>
				</article>

				{/* Комментарии */}
				<div className='mt-8'>
					<CommentsSection
						postId={post.id}
						comments={post.comments}
						session={session}
					/>
				</div>
			</div>
		</div>
	)
}
