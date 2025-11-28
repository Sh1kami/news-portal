import CategoryForm from '@/components/admin/category-form'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AdminCategoryCreatePage() {
	const session = await getServerSession(authOptions)
	if (!session || session.user.role !== 'ADMIN') redirect('/auth/signin')

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-white'>Додати категорію</h1>
				</div>

				{/* @ts-expect-error Server -> Client */}
				<CategoryForm />
			</main>
			<Footer />
		</div>
	)
}
