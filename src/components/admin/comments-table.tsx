'use client'

import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type Comment = {
	id: string
	content: string
	createdAt: string
	author: { id: string; name: string }
	post: { id: string; title: string }
}

export default function CommentsTable({
	comments: initial,
}: {
	comments: Comment[]
}) {
	const [comments, setComments] = useState<Comment[]>(initial)

	async function handleDelete(id: string) {
		const ok = confirm('Видалити цей коментар?')
		if (!ok) return

		try {
			const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Не вдалося видалити')
				return
			}
			setComments(prev => prev.filter(c => c.id !== id))
		} catch (err) {
			console.error(err)
			alert('Помилка при видаленні')
		}
	}

	return (
		<div className='bg-gray-800 rounded-lg shadow'>
			<div className='p-6'>
				{comments.length === 0 ? (
					<p className='text-gray-400 text-center'>Немає коментарів</p>
				) : (
					<div className='space-y-3'>
						{comments.map(c => (
							<div
								key={c.id}
								className='flex items-start justify-between bg-gray-900 p-3 rounded'
							>
								<div>
									<p className='text-white'>
										{c.author.name}{' '}
										<span className='text-sm text-gray-400'>
											• {new Date(c.createdAt).toLocaleString('uk-UA')}
										</span>
									</p>
									<p className='text-gray-300 mt-1'>{c.content}</p>
									<Link
										href={`/news/${c.post.id}`}
										className='text-sm text-blue-400 mt-1 inline-block'
									>
										Перейти до поста: {c.post.title}
									</Link>
								</div>
								<div className='flex flex-col space-y-2'>
									<Link
										href={`/admin/comments/${c.id}/edit`}
										className='text-blue-400 hover:text-blue-300 p-1'
									>
										<Edit size={16} />
									</Link>
									<button
										onClick={() => handleDelete(c.id)}
										className='text-red-400 hover:text-red-300 p-1'
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
