"use client";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { parseJwt, getInitials } from "@/lib/utils/auth";

export default function UserProfileCard() {
  const { user, token, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const tokenData = parseJwt(token);
  const displayName = tokenData?.name || user?.displayName || "Kullanıcı";
  const initials = getInitials(displayName);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sadece Initials İçeren Buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C6A2]/20 to-[#0085FF]/20 border border-white/10 transition-all hover:border-[#00C6A2]/50 active:scale-95 outline-none"
      >
        <span className="text-xs font-bold text-[#00C6A2] tracking-wider">
          {initials}
        </span>
        
        {/* Opsiyonel: Hover durumunda çok küçük bir nokta göstererek aktifliği belli edebiliriz */}
        <div className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
      </button>

      {/* Açılır Menü */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-[#121212] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
          
          {/* Kullanıcı Bilgileri Bölümü (Eskiden butonda olan kısımlar buraya geldi) */}
          <div className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold uppercase text-white tracking-wide">
                {displayName}
              </span>
              <span className="text-[10px] text-[#00C6A2] font-mono uppercase tracking-[0.15em] mt-1">
                {user.role || "Member"}
              </span>
              <span className="text-[11px] text-white/40 truncate mt-1">
                {user.email}
              </span>
            </div>
          </div>

          {/* Menü Linkleri */}
          {/* <div className="p-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all group">
              <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#00C6A2]/10 transition-colors">
                <svg className="w-4 h-4 text-white/40 group-hover:text-[#00C6A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Profil Detayları
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all group">
              <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#0085FF]/10 transition-colors">
                <svg className="w-4 h-4 text-white/40 group-hover:text-[#0085FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Hesap Ayarları
            </button>
          </div> */}

          {/* Çıkış Bölümü */}
          <div className="p-2 border-t border-white/[0.05]">
            <button 
              onClick={() => logout?.()} 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              Güvenli Çıkış
            </button>
          </div>
        </div>
      )}
    </div>
  );
}