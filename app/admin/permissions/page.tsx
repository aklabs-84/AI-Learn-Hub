'use client';

import { useAuth } from '@/components/FirebaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Search, Info } from 'lucide-react';
import { db } from '@/lib/firebase';

export default function PermissionsPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== 'admin') {
      router.push('/');
    }
  }, [role, loading, router]);

  if (loading || role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
          <ShieldCheck className="text-brand-primary" />
          접근 권한 설정
        </h1>
        <p className="text-text-muted mt-1 text-sm">관리자 추가 및 특정 기관 리소스에 대한 접근 권한을 관리합니다.</p>
      </header>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Info size={32} />
        </div>
        <div className="max-w-md">
          <h2 className="text-lg font-bold text-blue-900">맞춤형 권한 시스템 준비 중</h2>
          <p className="text-sm text-blue-700 mt-2">
            현재는 최고 관리자(Super Admin) 권한만 지원됩니다. 기관별 관리자 지정 및 특정 리소스 그룹화 기능이 곧 업데이트될 예정입니다.
          </p>
        </div>
      </div>

      <section className="bg-white border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle shadow-subtle">
        <div className="p-4 bg-bg-main flex items-center justify-between">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">현재 권한 보유자</h3>
          <button className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
            <UserPlus size={14} /> 사용자 초대
          </button>
        </div>
        <div className="p-8 text-center text-text-muted text-sm italic">
          최고 관리자 계정(mosebb@gmail.com) 외 현재 등록된 세부 권한이 없습니다.
        </div>
      </section>
    </div>
  );
}
