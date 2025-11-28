import PostsTable from '@/components/admin/posts-table'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Plus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getPosts(filter?: string) {
	const where: any = {}

	if (filter === 'visible') {
		where.published = true
		where.publishedAt = { lte: new Date() }
	}

	return prisma.post.findMany({
		where,
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					name: true,
					email: true,
				},
			},
			category: {
				select: {
					name: true,
				},
			},
			_count: {
				select: {
					comments: true,
					ratings: true,
				},
			},
		},
	})
}

export default async function AdminPostsPage({
	searchParams,
}: {
	searchParams?: { filter?: string }
}) {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const filter = searchParams?.filter
	const posts = await getPosts(filter)

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6 flex justify-between items-center'>
					<Link
						href='/admin'
						className='inline-flex items-center text-sm text-gray-400 hover:text-gray-300'
					>
						<ArrowLeft size={16} className='mr-2' />
						Назад до адмінки
					</Link>
					<div className='flex items-center space-x-3'>
						<Link
							href='/admin/posts/create'
							className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
						>
							<Plus size={20} className='mr-2' />
							Створити пост
						</Link>

						<Link
							href='/admin/posts?filter=visible'
							className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								filter === 'visible'
									? 'bg-green-600 text-white'
									: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
							}`}
						>
							Опубліковано
						</Link>

						<Link
							href='/admin/posts'
							className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								!filter
									? 'bg-indigo-600 text-white'
									: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
							}`}
						>
							Усі пости
						</Link>
					</div>
				</div>

				<div className='bg-gray-800 shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700'>
						<h1 className='text-2xl font-bold text-white'>
							Управління публікаціями
						</h1>
					</div>

					<div className='p-6'>
						{/* client-side posts table handles deletion without full page reload */}
						<div>
							{/* @ts-expect-error Server Component -> Client dynamic import */}
							<PostsTable posts={posts} />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
