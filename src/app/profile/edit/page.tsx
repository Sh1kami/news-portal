'use client'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import {
	ArrowLeft,
	Image as ImageIcon,
	Mail,
	Palette,
	Save,
	User,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditProfilePage() {
	const { data: session } = useSession()
	const router = useRouter()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		bio: '',
		image: '',
		bannerColor: '#3b82f6',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		if (session?.user) {
			setFormData(prev => ({
				...prev,
				email: session.user.email || '',
				name: session.user.name || '',
			}))

			// Загружаем дополнительные данные профиля
			const loadProfile = async () => {
				try {
					const response = await fetch('/api/user/profile')
					if (response.ok) {
						const userData = await response.json()
						setFormData(prev => ({
							...prev,
							name: userData.name || '',
							bio: userData.bio || '',
							image: userData.image || '',
							bannerColor: userData.bannerColor || '#3b82f6',
						}))
					}
				} catch (error) {
					console.error('Error loading profile:', error)
				}
			}

			loadProfile()
		}
	}, [session])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		try {
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					bio: formData.bio,
					image: formData.image,
					bannerColor: formData.bannerColor,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Помилка оновлення профілю')
			}

			setSuccess('Профіль успішно оновлено')
			setTimeout(() => {
				router.push('/profile')
				router.refresh()
			}, 2000)
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	if (!session) {
		router.push('/auth/signin')
		return null
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700 flex items-center justify-between'>
						<h1 className='text-2xl font-bold text-white'>
							Редагувати профіль
						</h1>
						<button
							onClick={() => router.back()}
							className='inline-flex items-center px-3 py-1 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700'
						>
							<ArrowLeft size={16} className='mr-1' />
							Назад
						</button>
					</div>

					<form onSubmit={handleSubmit} className='p-6 space-y-6'>
						{error && (
							<div className='bg-red-900/50 border border-red-800 rounded-md p-4'>
								<p className='text-sm text-red-400'>{error}</p>
							</div>
						)}

						{success && (
							<div className='bg-green-900/50 border border-green-800 rounded-md p-4'>
								<p className='text-sm text-green-400'>{success}</p>
							</div>
						)}

						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Ім'я
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User size={16} className='text-gray-400' />
								</div>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									className='pl-10 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white'
									placeholder="Ваше ім'я"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Електронна пошта
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail size={16} className='text-gray-400' />
								</div>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									className='pl-10 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white'
									placeholder='your@email.com'
									disabled
								/>
							</div>
							<p className='mt-1 text-sm text-gray-400'>
								Електронну пошту не можна змінити
							</p>
						</div>

						<div>
							<label
								htmlFor='image'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Аватар (URL)
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ImageIcon size={16} className='text-gray-400' />
								</div>
								<input
									type='url'
									id='image'
									name='image'
									value={formData.image}
									onChange={handleChange}
									className='pl-10 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white'
									placeholder='https://example.com/avatar.jpg'
								/>
							</div>
							{formData.image && (
								<div className='mt-2'>
									<p className='text-sm text-gray-400 mb-2'>
										Попередній перегляд:
									</p>
									<div className='w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden'>
										<img
											src={formData.image}
											alt='Avatar preview'
											className='w-full h-full object-cover'
											onError={e => {
												e.currentTarget.style.display = 'none'
											}}
										/>
									</div>
								</div>
							)}
						</div>

						<div>
							<label
								htmlFor='bannerColor'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Колір банера
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Palette size={16} className='text-gray-400' />
								</div>
								<input
									type='color'
									id='bannerColor'
									name='bannerColor'
									value={formData.bannerColor}
									onChange={handleChange}
									className='pl-10 block w-full h-10 border border-gray-600 rounded-md shadow-sm bg-gray-700'
								/>
							</div>
							<div
								className='mt-2 h-4 rounded-md'
								style={{ backgroundColor: formData.bannerColor }}
							></div>
						</div>

						<div>
							<label
								htmlFor='bio'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Біографія
							</label>
							<textarea
								id='bio'
								name='bio'
								rows={4}
								value={formData.bio}
								onChange={handleChange}
								className='block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white'
								placeholder='Розкажіть трохи про себе...'
							/>
						</div>

						<div className='flex justify-end'>
							<button
								type='submit'
								disabled={loading}
								className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<Save size={16} className='mr-2' />
								{loading ? 'Збереження...' : 'Зберегти зміни'}
							</button>
						</div>
					</form>
				</div>
			</main>
			<Footer />
		</div>
	)
}
