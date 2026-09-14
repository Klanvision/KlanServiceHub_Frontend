import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex h-full min-h-[260px] w-full flex-1 flex-col items-center justify-center gap-2 p-6 text-neutral-500">
      <div className="flex items-center gap-2.5">
        <Loader2 className="size-5 animate-spin text-blue-600" />
        {message && <span className="text-xs font-semibold text-neutral-600">{message}</span>}
      </div>
    </div>
  );
};
