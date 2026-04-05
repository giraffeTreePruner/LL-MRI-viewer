import { useState } from 'react';
import { generateExportCommands } from '../utils/exportCommands';

function CopyBlock({ label, code }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <button
          onClick={copy}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre className="bg-gray-900 rounded p-2 text-xs text-green-300 overflow-x-auto whitespace-pre-wrap break-all">
        {code}
      </pre>
    </div>
  );
}

export function ExportCommands({ modelName, i, j }) {
  if (!modelName || i == null || j == null) return null;

  const { exportCmd, uploadCmd, ollamaCmd } = generateExportCommands(modelName, i, j);

  return (
    <div>
      <div className="text-sm font-semibold text-gray-200 mb-3">
        Export Config ({i}, {j})
      </div>
      <CopyBlock label="Export Model" code={exportCmd} />
      <CopyBlock label="Upload to HuggingFace" code={uploadCmd} />
      <CopyBlock label="Run with Ollama" code={ollamaCmd} />
    </div>
  );
}
