'use client';

import { useAuth } from '@/components/FirebaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building2, Plus, Search, Trash2 } from 'lucide-react';
import { collection, query, getDocs, deleteDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Institution {
  id: string;
  name: string;
  createdAt: any;
}

export default function InstitutionsPage() {
  const { role, loading } = useAuth();
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!loading && role !== 'admin') {
      router.push('/');
    }
  }, [role, loading, router]);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const q = query(collection(db, 'institutions'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Institution));
      setInstitutions(list);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'institutions'), {
        name: setNewName.trim() === '' ? '새 기관' : newName,
        createdAt: serverTimestamp(),
      });
      setNewName('');
      fetchInstitutions();
    } catch (error) {
      console.error('Error adding institution:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 기관을 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'institutions', id));
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
    }
  };

  if (loading || role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
          <Building2 className="text-brand-primary" />
          참여 기관 관리
        </h1>
        <p className="text-text-muted mt-1 text-sm">학습 리소스를 등록할 수 있는 교육 기관 및 기업을 관리합니다.</p>
      </header>

      <section className="bg-white border border-border-subtle rounded-2xl p-6 shadow-subtle">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input 
            type="text" 
            placeholder="새 기관 이름 입력 (예: 한국초등학교)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-3 bg-bg-main border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={isAdding || !newName.trim()}
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={18} />
            기관 추가
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="text-center py-12 text-text-muted">불러오는 중...</div>
          ) : institutions.length === 0 ? (
            <div className="text-center py-12 bg-bg-main border border-dashed border-border-subtle rounded-2xl text-text-muted">
              등록된 기관이 없습니다.
            </div>
          ) : (
            institutions.map((inst) => (
              <motion.div 
                key={inst.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-border-subtle p-5 rounded-2xl flex items-center justify-between group hover:border-brand-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center text-brand-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main">{inst.name}</h3>
                    <p className="text-xs text-text-muted">ID: {inst.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(inst.id)}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
