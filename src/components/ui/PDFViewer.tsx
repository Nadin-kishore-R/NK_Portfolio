import React from 'react';
import { MdOpenInNew } from 'react-icons/md';

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
}

export function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  return (
    <div className="flex flex-col gap-3 w-full h-full min-h-[500px]">
      <div className="flex items-center justify-between">
        {fileName && (
          <span className="text-sm text-ocean-700 font-medium truncate">{fileName}</span>
        )}
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-ocean-600 hover:text-ocean-800 transition-colors ml-auto"
        >
          Open in new tab <MdOpenInNew size={16} />
        </a>
      </div>
      <iframe
        src={fileUrl}
        title={fileName ?? 'Resume PDF'}
        className="flex-1 w-full min-h-[500px] rounded-xl border border-white/30"
        style={{ height: '70vh' }}
      />
    </div>
  );
}
