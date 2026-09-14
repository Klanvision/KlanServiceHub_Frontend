import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const PageLoader = ({ message = 'Initializing KlanServiceHub...' }) => {
  return (
    <div className="min-h-screen w-full bg-[#070b14] flex flex-col items-center justify-center p-6 text-slate-100 select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-96 bg-indigo-600/15 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-xs">
        {/* Animated Brand Logo */}
        <div className="relative flex items-center justify-center size-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl shadow-xl shadow-blue-500/25 ring-1 ring-white/20 animate-bounce">
          <span>K</span>
          <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-400 border-2 border-[#070b14] rounded-full" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-base text-white tracking-tight">KlanServiceHub</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <Loader2 className="size-3.5 animate-spin text-blue-400" />
            <span>{message}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

