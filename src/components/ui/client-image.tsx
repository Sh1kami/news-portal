'use client'

type Props = {
	src: string | null
	alt: string
	className?: string
}

export default function ClientImage({ src, alt, className }: Props) {
	return (
		<div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden'>
			<img
				src={src || '/fallback.jpg'}
				alt={alt}
				className={className}
				onError={e => {
					e.currentTarget.src = '/fallback.jpg'
				}}
			/>
		</div>
	)
}
