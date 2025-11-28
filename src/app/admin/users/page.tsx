import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getUsers() {
	return prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
			_count: {
				select: {
					posts: true,
					comments: true,
				},
			},
		},
	})
}

export default async function AdminUsersPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const users = await getUsers()

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<Link
						href='/admin'
						className='inline-flex items-center text-sm text-gray-400 hover:text-gray-300'
					>
						<ArrowLeft size={16} className='mr-2' />
						Назад до адмінки
					</Link>
				</div>

				<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700'>
						<h1 className='text-2xl font-bold text-white'>
							Управління користувачами
						</h1>
					</div>

					<div className='p-6'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-700'>
								<thead>
									<tr>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Користувач
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Роль
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Пости
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Коментарі
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Дата реєстрації
										</th>
										<th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Дії
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-700'>
									{users.map(user => (
										<tr key={user.id}>
											<td className='px-4 py-4 whitespace-nowrap'>
												<div>
													<p className='font-medium text-white'>{user.name}</p>
													<p className='text-sm text-gray-400'>{user.email}</p>
												</div>
											</td>
											<td className='px-4 py-4 whitespace-nowrap'>
												<span
													className={`px-2 py-1 text-xs rounded-full ${
														user.role === 'ADMIN'
															? 'bg-purple-900 text-purple-200'
															: 'bg-blue-900 text-blue-200'
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{user._count.posts}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{user._count.comments}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
												{new Date(user.createdAt).toLocaleDateString('uk-UA')}
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
												<div className='flex space-x-2'>
													<button className='text-blue-400 hover:text-blue-300'>
														<Edit size={16} />
													</button>
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
