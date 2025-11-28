'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface RatingSectionProps {
	postId: string
	userRating: number | null
	averageRating: number
	totalRatings: number
}

export function RatingSection({
	postId,
	userRating,
	averageRating,
	totalRatings,
}: RatingSectionProps) {
	const [currentRating, setCurrentRating] = useState(userRating)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleRating = async (rating: number) => {
		if (isSubmitting) return

		setIsSubmitting(true)
		try {
			const response = await fetch('/api/ratings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postId,
					value: rating,
				}),
			})

			if (response.ok) {
				setCurrentRating(rating)
				// Можно обновить страницу или использовать state для обновления averageRating
				window.location.reload()
			}
		} catch (error) {
			console.error('Error submitting rating:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='flex items-center justify-between'>
			<div>
				<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
					Оцініть цю новину
				</h3>
				<div className='flex items-center space-x-1'>
					{[1, 2, 3, 4, 5].map(star => (
						<button
							key={star}
							onClick={() => handleRating(star)}
							disabled={isSubmitting}
							className={`p-1 ${
								currentRating && star <= currentRating
									? 'text-yellow-500'
									: 'text-gray-300 dark:text-gray-600'
							} hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<Star
								size={24}
								fill={
									currentRating && star <= currentRating
										? 'currentColor'
										: 'none'
								}
							/>
						</button>
					))}
				</div>
			</div>

			<div className='text-right'>
				<div className='text-2xl font-bold text-gray-900 dark:text-white'>
					{averageRating.toFixed(1)}
				</div>
				<div className='text-sm text-gray-500 dark:text-gray-400'>
					{totalRatings} оцінок
				</div>
			</div>
		</div>
	)
}
