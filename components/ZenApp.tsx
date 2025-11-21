import React, { useState, useRef, useEffect } from 'react';
import type { Document, Chunk, ChatMessage } from '../types';
import ChatWindow from './ChatWindow';
import SourcesView from './SourcesView';
import { SendIcon } from './icons/SendIcon';
import { AddIcon } from './icons/AddIcon';
import { SearchSourceIcon } from './icons/SearchSourceIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

// --- TypeScript Definitions for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}
// FIX: Augment the window interface to include SpeechRecognition APIs for proper type checking.
// This resolves errors where TypeScript doesn't recognize these non-standard properties on the `window` object.
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
// --- End Definitions ---


interface ZenAppProps {
  documents: Document[];
  chunks: Chunk[];
  chatHistory: ChatMessage[];
  isProcessingFiles: boolean;
  isBotLoading: boolean;
  onFileUpload: (files: FileList) => void;
  onSendMessage: (message: string) => void;
}

const ZenApp: React.FC<ZenAppProps> = (props) => {
  const [view, setView] = useState<'chat' | 'sources'>('chat');
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + finalTranscript);
      }
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
    }

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !props.isBotLoading) {
      props.onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      props.onFileUpload(e.target.files);
      e.target.value = ''; // Reset for next upload
    }
  };


  return (
    <div className="relative h-screen w-full flex flex-col font-sans bg-gray-100">
      <div className="absolute inset-0 hex-bg z-0"></div>
      <div className="relative flex-1 flex flex-col max-w-4xl w-full mx-auto pb-28 sm:pb-24 px-2 sm:px-4">
        <header className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-2 sm:px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800">Zen Assistant</h1>
            <p className="text-gray-500 mt-2">Hello! I'm Zen, your AI knowledge partner. How can I help you learn today?</p>
        </header>

        <div className="px-2 sm:px-4 mb-4 flex justify-center items-center gap-2 sm:gap-4">
            <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 flex items-center">
                <button onClick={() => setView('chat')} className={`px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${view === 'chat' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Chat
                </button>
                <button onClick={() => setView('sources')} className={`px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${view === 'sources' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Sources
                </button>
            </div>
            <button onClick={() => setView('sources')} className="p-2 sm:p-2.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                <SearchSourceIcon className="w-5 h-5"/>
            </button>
        </div>

        {view === 'chat' ? (
             <ChatWindow 
                chatHistory={props.chatHistory}
                isLoading={props.isBotLoading}
                allChunks={props.chunks}
            />
        ) : (
            <SourcesView
                documents={props.documents}
                onFileUpload={props.onFileUpload}
                isProcessing={props.isProcessingFiles}
            />
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200 z-10">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                    className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-3.5 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400"
                    disabled={props.isBotLoading}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                    <button type="button" onClick={handleFileIconClick} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors">
                        <AddIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileChange} disabled={props.isProcessingFiles} accept=".pdf,.docx,.txt,.md,.eml" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 space-x-0.5 sm:space-x-1">
                    {recognitionRef.current && (
                      <button
                        type="button"
                        onClick={handleMicClick}
                        className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'}`}
                        aria-label={isListening ? "Stop listening" : "Start listening"}
                      >
                        <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}
                    <button
                    type="submit"
                    disabled={props.isBotLoading || !input.trim()}
                    className="p-2 rounded-full text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    aria-label="Send message"
                    >
                    <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </form>
            <p className="text-xs text-center text-gray-500 mt-2">Zen understands your connected sources.</p>
          </div>
        </footer>
    </div>
  );
};

export default ZenApp;