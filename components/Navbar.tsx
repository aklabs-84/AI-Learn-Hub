'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/FirebaseProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, LogOut, LogIn, GraduationCap, Library, Building2, ShieldCheck, BarChart3 } from 'lucide-react';

export function Navbar() {
  const { user, role } = useAuth();
  const pathname = usePathname();

  const handleSignOut = () => signOut(auth);

  const navItems = [
    { name: '학습 자료실', icon: Library, href: '/', active: pathname === '/' },
    ...(role === 'admin' ? [
      { name: '학습 자료 관리', icon: LayoutDashboard, href: '/admin', active: pathname === '/admin' },
      { name: '참여 기관 관리', icon: Building2, href: '#', active: false },
      { name: '접근 권한 설정', icon: ShieldCheck, href: '#', active: false },
      { name: '사용 통계', icon: BarChart3, href: '#', active: false },
    ] : [])
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-sidebar-bg border-r border-border-subtle flex flex-col py-8 z-50">
      <div className="px-6 mb-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-text-main tracking-tight">AI-Learn Hub</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
              ${item.active 
                ? 'bg-brand-accent text-brand-primary font-semibold border-r-4 border-brand-primary rounded-r-none' 
                : 'text-text-muted hover:bg-gray-50 hover:text-text-main'}
            `}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-3 border-t border-border-subtle pt-6">
        {user ? (
          <div className="space-y-1">
            <div className="px-4 py-2 mb-2">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Authenticated</p>
              <p className="text-sm font-medium text-text-main truncate">{user.email}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-red-50 hover:text-red-500 transition-all rounded-xl"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        ) : (
          <Link 
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-dark transition-all rounded-xl shadow-lg shadow-blue-100"
          >
            <LogIn size={18} />
            관리자 로그인
          </Link>
        )}
      </div>
    </aside>
  );
}
