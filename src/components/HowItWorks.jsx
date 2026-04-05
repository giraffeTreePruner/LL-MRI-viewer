import { useState } from 'react';

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-medium">How it works</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-3 pb-3 text-xs text-gray-400 space-y-2 border-t border-gray-700 pt-2">
          <p>
            <strong className="text-gray-300">RYS</strong> (Repeat Yourself Smarter) duplicates
            a contiguous block of transformer layers to boost model capacity without retraining.
          </p>
          <p>
            Config <strong className="text-gray-300">(i, j)</strong> runs layers{' '}
            <code className="text-indigo-300">[0..j-1] + [i..N-1]</code>, so layers{' '}
            <code className="text-indigo-300">i..j-1</code> execute twice.
          </p>
          <p>
            The heatmap shows the delta vs. the baseline (0,0) for each config.{' '}
            <span className="text-red-400">Red = improvement</span>,{' '}
            <span className="text-blue-400">blue = degradation</span>.
          </p>
          <p>
            <strong className="text-gray-300">Probes:</strong> PubMedQA (biomedical
            yes/no/maybe) and EQ-Bench (emotional intelligence scenarios).
          </p>
          <p className="text-gray-500">
            Based on <a href="https://github.com/dnhkng/RYS" className="text-indigo-400 underline" target="_blank" rel="noreferrer">dnhkng/RYS</a>.
          </p>
        </div>
      )}
    </div>
  );
}
