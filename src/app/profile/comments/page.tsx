import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Calendar, ExternalLink, MessageCircle } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getUserComments(userId: string) {
	const comments = await prisma.comment.findMany({
		where: { authorId: userId },
		include: {
			post: {
				select: {
					id: true,
					title: true,
					category: {
						select: {
							name: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	})

	return comments
}

export default async function UserCommentsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/auth/signin')
	}

	const comments = await getUserComments(session.user.id)

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<Header />
			<main className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<Link
						href='/profile'
						className='inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
					>
						<ArrowLeft size={16} className='mr-2' />
						Назад до профілю
					</Link>
				</div>

				<div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
						<h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
							<MessageCircle size={24} className='mr-2' />
							Мої коментарі ({comments.length})
						</h1>
					</div>

					<div className='p-6'>
						{comments.length === 0 ? (
							<div className='text-center py-8'>
								<MessageCircle
									size={48}
									className='mx-auto text-gray-400 mb-4'
								/>
								<p className='text-gray-500 dark:text-gray-400'>
									Ви ще не залишили жодного коментаря.
								</p>
								<Link
									href='/news'
									className='inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
								>
									Перейти до новин
								</Link>
							</div>
						) : (
							<div className='space-y-6'>
								{comments.map(comment => (
									<div
										key={comment.id}
										className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
									>
										<div className='flex justify-between items-start mb-3'>
											<div>
												<Link
													href={`/news/${comment.post.id}`}
													className='text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
												>
													{comment.post.title}
												</Link>
												<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
													Категорія: {comment.post.category.name}
												</p>
											</div>
											<Link
												href={`/news/${comment.post.id}`}
												className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
											>
												<ExternalLink size={16} />
											</Link>
										</div>

										<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3'>
											<p className='text-gray-700 dark:text-gray-300'>
												{comment.content}
											</p>
										</div>

										<div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400'>
											<div className='flex items-center'>
												<Calendar size={14} className='mr-1' />
												{new Date(comment.createdAt).toLocaleDateString(
													'uk-UA'
												)}
												{comment.updatedAt > comment.createdAt && (
													<span className='ml-2 text-gray-400'>(ред.)</span>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
