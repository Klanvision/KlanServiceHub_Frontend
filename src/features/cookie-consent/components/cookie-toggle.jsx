import React from 'react';

/**
 * Accessible Toggle Switch Component
 * Compliant with WCAG 2.1 AA and WAI-ARIA Switch pattern
 */
export const CookieToggle = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (onChange) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {label && (
        <label
          htmlFor={id}
          className={`text-xs font-semibold select-none cursor-pointer ${
            disabled ? 'text-neutral-400 cursor-not-allowed' : 'text-neutral-900'
          }`}
          onClick={handleClick}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle cookie category'}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
          disabled
            ? 'bg-neutral-200 opacity-80 cursor-not-allowed'
            : checked
            ? 'bg-blue-600'
            : 'bg-neutral-300 hover:bg-neutral-400'
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
