'use client'

import { Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type Post = any

export default function PostsTable({ posts: initialPosts }: { posts: Post[] }) {
	const [posts, setPosts] = useState<Post[]>(initialPosts || [])
	const [deleting, setDeleting] = useState<string | null>(null)

	const handleDelete = async (id: string) => {
		if (!confirm('Ви впевнені, що хочете видалити цю публікацію?')) return
		try {
			setDeleting(id)
			const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Delete failed')
			setPosts(prev => prev.filter(p => p.id !== id))
		} catch (err: any) {
			alert(err.message || 'Помилка при видаленні')
		} finally {
			setDeleting(null)
		}
	}

	return (
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
								{post.author?.name}
							</td>
							<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-400'>
								{post.category?.name}
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
								{post._count?.comments}
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
									<button
										onClick={() => handleDelete(post.id)}
										disabled={deleting === post.id}
										className='text-red-400 hover:text-red-300'
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
	)
}
