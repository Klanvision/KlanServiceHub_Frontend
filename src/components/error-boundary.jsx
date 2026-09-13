import React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Terminal,
  ShieldAlert,
} from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[CLIENT_EXCEPTION_CAUGHT]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    const report = `--- KLANSERVICEHUB ERROR REPORT ---
Time: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Error: ${error?.message || error}
Stack:
${error?.stack || 'N/A'}
Component Stack:
${errorInfo?.componentStack || 'N/A'}`;

    navigator.clipboard.writeText(report);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className="relative min-h-screen w-full bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
          {/* Ambient Glows */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[160px]" />
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-xl">
            {/* Main Error Glass Card */}
            <div className="rounded-3xl border border-rose-500/20 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
              <div className="mx-auto size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/40">
                <ShieldAlert className="size-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="size-3.5" />
                  <span>Application Error Caught</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  An unexpected exception occurred while rendering this interface. Our system prevented a crash.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition active:scale-[0.98]"
                >
                  <RefreshCw className="size-4" />
                  <span>Reload Application</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-xs font-bold text-slate-200 transition active:scale-[0.98]"
                >
                  <Home className="size-4" />
                  <span>Return to Home</span>
                </button>
              </div>

              {/* Diagnostic Details Accordion */}
              <div className="border-t border-slate-800/80 pt-4 text-left">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !showDetails })}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="size-3.5" />
                    <span>Technical Diagnostics</span>
                  </span>
                  {showDetails ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>

                {showDetails && (
                  <div className="mt-3 space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-rose-300 overflow-x-auto max-h-40 leading-relaxed select-text">
                      <p className="font-bold">{error?.toString()}</p>
                      {errorInfo?.componentStack && (
                        <pre className="text-slate-400 mt-2 text-[10px] whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={this.handleCopyDetails}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      <span>{copied ? 'Diagnostic details copied to clipboard!' : 'Copy Error Report for Support'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-500 mt-6">
              KlanServiceHub Resilience Engine &bull; Incident logged automatically
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
