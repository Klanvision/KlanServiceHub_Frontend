'use client';
import React from 'react';
import { ArrowLeft, FileQuestion, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LandingFooter } from '@/components/landing-footer';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-[#070b14] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 py-24">
        <div className="w-full max-w-xl rounded-3xl border border-slate-700/60 bg-slate-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          <div className="mx-auto size-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-950/40">
            <FileQuestion className="size-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              <Search className="size-3.5" />
              <span>HTTP 404 &bull; Resource Missing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              The requested page or ticket URL could not be located in this workspace. It may have been moved, renamed, or deleted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-xs font-bold text-slate-200 transition active:scale-[0.98]"
            >
              <ArrowLeft className="size-4" />
              <span>Go Back</span>
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98]"
            >
              <Home className="size-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default NotFoundPage;
