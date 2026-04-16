'use client';

import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ResourceCard } from '@/components/ResourceCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  guideUrl: string;
  passwordHash: string;
  institutionId: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
}

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [institutions, setInstitutions] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to institutions first to resolve names
    const instUnsubscribe = onSnapshot(collection(db, 'institutions'), (snapshot) => {
      const instMap: Record<string, string> = {};
      snapshot.docs.forEach(doc => {
        instMap[doc.id] = doc.data().name;
      });
      setInstitutions(instMap);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'institutions');
    });

    // Listen to resources
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const resUnsubscribe = onSnapshot(q, (snapshot) => {
      const resData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(resData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'resources');
    });

    return () => {
      instUnsubscribe();
      resUnsubscribe();
    };
  }, []);

  const filteredResources = resources.filter(res => {
    return res.title.toLowerCase().includes(search.toLowerCase()) || 
           (res.description && res.description.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <main className="p-10 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="title-group">
          <h1 className="text-3xl font-display font-bold text-text-main mb-1">AI 학습 리소스 센터</h1>
          <p className="text-sm text-text-muted">기관 및 기업별로 구성된 맞춤형 AI 활용 가이드를 확인하세요.</p>
        </div>
        
        <div className="relative w-full md:w-[320px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-primary shadow-sm transition-all"
          />
        </div>
      </header>

      {/* Grid Content */}
      <section>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-10 h-10 border-4 border-brand-accent border-t-brand-primary rounded-full animate-spin" />
            <p className="text-sm text-text-muted font-medium">리소스 로딩 중...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  thumbnailUrl={resource.thumbnailUrl}
                  guideUrl={resource.guideUrl}
                  passwordHash={resource.passwordHash}
                  institutionName={institutions[resource.institutionId] || '교육 기관'}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-40 bg-white border border-dashed border-border-subtle rounded-[2rem]">
            <p className="text-lg text-text-muted">검색 결과가 없습니다.</p>
          </div>
        )}
      </section>

      {/* Suggestion Section matching theme HTML */}
      <section className="mt-auto p-8 bg-white border border-border-subtle rounded-2xl shadow-subtle">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-brand-primary" size={20} />
          <h3 className="text-lg font-display font-bold text-text-main">서비스 제안 및 향후 계획</h3>
        </div>
        <ul className="text-sm text-text-muted space-y-3 list-disc pl-5">
          <li><strong>개인화 학습 진행도:</strong> 각 가이드에 &lsquo;수강 완료&rsquo; 체크 기능을 넣어 사용자의 학습 이력을 트래킹합니다.</li>
          <li><strong>비밀번호 만료 정책:</strong> 특정 기간(예: 수업 종료 후)이 지나면 자동으로 접속 권한을 회수하는 기능을 추가합니다.</li>
          <li><strong>대시보드 인사이트:</strong> 관리자가 어떤 기관의 가이드가 가장 많이 조회되었는지 시각화 데이터를 제공합니다.</li>
        </ul>
      </section>
    </main>
  );
}
