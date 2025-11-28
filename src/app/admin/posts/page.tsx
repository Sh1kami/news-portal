import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getPosts() {
	return prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					name: true,
					email: true,
				},
			},
			category: {
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
		},
	})
}

export default async function AdminPostsPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const posts = await getPosts()

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6 flex justify-between items-center'>
					<Link
						href='/admin'
						className='inline-flex items-center text-sm text-gray-400 hover:text-gray-300'
					>
						<ArrowLeft size={16} className='mr-2' />
						Назад до адмінки
					</Link>
					<Link
						href='/admin/posts/create'
						className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
					>
						<Plus size={20} className='mr-2' />
						Створити пост
					</Link>
				</div>

				<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700'>
						<h1 className='text-2xl font-bold text-white'>
							Управління публікаціями
						</h1>
					</div>

					<div className='p-6'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-700'>
								<thead>
									<tr>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Заголовок
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Автор
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Категорія
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Статус
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Коментарі
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Дата
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Дії
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-700'>
									{posts.map(post => (
										<tr key={post.id}>
											<td className='px-4 py-4'>
												<div className='max-w-xs'>
													<p className='font-medium text-white line-clamp-2'>
														{post.title}
													</p>
												</div>
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{post.author.name}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{post.category.name}
											</td>
											<td className='px-4 py-4 whitespace-nowrap'>
												<span
													className={`px-2 py-1 text-xs rounded-full ${
														post.published
															? 'bg-green-900 text-green-200'
															: 'bg-yellow-900 text-yellow-200'
													}`}
												>
													{post.published ? 'Опубліковано' : 'Чернетка'}
												</span>
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{post._count.comments}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{new Date(post.createdAt).toLocaleDateString('uk-UA')}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
												<div className='flex space-x-2'>
													<Link
														href={`/news/${post.id}`}
														className='text-blue-400 hover:text-blue-300'
													>
														<Eye size={16} />
													</Link>
													<Link
														href={`/admin/posts/${post.id}/edit`}
														className='text-green-400 hover:text-green-300'
													>
														<Edit size={16} />
													</Link>
													<button className='text-red-400 hover:text-red-300'>
														<Trash2 size={16} />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
