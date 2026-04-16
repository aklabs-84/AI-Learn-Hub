'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/components/FirebaseProvider';
import { LogIn, ShieldAlert, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-main relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-border-subtle rounded-2xl p-10 shadow-bold text-center"
      >
        <div className="w-16 h-16 bg-brand-accent text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
          <GraduationCap size={40} />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-text-main mb-3">관리자 로그인</h1>
        <p className="text-text-muted mb-10 leading-relaxed">
          AI 학습 자료 관리를 위해 <br/>
          인증된 Google 계정으로 로그인해 주세요.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isSigningIn}
          className="w-full py-4 px-6 bg-white border border-border-subtle rounded-xl font-bold flex items-center justify-center gap-4 hover:bg-bg-main transition-all group disabled:opacity-50 shadow-sm"
        >
          <Image 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            width={24} 
            height={24} 
          />
          <span className="text-text-main">Google 계정으로 계속하기</span>
        </button>

        <p className="mt-8 text-xs text-text-muted leading-loose">
          관리자 권한이 있는 이메일만 대시보드 접근이 가능합니다. <br/>
          협업 문의: <span className="font-bold text-brand-primary">mosebb@gmail.com</span>
        </p>
      </motion.div>
      
      <Link href="/" className="mt-8 text-sm text-brand-primary font-semibold hover:underline flex items-center gap-2">
        ← 메인 페이지로 돌아가기
      </Link>
    </main>
  );
}
