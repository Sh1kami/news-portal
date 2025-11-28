import { AuthProvider } from '@/components/providers/auth-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
	title: 'News Portal',
	description: 'Сучасний новинний портал',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='uk' className='dark'>
			<body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	)
}
