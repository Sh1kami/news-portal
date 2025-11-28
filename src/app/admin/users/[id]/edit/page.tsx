import UserForm from '@/components/admin/user-form'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

type Props = {
	params: { id: string }
}

export default async function AdminUserEditPage({ params }: Props) {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'ADMIN') {
		redirect('/auth/signin')
	}

	const user = await prisma.user.findUnique({
		where: { id: params.id },
		select: { id: true, name: true, email: true, role: true },
	})

	if (!user) {
		redirect('/admin/users')
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-white'>
						Редагувати користувача
					</h1>
				</div>

				{/* UserForm is a client component */}
				{/* @ts-expect-error Server -> Client */}
				<UserForm id={user.id} initial={user} />
			</main>
			<Footer />
		</div>
	)
}
