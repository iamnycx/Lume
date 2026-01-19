import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { Button } from '../ui/button';
import type { PostDataType } from '@/types';
import Card from '../card';
import Axios from '@/lib/axios';
import { useState } from 'react';

export default function PostCard({ data }: { data: PostDataType }) {
	const [post, setPost] = useState<PostDataType>(data);
	const [loading, setLoading] = useState(false);

	const date = new Date(post.created_at).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	const handleReaction = async (value: 'LIKE' | 'DISLIKE') => {
		if (loading) return;
		try {
			setLoading(true);
			await Axios.post(`/api/posts/${post.id}/react/`, {
				response: value === 'LIKE' ? 'like' : 'dislike',
			});

			const res = await Axios.get(`/api/posts/${post.id}`);
			setPost(res.data);
		} catch (err) {
			console.error('Failed to react to post', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<div className='space-y-4'>
				<div className='flex justify-between items-baseline'>
					<div className='flex items-center gap-2'>
						<img
							src={post.author.avatar}
							alt={post.author.name.charAt(0)}
							className='bg-muted h-8 w-8 flex justify-center items-center rounded-full'
						/>
						<h1>{post.author.name}</h1>
					</div>
					<span className='text-xs'>Posted on: {date}</span>
				</div>

				<div className='w-full h-0.5 rounded-full bg-muted' />

				<p className='text-sm text-pretty tracking-tight'>
					{post.caption.slice(0, 380)}
				</p>

				<div>{post.image && <img src={post.image} />}</div>

				<div className='grid grid-cols-2 w-full gap-2 pt-4'>
					<Button
						onClick={() => handleReaction('LIKE')}
						variant='outline'
						disabled={loading}
						className='hover:text-green-400 transition-colors duration-300 ease-in-out'
					>
						<ThumbsUpIcon />
						<span>Like - {post.like_count.toString()}</span>
					</Button>
					<Button
						onClick={() => handleReaction('DISLIKE')}
						variant='outline'
						disabled={loading}
						className='hover:text-red-400 transition-colors duration-300 ease-in-out'
					>
						<ThumbsDownIcon />
						<span>Dislike - {post.dislike_count.toString()}</span>
					</Button>
				</div>
			</div>
		</Card>
	);
}
