import React, { useEffect, useRef } from 'react';
import { GmailIcon } from './icons/GmailIcon';
import { OutlookIcon } from './icons/OutlookIcon';
import { InfoIcon } from './icons/InfoIcon';

interface DataSourceModalProps {
  source: 'Gmail' | 'Outlook';
  onClose: () => void;
}

const SOURCE_CONFIG = {
    Gmail: {
        Icon: GmailIcon,
        title: 'Connect Gmail Account',
        steps: [
            "In Gmail, open the email you want to save.",
            "Click the 'More' (three dots) icon next to the reply button.",
            "Select 'Download message'. This will save the email as an .eml file.",
            "Drag and drop the downloaded .eml file into the uploader."
        ]
    },
    Outlook: {
        Icon: OutlookIcon,
        title: 'Connect Outlook Account',
        steps: [
            "In Outlook, open the email in a new window by double-clicking it.",
            "Go to 'File' > 'Save As'.",
            "Choose 'Outlook Message Format - Unicode (*.msg)' or 'Text Only (*.txt)'. We recommend saving individual emails as .eml if possible from your client.",
            "Drag and drop the saved file into the uploader."
        ]
    }
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ source, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const config = SOURCE_CONFIG[source];
  const { Icon, title, steps } = config;

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="source-modal-title">
      <div ref={modalRef} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
                <Icon className="w-6 h-6 mr-3 text-gray-300" />
                <h2 id="source-modal-title" className="text-lg font-bold text-gray-200">{title}</h2>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-300 space-y-4">
            <div className="flex items-start p-3 bg-gray-900/50 rounded-lg border border-indigo-500/30">
                <InfoIcon className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-1"/>
                <div>
                    <h3 className="font-semibold text-indigo-300">Security First: Manual Upload Required</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        To protect your privacy, this application runs entirely in your browser. A secure, direct connection to email services requires a backend server, which is not included in this demo. Please follow the steps below to add your emails manually.
                    </p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-gray-200">How to add your {source} emails:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 bg-gray-700/50 p-4 rounded-md">
                    {steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
            </div>
        </main>
        <footer className="p-4 bg-gray-800 border-t border-gray-700 text-right">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                Got It
            </button>
        </footer>
      </div>
    </div>
  );
};

export default DataSourceModal;
