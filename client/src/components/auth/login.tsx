import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Card from '../card';
import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Axios from '@/lib/axios';

export default function Login({ setActiveCard }: { setActiveCard: Function }) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			const res = await Axios.post('/auth/jwt/create', {
				email,
				password,
			});

			localStorage.setItem('access', res.data.access);
			localStorage.setItem('refresh', res.data.refresh);

			navigate('/feed');
		} catch (err) {
			console.log('Login failed', err);
			toast.error('Invalid email or password');
		}
	};

	return (
		<div className='flex h-screen items-center'>
			<Card className='mx-auto'>
				<h1
					className='text-2xl mb-8
            text-center font-bold'
				>
					Login with Your Account
				</h1>
				<div>
					<Label htmlFor='email' className='mb-2 mt-4'>
						Email Address
					</Label>
					<Input
						id='email'
						placeholder='i.e. waynebruce@mail.com'
						type='email'
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Label htmlFor='password' className='mb-2 mt-4'>
						Password
					</Label>
					<Input
						id='password'
						placeholder='secure password'
						type='password'
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className='flex flex-col items-center gap-4 mt-8'>
						<Button className='w-full' onClick={handleSubmit}>
							Login
						</Button>

						<p className='flex items-center text-sm gap-2'>
							<span>{"Don't have account?"}</span>
							<span
								onClick={() => setActiveCard('signup')}
								className='underline cursor-pointer hover:text-primary transition-colors duration-300 ease-in-out'
							>
								Create Account
							</span>
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
