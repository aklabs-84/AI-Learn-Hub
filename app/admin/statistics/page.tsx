'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/FirebaseProvider';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function StatisticsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/login');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    if (role === 'admin') {
      const q = query(collection(db, 'resources'), orderBy('views', 'desc'), limit(10));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const stats = snapshot.docs.map(doc => ({
          name: doc.data().title.length > 10 ? doc.data().title.substring(0, 10) + '...' : doc.data().title,
          fullName: doc.data().title,
          views: doc.data().views || 0,
        }));
        setData(stats);
      });
      return () => unsubscribe();
    }
  }, [role]);

  if (loading || role !== 'admin') return null;

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <main className="p-10 flex flex-col gap-8 bg-bg-main min-h-screen">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-accent text-brand-primary rounded-xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-main">콘텐츠 사용 통계</h1>
        </div>
        <p className="text-sm text-text-muted">학습 리소스별 조회수를 기반으로 한 인기 콘텐츠 현황입니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Summary Cards */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-subtle border border-border-subtle">
            <div className="flex items-center gap-2 mb-4 text-brand-primary">
              <TrendingUp size={20} />
              <h2 className="text-sm font-bold uppercase tracking-wider">가장 많이 본 자료</h2>
            </div>
            {data.length > 0 ? (
              <div className="space-y-4">
                {data.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-bg-main rounded-xl border border-border-subtle hover:border-brand-primary transition-all group">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-bold text-brand-primary uppercase mb-1">Rank {idx + 1}</span>
                      <span className="text-sm font-bold text-text-main truncate" title={item.fullName}>{item.fullName}</span>
                    </div>
                    <div className="text-xl font-mono font-black text-brand-primary group-hover:scale-110 transition-transform">
                      {item.views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-10 italic">상세 데이터가 없습니다.</p>
            )}
          </section>

          <section className="bg-brand-primary p-6 rounded-2xl shadow-bold text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">총 조회수</h3>
              <div className="text-4xl font-black mb-4">
                {data.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                전체 학습 자료의 누적 조회수입니다. <br/>
                학습 진행도를 높이기 위해 인기 자료를 검토하세요.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <BarChart3 size={120} />
            </div>
          </section>
        </div>

        {/* Bar Chart Section */}
        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-2xl shadow-subtle border border-border-subtle h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-text-main">조회수 분석 차트</h2>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main px-3 py-1.5 rounded-full border border-border-subtle">
                <Info size={14} />
                상위 10개 항목
              </div>
            </div>

            <div className="flex-1 min-h-[400px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                      labelStyle={{ color: '#1e293b', marginBottom: '4px', fontWeight: 'bold' }}
                      formatter={(value: any, name: string, props: any) => [value, props.payload.fullName]}
                    />
                    <Bar dataKey="views" radius={[6, 6, 0, 0]} barSize={40}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-bg-main rounded-xl animate-pulse flex items-center justify-center">
                  <p className="text-text-muted text-sm">차트 로딩 중...</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
