'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Lock, CheckCircle2, X } from 'lucide-react';

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  guideUrl: string;
  passwordHash: string;
  institutionName: string;
}

export function ResourceCard({ title, description, thumbnailUrl, guideUrl, passwordHash, institutionName }: ResourceCardProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleVerify = () => {
    if (passwordInput === passwordHash) {
      window.open(guideUrl, '_blank');
      setShowPasswordModal(false);
      setPasswordInput('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group relative bg-white border border-border-subtle rounded-xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-bold transition-all duration-300 flex flex-col"
        onClick={() => setShowPasswordModal(true)}
      >
        <div className="h-[140px] relative bg-[#e0e0e0] flex items-center justify-center overflow-hidden">
          {thumbnailUrl && !imgError ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ddd] bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%)] bg-[length:20px_20px]">
              <div className="text-4xl font-display font-bold text-gray-300">
                {institutionName.charAt(0)}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex-1">
          <div className="text-[11px] uppercase font-bold text-brand-primary mb-2 tracking-wider">
            {institutionName}
          </div>
          <h3 className="font-sans font-bold text-base mb-2 text-text-main group-hover:text-brand-primary transition-colors">
            {title}
          </h3>
          <p className="text-[13px] text-text-muted line-clamp-2 leading-relaxed">
            {description || '상세 학습 가이드를 확인하려면 비밀번호를 입력하세요.'}
          </p>
        </div>

        <div className="px-4 py-3 border-t border-border-subtle flex items-center justify-between bg-white">
          <span className="text-xs text-[#d93025] flex items-center gap-1 font-medium">
            <Lock size={12} />
            잠김 (비밀번호 필요)
          </span>
          <div className="px-3 py-1 border border-border-subtle rounded text-[12px] text-text-muted font-medium group-hover:bg-brand-accent group-hover:text-brand-primary group-hover:border-brand-primary transition-all">
            보기
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-bold overflow-hidden border border-border-subtle"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 bg-brand-accent text-brand-primary rounded-xl flex items-center justify-center mb-4">
                  <Lock size={24} />
                </div>
                <h2 className="text-xl font-display font-bold mb-1 text-text-main">콘텐츠 보호됨</h2>
                <p className="text-sm text-text-muted">이 학습 자료를 보려면 관리자가 발급한 6자리 비밀번호를 입력하세요.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="비밀번호 입력"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  className={`w-full px-4 py-3 bg-bg-main border rounded-lg outline-none transition-all font-mono text-center text-xl tracking-[0.4em] ${
                    error ? 'border-red-500 bg-red-50 animate-shake' : 'border-border-subtle focus:border-brand-primary focus:ring-2 focus:ring-brand-accent'
                  }`}
                  autoFocus
                />
                
                <button
                  onClick={handleVerify}
                  className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-blue-100 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <CheckCircle2 size={18} />
                  접근 권한 확인
                </button>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center text-red-500 text-[13px] font-medium"
                >
                  비밀번호가 올바르지 않습니다. 다시 입력해 주세요.
                </motion.p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
