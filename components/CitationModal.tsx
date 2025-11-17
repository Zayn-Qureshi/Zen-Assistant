import React, { useEffect, useRef } from 'react';
import type { Chunk } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';

interface CitationModalProps {
  chunk: Chunk;
  onClose: () => void;
}

const CitationModal: React.FC<CitationModalProps> = ({ chunk, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="citation-title">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center min-w-0">
                <DocumentIcon className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                    <h2 id="citation-title" className="text-lg font-semibold text-gray-800 truncate" title={chunk.documentName}>Source: {chunk.documentName}</h2>
                    <p className="text-xs text-gray-500 font-mono" title={chunk.id}>ID: {chunk.id}</p>
                </div>
            </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close citation view">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
            <p className="prose prose-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {chunk.content}
            </p>
        </main>
      </div>
    </div>
  );
};

export default CitationModal;
