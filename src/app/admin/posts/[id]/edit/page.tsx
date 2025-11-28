import PostForm from '@/components/admin/post-form'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

type Props = { params: { id: string } }

export default async function AdminPostEditPage({ params }: Props) {
	const session = await getServerSession(authOptions)
	if (!session || session.user.role !== 'ADMIN') redirect('/auth/signin')

	const post = await prisma.post.findUnique({
		where: { id: params.id },
		include: { category: true },
	})
	if (!post) redirect('/admin/posts')

	return (
		<div className='min-h-screen bg-gray-900'>
			<Header />
			<main className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-white'>Редагувати пост</h1>
				</div>

				{/* @ts-expect-error Server -> Client */}
				<PostForm
					id={post.id}
					initial={{
						title: post.title,
						content: post.content,
						categoryId: post.categoryId,
						published: post.published,
						image: post.image,
					}}
				/>
			</main>
			<Footer />
		</div>
	)
}
