'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
	id?: string
	initial?: { name: string; slug?: string | null }
}

export default function CategoryForm({ id, initial }: Props) {
	const [name, setName] = useState(initial?.name || '')
	const [slug, setSlug] = useState(initial?.slug || '')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			const url = id ? `/api/admin/categories/${id}` : '/api/admin/categories'
			const method = id ? 'PUT' : 'POST'
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, slug: slug || undefined }),
			})

			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Помилка при збереженні')
				setLoading(false)
				return
			}

			router.push('/admin/categories')
		} catch (err) {
			console.error(err)
			alert('Помилка при збереженні категорії')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='bg-gray-800 rounded-lg shadow p-6'>
			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>Назва</label>
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				/>
			</div>
			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>
					Slug (необов'язково)
				</label>
				<input
					value={slug || ''}
					onChange={e => setSlug(e.target.value)}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				/>
			</div>
			<div className='flex space-x-2'>
				<button
					type='submit'
					disabled={loading}
					className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded'
				>
					Зберегти
				</button>
				<button
					type='button'
					onClick={() => router.push('/admin/categories')}
					className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded'
				>
					Відмінити
				</button>
			</div>
		</form>
	)
}
