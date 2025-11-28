'use client'

import { useLanguage } from '@/contexts/language-context'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

interface AuthSectionProps {
	mobile?: boolean
	onItemClick?: () => void
}

export default function AuthSection({
	mobile = false,
	onItemClick,
}: AuthSectionProps) {
	const { data: session } = useSession()
	const { t } = useLanguage()

	if (mobile) {
		return (
			<>
				{session ? (
					<>
						<Link
							href='/profile'
							className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2'
							onClick={onItemClick}
						>
							{t('profile')}
						</Link>
						{session.user.role === 'ADMIN' && (
							<Link
								href='/admin'
								className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2'
								onClick={onItemClick}
							>
								{t('admin')}
							</Link>
						)}
						<button
							onClick={() => {
								signOut()
								onItemClick?.()
							}}
							className='w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-2'
						>
							{t('logout')}
						</button>
					</>
				) : (
					<>
						<Link
							href='/auth/signin'
							className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2'
							onClick={onItemClick}
						>
							{t('login')}
						</Link>
						<Link
							href='/auth/signup'
							className='block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2 font-medium'
							onClick={onItemClick}
						>
							{t('register')}
						</Link>
					</>
				)}
			</>
		)
	}

	return (
		<>
			{session ? (
				<div className='flex items-center space-x-4'>
					<Link
						href='/profile'
						className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
					>
						{t('profile')}
					</Link>
					{session.user.role === 'ADMIN' && (
						<Link
							href='/admin'
							className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
						>
							{t('admin')}
						</Link>
					)}
					<button
						onClick={() => signOut()}
						className='bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm'
					>
						{t('logout')}
					</button>
				</div>
			) : (
				<div className='flex items-center space-x-4'>
					<Link
						href='/auth/signin'
						className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
					>
						{t('login')}
					</Link>
					<Link
						href='/auth/signup'
						className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm'
					>
						{t('register')}
					</Link>
				</div>
			)}
		</>
	)
}
