const DEMO_MODELS = [
  { key: 'qwen25-3b', label: 'Qwen2.5-3B-Instruct', url: '/data/qwen25-3b-instruct.json' },
  { key: 'llama32-3b', label: 'Llama-3.2-3B-Instruct', url: '/data/llama32-3b-instruct.json' },
];

export function ModelSelector({ activeKey, onSelect, availableKeys = [] }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Demo Scans
      </div>
      <div className="flex flex-col gap-1">
        {DEMO_MODELS.map((m) => {
          const isAvailable = availableKeys.includes(m.key);
          return (
            <button
              key={m.key}
              onClick={() => isAvailable && onSelect(m.key, m.url)}
              disabled={!isAvailable}
              title={isAvailable ? `Load ${m.label}` : 'Not available — add JSON to public/data/'}
              className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                activeKey === m.key
                  ? 'bg-indigo-600 text-white font-medium'
                  : isAvailable
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <div>{m.label}</div>
              {!isAvailable && (
                <div className="text-xs text-gray-600 mt-0.5">not loaded</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
