import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
	ArrowRight,
	Edit,
	Eye,
	FileText,
	MessageCircle,
	Plus,
	Settings,
	Trash2,
	Users,
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getAdminStats() {
	const [
		usersCount,
		postsCount,
		publishedPostsCount,
		categoriesCount,
		commentsCount,
	] = await Promise.all([
		prisma.user.count(),
		prisma.post.count(),
		// Count only posts that are published and already visible (publishedAt <= now)
		prisma.post.count({
			where: { published: true, publishedAt: { lte: new Date() } },
		}),
		prisma.category.count(),
		prisma.comment.count(),
	])

	return {
		usersCount,
		postsCount,
		publishedPostsCount,
		categoriesCount,
		commentsCount,
	}
}

async function getRecentUsers() {
	return prisma.user.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
		},
	})
}

async function getRecentPosts() {
	return prisma.post.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					name: true,
				},
			},
			category: {
				select: {
					name: true,
				},
			},
		},
	})
}

export default async function AdminPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const [stats, recentUsers, recentPosts] = await Promise.all([
		getAdminStats(),
		getRecentUsers(),
		getRecentPosts(),
	])

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-8 flex justify-between items-center'>
					<div>
						<h1 className='text-3xl sm:text-4xl font-bold text-white'>
							Панель управління
						</h1>
						<p className='text-lg text-gray-300 mt-2'>
							Керування контентом та користувачами
						</p>
					</div>
					<div className='flex space-x-2'>
						<Link
							href='/admin/posts/create'
							className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
						>
							<Plus size={20} className='mr-2' />
							Створити пост
						</Link>
						<Link
							href='/admin/categories/create'
							className='inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
						>
							<Plus size={20} className='mr-2' />
							Додати категорію
						</Link>
					</div>
				</div>

				{/* Статистика */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
					<Link
						href='/admin/users'
						className='bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-700 transition-colors'
					>
						<div className='flex items-center'>
							<Users className='h-8 w-8 text-blue-400' />
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-400'>Користувачі</p>
								<p className='text-2xl font-semibold text-white'>
									{stats.usersCount}
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/admin/posts'
						className='bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-700 transition-colors'
					>
						<div className='flex items-center'>
							<FileText className='h-8 w-8 text-green-400' />
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-400'>
									Всього публікацій
								</p>
								<p className='text-2xl font-semibold text-white'>
									{stats.postsCount}
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/admin/posts?filter=visible'
						className='bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-700 transition-colors'
					>
						<div className='flex items-center'>
							<FileText className='h-8 w-8 text-yellow-400' />
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-400'>
									Опубліковано
								</p>
								<p className='text-2xl font-semibold text-white'>
									{stats.publishedPostsCount}
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/admin/categories'
						className='bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-700 transition-colors'
					>
						<div className='flex items-center'>
							<Settings className='h-8 w-8 text-purple-400' />
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-400'>Категорії</p>
								<p className='text-2xl font-semibold text-white'>
									{stats.categoriesCount}
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/admin/comments'
						className='bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-700 transition-colors'
					>
						<div className='flex items-center'>
							<MessageCircle className='h-8 w-8 text-red-400' />
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-400'>Коментарі</p>
								<p className='text-2xl font-semibold text-white'>
									{stats.commentsCount}
								</p>
							</div>
						</div>
					</Link>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Останні пользователи */}
					<div className='bg-gray-800 rounded-lg shadow'>
						<div className='px-6 py-4 border-b border-gray-700 flex justify-between items-center'>
							<h2 className='text-xl font-semibold text-white'>
								Останні користувачі
							</h2>
							<Link
								href='/admin/users'
								className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
							>
								Всі користувачі <ArrowRight size={16} className='ml-1' />
							</Link>
						</div>
						<div className='p-6'>
							{recentUsers.length === 0 ? (
								<p className='text-gray-400 text-center py-4'>
									Немає користувачів
								</p>
							) : (
								<div className='space-y-4'>
									{recentUsers.map(user => (
										<div
											key={user.id}
											className='flex items-center justify-between py-2'
										>
											<div>
												<p className='font-medium text-white'>{user.name}</p>
												<p className='text-sm text-gray-400'>{user.email}</p>
											</div>
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													user.role === 'ADMIN'
														? 'bg-purple-900 text-purple-200'
														: 'bg-blue-900 text-blue-200'
												}`}
											>
												{user.role}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Останние публикации */}
					<div className='bg-gray-800 rounded-lg shadow'>
						<div className='px-6 py-4 border-b border-gray-700 flex justify-between items-center'>
							<h2 className='text-xl font-semibold text-white'>
								Останні публікації
							</h2>
							<Link
								href='/admin/posts'
								className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
							>
								Всі публікації <ArrowRight size={16} className='ml-1' />
							</Link>
						</div>
						<div className='p-6'>
							{recentPosts.length === 0 ? (
								<p className='text-gray-400 text-center py-4'>
									Немає публікацій
								</p>
							) : (
								<div className='space-y-4'>
									{recentPosts.map(post => (
										<div
											key={post.id}
											className='flex items-center justify-between py-2'
										>
											<div className='flex-1'>
												<p className='font-medium text-white line-clamp-1'>
													{post.title}
												</p>
												<p className='text-sm text-gray-400'>
													{post.author.name} • {post.category.name}
												</p>
											</div>
											<div className='flex space-x-2 ml-4'>
												<Link
													href={`/news/${post.id}`}
													className='p-1 text-blue-400 hover:text-blue-300'
												>
													<Eye size={16} />
												</Link>
												<Link
													href={`/admin/posts/${post.id}/edit`}
													className='p-1 text-green-400 hover:text-green-300'
												>
													<Edit size={16} />
												</Link>
												<button className='p-1 text-red-400 hover:text-red-300'>
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									))}
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
