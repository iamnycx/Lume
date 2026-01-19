import type { Key } from 'react';

export type PostDataType = {
	id: Key;
	caption: string;
	like_count: number;
	dislike_count: number;
	created_at: string;
	author: {
		id: Key;
		name: string;
		avatar: string;
	};
	image: string;
};

export type PostMetaData = {
	count: number;
	next: string | null;
	previous: string | null;
};

export type UserPostsType = {
	id: Key;
	caption: string;
	like_count: number;
	created_at: string;
	dislike_count: number;
	image: string;
}[];

export type UserPostDataType = {
	id: Key;
	caption: string;
	like_count: number;
	dislike_count: number;
	created_at: string;
	image: string;
};

export type UserDetailType = {
	avatar: string;
	birth_date: string;
	date_joined: string;
	email: string;
	id: Key;
	name: string;
    gender: string;
	posts: UserPostsType;
};
