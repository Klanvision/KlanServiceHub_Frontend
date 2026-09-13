import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Info, Database } from 'lucide-react';
import { CookieToggle } from './cookie-toggle';

export const CookieCategoryItem = ({
  category,
  enabled,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRequired = category.required;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-neutral-300">
      {/* Category Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`size-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isRequired
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : enabled
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
            }`}
          >
            {isRequired ? (
              <Shield className="size-4" />
            ) : (
              <Database className="size-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                {category.name}
              </h4>

              {isRequired ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  Always Active
                </span>
              ) : enabled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500 border border-neutral-200">
                  Inactive
                </span>
              )}
            </div>

            <p id={`${category.id}-desc`} className="mt-1 text-xs text-neutral-600 leading-relaxed">
              {category.summary}
            </p>
          </div>
        </div>

        {/* Action Toggle or Always Active Badge */}
        <div className="flex items-center justify-end shrink-0 pl-12 sm:pl-0">
          {isRequired ? (
            <span className="text-xs font-semibold text-neutral-400 select-none">
              Mandatory
            </span>
          ) : (
            <CookieToggle
              id={`toggle-${category.id}`}
              checked={enabled}
              onChange={onChange}
              disabled={isRequired}
              description={category.summary}
            />
          )}
        </div>
      </div>

      {/* Expandable Details Button */}
      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 rounded"
        >
          <span>{isExpanded ? 'Hide Details & Cookie List' : `Learn More & Cookies Used (${category.cookies?.length || 0})`}</span>
          {isExpanded ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600 animate-in fade-in-50 duration-200">
          <p className="leading-relaxed text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
            {category.details}
          </p>

          {category.cookies && category.cookies.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
              <table className="min-w-full divide-y divide-neutral-200 text-left text-[11px]">
                <thead className="bg-neutral-50 font-bold text-neutral-700">
                  <tr>
                    <th scope="col" className="px-3 py-2">Cookie Name</th>
                    <th scope="col" className="px-3 py-2">Provider</th>
                    <th scope="col" className="px-3 py-2">Purpose</th>
                    <th scope="col" className="px-3 py-2">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {category.cookies.map((c, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/60">
                      <td className="px-3 py-2 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="px-3 py-2 text-neutral-700 whitespace-nowrap">
                        {c.provider}
                      </td>
                      <td className="px-3 py-2 text-neutral-600 min-w-[160px]">
                        {c.purpose}
                      </td>
                      <td className="px-3 py-2 text-neutral-500 whitespace-nowrap">
                        {c.expiry}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
