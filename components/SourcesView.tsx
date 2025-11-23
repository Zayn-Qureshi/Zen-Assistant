import React, { useState } from 'react';
import type { Document } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { GmailIcon } from './icons/GmailIcon';
import { OutlookIcon } from './icons/OutlookIcon';
import DataSourceModal from './DataSourceModal';

interface SourcesViewProps {
  documents: Document[];
  onFileUpload: (files: FileList) => void;
  isProcessing: boolean;
}

const SourcesView: React.FC<SourcesViewProps> = ({ documents, onFileUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeSource, setActiveSource] = useState<'Gmail' | 'Outlook' | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Sources</h2>
        <label
          htmlFor="file-upload-sources"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-40 px-4 transition-all duration-200 bg-gray-50 border-2 ${isDragging ? 'border-blue-500' : 'border-gray-300'} border-dashed rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag & drop</p>
            <p className="text-xs text-gray-400">PDF, DOCX, TXT, MD, EML</p>
          </div>
          <input id="file-upload-sources" type="file" className="hidden" multiple onChange={handleFileChange} disabled={isProcessing} accept=".pdf,.docx,.txt,.md,.eml" />
        </label>
        {isProcessing && <div className="text-center text-sm text-blue-600 mt-2 animate-pulse">Processing files...</div>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveSource('Gmail')}
          className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <GmailIcon className="w-6 h-6 mr-2" />
          <span className="font-medium text-gray-700">Gmail</span>
        </button>
        <button
          onClick={() => setActiveSource('Outlook')}
          className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <OutlookIcon className="w-6 h-6 mr-2" />
          <span className="font-medium text-gray-700">Outlook</span>
        </button>
      </div>

      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Connected Sources</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 px-2 bg-gray-50 rounded-lg">Your knowledge base is waiting. Upload a document to begin.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <DocumentIcon className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate" title={doc.name}>{doc.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {activeSource && (
        <DataSourceModal
          source={activeSource}
          onClose={() => setActiveSource(null)}
        />
      )}
    </div>
  );
};

export default SourcesView;
