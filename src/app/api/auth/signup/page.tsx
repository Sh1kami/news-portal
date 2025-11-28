'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		if (formData.password !== formData.confirmPassword) {
			setError('Паролі не співпадають')
			setLoading(false)
			return
		}

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Помилка реєстрації')
			}

			router.push('/auth/signin?message=Registration successful')
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className='mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white'>
					Реєстрація
				</h2>
				<p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
					Або{' '}
					<Link
						href='/auth/signin'
						className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
					>
						увійти в систему
					</Link>
				</p>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={handleSubmit}>
						{error && (
							<div className='bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4'>
								<p className='text-sm text-red-600 dark:text-red-400'>
									{error}
								</p>
							</div>
						)}

						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 dark:text-gray-300'
							>
								Ім'я
							</label>
							<div className='mt-1'>
								<input
									id='name'
									name='name'
									type='text'
									autoComplete='name'
									required
									value={formData.name}
									onChange={handleChange}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 dark:text-gray-300'
							>
								Електронна пошта
							</label>
							<div className='mt-1'>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									value={formData.email}
									onChange={handleChange}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
									placeholder='your@email.com'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 dark:text-gray-300'
							>
								Пароль
							</label>
							<div className='mt-1'>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='new-password'
									required
									value={formData.password}
									onChange={handleChange}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-700 dark:text-gray-300'
							>
								Підтвердіть пароль
							</label>
							<div className='mt-1'>
								<input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									autoComplete='new-password'
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={loading}
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{loading ? 'Реєстрація...' : 'Зареєструватися'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
