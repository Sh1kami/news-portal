'use client'

import { Edit, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type Category = {
	id: string
	name: string
	slug: string | null
	createdAt: string
}

export default function CategoriesTable({
	categories: initial,
}: {
	categories: Category[]
}) {
	const [categories, setCategories] = useState<Category[]>(initial)

	async function handleDelete(id: string) {
		const ok = confirm(
			'Видалити категорію? Повʼязані пости будуть знеплені (categoryId -> null).'
		)
		if (!ok) return

		try {
			const res = await fetch(`/api/admin/categories/${id}`, {
				method: 'DELETE',
			})
			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Не вдалося видалити категорію')
				return
			}

			setCategories(prev => prev.filter(c => c.id !== id))
		} catch (err) {
			console.error(err)
			alert('Помилка при видаленні')
		}
	}

	return (
		<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
			<div className='px-6 py-4 border-b border-gray-700 flex justify-between items-center'>
				<h2 className='text-lg font-semibold text-white'>Категорії</h2>
				<Link
					href='/admin/categories/create'
					className='inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded'
				>
					<Plus size={16} className='mr-2' />
					Додати категорію
				</Link>
			</div>
			<div className='p-6'>
				{categories.length === 0 ? (
					<p className='text-gray-400 text-center'>Немає категорій</p>
				) : (
					<div className='space-y-3'>
						{categories.map(cat => (
							<div
								key={cat.id}
								className='flex items-center justify-between bg-gray-900 p-3 rounded'
							>
								<div>
									<p className='text-white font-medium'>{cat.name}</p>
									<p className='text-sm text-gray-400'>{cat.slug || '—'}</p>
								</div>
								<div className='flex space-x-2'>
									<Link
										href={`/admin/categories/${cat.id}/edit`}
										className='text-blue-400 hover:text-blue-300 p-1'
									>
										<Edit size={16} />
									</Link>
									<button
										onClick={() => handleDelete(cat.id)}
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
