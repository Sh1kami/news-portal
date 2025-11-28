'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Category = { id: string; name: string; slug?: string | null }

type Props = {
	id?: string
	initial?: {
		title?: string
		content?: string
		categoryId?: string | null
		published?: boolean
	}
}

export default function PostForm({ id, initial }: Props) {
	const [title, setTitle] = useState(initial?.title || '')
	const [content, setContent] = useState(initial?.content || '')
	const [image, setImage] = useState(initial?.image || '')
	const [categoryId, setCategoryId] = useState<string | null | undefined>(
		initial?.categoryId ?? ''
	)
	const [published, setPublished] = useState(!!initial?.published)
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		fetch('/api/admin/categories')
			.then(r => r.json())
			.then(setCategories)
			.catch(err => console.error('Failed to load categories', err))
	}, [])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			const url = id ? `/api/admin/posts/${id}` : '/api/admin/posts'
			const method = id ? 'PUT' : 'POST'
			const body = {
				title,
				content,
				image: image || null,
				categoryId: categoryId || null,
				published,
			}

			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})

			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Не вдалося зберегти пост')
				setLoading(false)
				return
			}

			router.push('/admin/posts')
		} catch (err) {
			console.error(err)
			alert('Помилка при збереженні посту')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='bg-gray-800 rounded-lg shadow p-6'>
			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>Заголовок</label>
				<input
					value={title}
					onChange={e => setTitle(e.target.value)}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				/>
			</div>

			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>Текст</label>
				<textarea
					value={content}
					onChange={e => setContent(e.target.value)}
					rows={8}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				/>
			</div>

			<div className='mb-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div>
					<label className='block text-sm text-gray-300 mb-1'>Категорія</label>
					<select
						value={categoryId || ''}
						onChange={e => setCategoryId(e.target.value || null)}
						className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
					>
						<option value=''>Без категорії</option>
						{categories.map(c => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block text-sm text-gray-300 mb-1'>
						Зображення (URL)
					</label>
					<input
						value={image || ''}
						onChange={e => setImage(e.target.value)}
						placeholder='https://...'
						className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
					/>
				</div>

				<div className='flex items-end'>
					<label className='inline-flex items-center text-sm text-gray-300'>
						<input
							type='checkbox'
							checked={published}
							onChange={e => setPublished(e.target.checked)}
							className='mr-2'
						/>{' '}
						Опубліковано
					</label>
				</div>
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
					onClick={() => router.push('/admin/posts')}
					className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded'
				>
					Відмінити
				</button>
			</div>
		</form>
	)
}
