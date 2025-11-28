import UsersTable from '@/components/admin/users-table'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getUsers() {
	return prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
			_count: {
				select: {
					posts: true,
					comments: true,
				},
			},
		},
	})
}

export default async function AdminUsersPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const users = await getUsers()

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<Link
						href='/admin'
						className='inline-flex items-center text-sm text-gray-400 hover:text-gray-300'
					>
						<ArrowLeft size={16} className='mr-2' />
						Назад до адмінки
					</Link>
				</div>

				{/* Render users table client-side so actions work without full page refresh */}
				{/* @ts-expect-error Server -> Client */}
				<UsersTable users={users} />
			</main>
			<Footer />
		</div>
	)
}
