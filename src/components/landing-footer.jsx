import React from 'react';
import Link from 'next/link';
import { CookieSettingsButton } from '@/features/cookie-consent';
import {
  Kanban,
  Shield,
  Layers,
  Lock,
} from 'lucide-react';

export const LandingFooter = ({ className = '' }) => {
  return (
    <footer className={`bg-neutral-900 text-neutral-400 text-sm border-t border-neutral-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="/" className="flex items-center gap-2.5 text-white font-black text-xl tracking-tight">
              <div className="size-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
                K
              </div>
              <span>klanservicehub</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Enterprise agile project tracking, sprint planning, roadmap visualization, and team governance platform engineered for high-velocity software engineering teams.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
              <span>•</span>
              <span>Enterprise SLA 99.99%</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3 text-blue-400" />
                SOC-2 Type II
              </span>
            </div>
          </div>

          {/* Column 1: Solutions & Modules */}
          <div className="space-y-3 text-left">
            <p className="font-bold uppercase tracking-wider text-neutral-200 text-[11px] flex items-center gap-1.5">
              <Kanban className="size-3.5 text-blue-500" />
              <span>Solutions</span>
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/solutions/agile-sprint-planning" className="hover:text-white transition">
                  Agile Sprint Suite
                </Link>
              </li>
              <li>
                <Link href="/solutions/enterprise-roadmaps" className="hover:text-white transition">
                  Roadmap & Releases
                </Link>
              </li>
              <li>
                <Link href="/solutions/velocity-analytics" className="hover:text-white transition">
                  Velocity Analytics
                </Link>
              </li>
              <li>
                <Link href="/solutions/service-desk-management" className="hover:text-white transition">
                  JSM Service Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Trust */}
          <div className="space-y-3 text-left">
            <p className="font-bold uppercase tracking-wider text-neutral-200 text-[11px] flex items-center gap-1.5">
              <Shield className="size-3.5 text-emerald-500" />
              <span>Legal & Trust</span>
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition">
                  Security & Trust
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="hover:text-white transition">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <CookieSettingsButton className="text-neutral-400 hover:text-white transition" />
              </li>
              <li>
                <Link href="/landing#faq" className="hover:text-white transition">
                  FAQ & Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright sub-strip */}
        <div className="pt-12 mt-12 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© 2026 KLANSERVICEHUB.</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <CookieSettingsButton className="text-neutral-500 hover:text-white underline font-medium" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
