import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import ClientImage from '@/components/ui/client-image'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
	Calendar,
	Edit,
	FileText,
	Mail,
	MessageCircle,
	User,
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getUserProfile(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			bio: true,
			bannerColor: true,
			createdAt: true,
			role: true,
			_count: {
				select: {
					posts: true,
					comments: true,
				},
			},
		},
	})

	return user
}

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/auth/signin')
	}

	const user = await getUserProfile(session.user.id)

	if (!user) {
		return <div>Користувача не знайдено</div>
	}

	const bannerStyle = user.bannerColor
		? { backgroundColor: user.bannerColor }
		: { background: 'linear-gradient(to right, #3b82f6, #1d4ed8)' }

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
					{/* Profile Header */}
					<div className='h-32 sm:h-40' style={bannerStyle}></div>
					<div className='px-6 pb-6'>
						<div className='flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-6'>
							<div className='flex items-end space-x-4'>
								<div className='bg-gray-800 p-1 rounded-full'>
									{user.image ? (
										<div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden'>
											<ClientImage
												src={user.image}
												alt={user.name || 'User'}
												className='w-full h-full object-cover'
											/>
										</div>
									) : (
										<div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center'>
											<User size={48} className='text-gray-400' />
										</div>
									)}
								</div>
								<div className='pb-2'>
									<h1 className='text-2xl sm:text-3xl font-bold text-white'>
										{user.name}
									</h1>
									<p className='text-gray-300'>@{user.email.split('@')[0]}</p>
								</div>
							</div>
							<Link
								href='/profile/edit'
								className='mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								<Edit size={16} className='mr-2' />
								Редагувати профіль
							</Link>
						</div>

						{/* Profile Stats */}
						<div
							className={`grid gap-4 mb-6 ${
								user.role === 'ADMIN' ? 'grid-cols-3' : 'grid-cols-2'
							}`}
						>
							{user.role === 'ADMIN' && (
								<Link
									href='/admin/posts'
									className='bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors'
								>
									<FileText size={24} className='mx-auto text-blue-400 mb-2' />
									<div className='text-2xl font-bold text-white'>
										{user._count.posts}
									</div>
									<div className='text-gray-400'>Мої пости</div>
								</Link>
							)}
							<Link
								href='/profile/comments'
								className='bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors'
							>
								<MessageCircle
									size={24}
									className='mx-auto text-green-400 mb-2'
								/>
								<div className='text-2xl font-bold text-white'>
									{user._count.comments}
								</div>
								<div className='text-gray-400'>Коментарі</div>
							</Link>
						</div>

						{/* Profile Details */}
						<div className='space-y-4'>
							<div className='flex items-center text-gray-300'>
								<Mail size={20} className='mr-3 text-gray-400' />
								<span>{user.email}</span>
							</div>
							<div className='flex items-center text-gray-300'>
								<Calendar size={20} className='mr-3 text-gray-400' />
								<span>
									Зареєстрований:{' '}
									{new Date(user.createdAt).toLocaleDateString('uk-UA')}
								</span>
							</div>
							{user.bio && (
								<div>
									<h3 className='text-lg font-medium text-white mb-2'>
										Біографія
									</h3>
									<p className='text-gray-300'>{user.bio}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
