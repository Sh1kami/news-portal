'use client'

import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type User = {
	id: string
	name: string
	email: string
	role: string
	createdAt: string
	_count?: { posts?: number; comments?: number }
}

export default function UsersTable({ users: initial }: { users: User[] }) {
	const [users, setUsers] = useState<User[]>(initial)

	async function handleDelete(id: string) {
		const ok = confirm('Видалити цього користувача? Цю дію не можна скасувати.')
		if (!ok) return

		try {
			const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Не вдалося видалити користувача')
				return
			}

			setUsers(prev => prev.filter(u => u.id !== id))
		} catch (err) {
			console.error(err)
			alert('Помилка при видаленні')
		}
	}

	return (
		<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
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
									Дата
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
										{user._count?.posts ?? 0}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
										{user._count?.comments ?? 0}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
										{new Date(user.createdAt).toLocaleDateString('uk-UA')}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
										<div className='flex space-x-2'>
											<Link
												href={`/admin/users/${user.id}/edit`}
												className='text-blue-400 hover:text-blue-300 p-1'
											>
												<Edit size={16} />
											</Link>
											<button
												onClick={() => handleDelete(user.id)}
												className='text-red-400 hover:text-red-300 p-1'
											>
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
	)
}
