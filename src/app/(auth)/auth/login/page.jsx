'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/store/authStore';
import { ROUTES } from '@/lib/constants/routes';
import { loginSchema } from '@/lib/validations/auth';

const inputBase = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder:text-gray-400';
const inputError = 'border-red-500 focus:ring-red-500';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => {
    setUser({ id: '1', email: data.email, name: data.email.split('@')[0] });
    setToken('mock-jwt-token');
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={`${inputBase} ${errors.email ? inputError : ''}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`${inputBase} ${errors.password ? inputError : ''}`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            Log in
          </button>
          <p className="text-sm text-gray-500 text-center">Mock auth — valid credentials required</p>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-indigo-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
