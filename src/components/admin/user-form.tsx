'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
	id: string
	initial: { id: string; name: string; email: string; role: string }
}

export default function UserForm({ id, initial }: Props) {
	const [name, setName] = useState(initial.name || '')
	const [role, setRole] = useState(initial.role || 'USER')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			const res = await fetch(`/api/admin/users/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, role }),
			})

			if (!res.ok) {
				const data = await res.json()
				alert(data?.error || 'Не вдалося оновити користувача')
				setLoading(false)
				return
			}

			router.push('/admin/users')
		} catch (err) {
			console.error(err)
			alert('Помилка при оновленні')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='bg-gray-800 rounded-lg shadow p-6'>
			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>Ім'я</label>
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				/>
			</div>

			<div className='mb-4'>
				<label className='block text-sm text-gray-300 mb-1'>Роль</label>
				<select
					value={role}
					onChange={e => setRole(e.target.value)}
					className='w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700'
				>
					<option value='USER'>USER</option>
					<option value='ADMIN'>ADMIN</option>
				</select>
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
					onClick={() => router.push('/admin/users')}
					className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded'
				>
					Відмінити
				</button>
			</div>
		</form>
	)
}
