import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { handleLogout } from './auth';

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const Axios = axios.create({
	baseURL: apiBaseUrl,
});

Axios.interceptors.request.use((config) => {
	const token = localStorage.getItem('access');

	if (token && config.headers) {
		config.headers.Authorization = `JWT ${token}`;
	}

	return config;
});

const refreshAccessToken = async () => {
	const refresh = localStorage.getItem('refresh');

	if (!refresh) throw new Error('No refresh token');

	const res = await axios.post(`${apiBaseUrl}/auth/jwt/refresh`, {
		refresh,
	});

	const newAccess = res.data.access;
	const newRefresh = res.data.refresh ?? refresh;

	localStorage.setItem('access', newAccess);
	localStorage.setItem('refresh', newRefresh);

	return newAccess;
};

Axios.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest?._retry) {
			originalRequest._retry = true;

			try {
				const newAccess = await refreshAccessToken();

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `JWT ${newAccess}`;
				}

				return Axios(originalRequest);
			} catch (e) {
				handleLogout();
				return Promise.reject(e);
			}
		}
		return Promise.reject(error);
	}
);

export default Axios;
