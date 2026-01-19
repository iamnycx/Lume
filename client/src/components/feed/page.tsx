import PostCard from './post-card';
import React from 'react';
import { type PostMetaData, type PostDataType } from '@/types';
import Axios from '@/lib/axios';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Feed() {
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [data, setData] = React.useState<PostDataType[]>([]);
	const [metaData, setMetaData] = React.useState<PostMetaData>();

	const fetchPostData = async (page: number) => {
		const r = await Axios.get(`/api/posts/?page=${page}`);
		setData(r.data.results);
		setMetaData(r.data);
	};

	React.useEffect(() => {
		fetchPostData(currentPage);
	}, [currentPage]);

	const handleNextPage = () => {
		if (!metaData?.next) return;
		const url = new URL(metaData.next);
		const page = url.searchParams.get('page');
		setCurrentPage(Number(page));
	};
	const handlePreviousPage = () => {
		if (!metaData?.previous) return;
		const url = new URL(metaData.previous);
		const page = url.searchParams.get('page');
		setCurrentPage(Number(page) || 1);
	};

	return (
		<div className='py-32 space-y-16'>
			<h1 className='text-2xl fixed top-10 left-32'>All posts</h1>
			<div className='grid gap-16 mx-auto w-fit'>
				{data?.map((d) => (
					<PostCard data={d} key={d.id} />
				))}
			</div>
			<div className='flex items-center gap-4 mx-auto max-w-fit'>
				<Button
					variant='ghost'
					onClick={handlePreviousPage}
					disabled={!metaData?.previous}
				>
					<ChevronLeft />
					Previous
				</Button>
				{}
				<Button variant='outline'>{currentPage}</Button>
				<Button
					variant='ghost'
					onClick={handleNextPage}
					disabled={!metaData?.next}
				>
					Next
					<ChevronRight />
				</Button>
			</div>
		</div>
	);
}
