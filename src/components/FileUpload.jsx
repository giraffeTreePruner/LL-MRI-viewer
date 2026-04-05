import { useState, useRef } from 'react';

export function FileUpload({ onFile, error }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onFile(file);
  }

  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Upload Scan JSON
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-lg p-4 text-center text-sm transition-colors ${
          dragging
            ? 'border-indigo-400 bg-indigo-900/20 text-indigo-300'
            : 'border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-400'
        }`}
      >
        <div className="text-2xl mb-1">📂</div>
        <div>Drop JSON here</div>
        <div className="text-xs mt-1">or click to browse</div>
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-900/20 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}
