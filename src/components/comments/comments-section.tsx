'use client'

import { Edit, MessageCircle, Save, Send, Trash2, X } from 'lucide-react'
import { Session } from 'next-auth'
import { useState } from 'react'

interface Comment {
	id: string
	content: string
	createdAt: Date
	updatedAt: Date
	author: {
		id: string
		name: string | null
		email: string
	}
}

interface CommentsSectionProps {
	postId: string
	comments: Comment[]
	session: Session | null
}

export function CommentsSection({
	postId,
	comments,
	session,
}: CommentsSectionProps) {
	const [localComments, setLocalComments] = useState<Comment[]>(comments)
	const [newComment, setNewComment] = useState('')
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
	const [editContent, setEditContent] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newComment.trim() || !session) return

		setIsSubmitting(true)
		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postId,
					content: newComment,
				}),
			})

			if (response.ok) {
				const created = await response.json()
				setNewComment('')
				// prepend created comment to local list
				setLocalComments(prev => [created, ...prev])
			}
		} catch (error) {
			console.error('Error submitting comment:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleEdit = (comment: Comment) => {
		setEditingCommentId(comment.id)
		setEditContent(comment.content)
	}

	const handleCancelEdit = () => {
		setEditingCommentId(null)
		setEditContent('')
	}

	const handleSaveEdit = async (commentId: string) => {
		if (!editContent.trim()) return

		setIsSubmitting(true)
		try {
			const response = await fetch(`/api/comments/${commentId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: editContent,
				}),
			})

			if (response.ok) {
				const updated = await response.json()
				setEditingCommentId(null)
				setEditContent('')
				setLocalComments(prev =>
					prev.map(c => (c.id === updated.id ? updated : c))
				)
			}
		} catch (error) {
			console.error('Error updating comment:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (commentId: string) => {
		if (!confirm('Ви впевнені, що хочете видалити цей коментар?')) return

		try {
			const response = await fetch(`/api/comments/${commentId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setLocalComments(prev => prev.filter(c => c.id !== commentId))
			}
		} catch (error) {
			console.error('Error deleting comment:', error)
		}
	}

	// Проверяем права на редактирование/удаление комментария
	const canModifyComment = (comment: Comment) => {
		if (!session) return false
		return (
			session.user.role === 'ADMIN' || session.user.id === comment.author.id
		)
	}

	return (
		<div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6'>
			<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
				<MessageCircle size={24} className='mr-2' />
				Коментарі ({localComments.length})
			</h2>

			{/* Форма добавления комментария */}
			{session ? (
				<form onSubmit={handleSubmit} className='mb-8'>
					<textarea
						value={newComment}
						onChange={e => setNewComment(e.target.value)}
						placeholder='Залиште ваш коментар...'
						rows={4}
						className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
					<div className='mt-2 flex justify-end'>
						<button
							type='submit'
							disabled={isSubmitting || !newComment.trim()}
							className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
						>
							<Send size={16} className='mr-2' />
							{isSubmitting ? 'Відправка...' : 'Відправити'}
						</button>
					</div>
				</form>
			) : (
				<div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
					<p className='text-blue-800 dark:text-blue-200'>
						Будь ласка,{' '}
						<a href='/auth/signin' className='font-medium underline'>
							увійдіть
						</a>{' '}
						щоб залишити коментар.
					</p>
				</div>
			)}

			{/* Список комментариев */}
			<div className='space-y-6'>
				{localComments.length === 0 ? (
					<p className='text-gray-500 dark:text-gray-400 text-center py-8'>
						Ще немає коментарів. Будьте першим!
					</p>
				) : (
					localComments.map(comment => (
						<div
							key={comment.id}
							className='border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0'
						>
							<div className='flex items-start justify-between mb-2'>
								<div className='flex items-center'>
									<div className='bg-gray-300 dark:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center mr-3'>
										<span className='text-sm font-medium text-gray-600 dark:text-gray-200'>
											{comment.author.name?.charAt(0) ||
												comment.author.email.charAt(0).toUpperCase()}
										</span>
									</div>
									<div>
										<p className='font-medium text-gray-900 dark:text-gray-100'>
											{comment.author.name || 'Анонімний користувач'}
										</p>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											{new Date(comment.createdAt).toLocaleDateString('uk-UA')}
											{comment.updatedAt > comment.createdAt && (
												<span className='text-gray-400 dark:text-gray-500 ml-1'>
													(ред.)
												</span>
											)}
										</p>
									</div>
								</div>

								{/* Кнопки управления для автора комментария или админа */}
								{canModifyComment(comment) && (
									<div className='flex space-x-2'>
										{editingCommentId === comment.id ? (
											<>
												<button
													onClick={() => handleSaveEdit(comment.id)}
													disabled={isSubmitting}
													className='p-1 text-green-600 hover:text-green-700 disabled:opacity-50'
												>
													<Save size={16} />
												</button>
												<button
													onClick={handleCancelEdit}
													className='p-1 text-gray-600 dark:text-gray-200 hover:text-gray-700'
												>
													<X size={16} />
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => handleEdit(comment)}
													className='p-1 text-blue-600 hover:text-blue-700'
												>
													<Edit size={16} />
												</button>
												<button
													onClick={() => handleDelete(comment.id)}
													className='p-1 text-red-600 hover:text-red-700'
												>
													<Trash2 size={16} />
												</button>
											</>
										)}
									</div>
								)}
							</div>

							{editingCommentId === comment.id ? (
								<div className='ml-11'>
									<textarea
										value={editContent}
										onChange={e => setEditContent(e.target.value)}
										rows={3}
										className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
									/>
								</div>
							) : (
								<p className='text-gray-700 dark:text-gray-200 ml-11'>
									{comment.content}
								</p>
							)}
						</div>
					))
				)}
			</div>
		</div>
	)
}
