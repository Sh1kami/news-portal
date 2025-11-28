'use client'

import { Menu } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export function Header() {
	const { data: session } = useSession()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<header className='bg-gray-800 shadow-sm border-b border-gray-700'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center space-x-2'>
						<span className='text-xl sm:text-2xl font-bold text-blue-400'>
							NewsPortal
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex space-x-8'>
						<Link
							href='/'
							className='text-gray-300 hover:text-blue-400 transition-colors'
						>
							Головна
						</Link>
						<Link
							href='/news'
							className='text-gray-300 hover:text-blue-400 transition-colors'
						>
							Новини
						</Link>
						<Link
							href='/categories'
							className='text-gray-300 hover:text-blue-400 transition-colors'
						>
							Категорії
						</Link>
					</nav>

					{/* Desktop User actions */}
					<div className='hidden md:flex items-center space-x-4'>
						{/* Auth buttons */}
						{session ? (
							<div className='flex items-center space-x-4'>
								<Link
									href='/profile'
									className='text-gray-300 hover:text-blue-400 transition-colors'
								>
									Профіль
								</Link>
								{session.user.role === 'ADMIN' && (
									<Link
										href='/admin'
										className='text-gray-300 hover:text-blue-400 transition-colors'
									>
										Адмін
									</Link>
								)}
								<button
									onClick={() => signOut()}
									className='bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm'
								>
									Вийти
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-4'>
								<Link
									href='/auth/signin'
									className='text-gray-300 hover:text-blue-400 transition-colors'
								>
									Увійти
								</Link>
								<Link
									href='/auth/signup'
									className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm'
								>
									Реєстрація
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden flex items-center space-x-2'>
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className='p-2 rounded-lg bg-gray-700 text-gray-300 hover:text-white transition-colors'
						>
							<Menu size={20} />
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div className='md:hidden py-4 border-t border-gray-700'>
						<nav className='flex flex-col space-y-4'>
							<Link
								href='/'
								className='text-gray-300 hover:text-blue-400 transition-colors py-2'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Головна
							</Link>
							<Link
								href='/news'
								className='text-gray-300 hover:text-blue-400 transition-colors py-2'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Новини
							</Link>
							<Link
								href='/categories'
								className='text-gray-300 hover:text-blue-400 transition-colors py-2'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Категорії
							</Link>

							<div className='pt-4 border-t border-gray-700'>
								{session ? (
									<>
										<Link
											href='/profile'
											className='block text-gray-300 hover:text-blue-400 transition-colors py-2'
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Профіль
										</Link>
										{session.user.role === 'ADMIN' && (
											<Link
												href='/admin'
												className='block text-gray-300 hover:text-blue-400 transition-colors py-2'
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Адмін
											</Link>
										)}
										<button
											onClick={() => {
												signOut()
												setIsMobileMenuOpen(false)
											}}
											className='w-full text-left text-red-400 hover:text-red-300 transition-colors py-2'
										>
											Вийти
										</button>
									</>
								) : (
									<>
										<Link
											href='/auth/signin'
											className='block text-gray-300 hover:text-blue-400 transition-colors py-2'
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Увійти
										</Link>
										<Link
											href='/auth/signup'
											className='block text-blue-400 hover:text-blue-300 transition-colors py-2 font-medium'
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Реєстрація
										</Link>
									</>
								)}
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	)
}
