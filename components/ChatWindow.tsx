import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Chunk } from '../types';
import { MessageSender } from '../types';
import { UserIcon } from './icons/UserIcon';
import CitationModal from './CitationModal';
import { ZenLogo } from './icons/ZenLogo';

interface ChatWindowProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  allChunks: Chunk[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, isLoading, allChunks }) => {
  const [viewingChunk, setViewingChunk] = useState<Chunk | null>(null);
  const [hoveredCitation, setHoveredCitation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [chatHistory, isLoading]);

  const handleSourceClick = (chunkId: string) => {
    const chunk = allChunks.find(c => c.id === chunkId);
    if (chunk) {
      setViewingChunk(chunk);
    }
  };

  const parseMessage = (text: string) => {
    const citationRegex = /\[Source ID: ([^\]]+)\]/g;
    const sourcesInText = Array.from(text.matchAll(citationRegex)).map(match => match[1]);
    const uniqueSourceIds = [...new Set(sourcesInText)];

    const sourceIdToNumber = uniqueSourceIds.reduce((acc, id, index) => {
        acc[id] = index + 1;
        return acc;
    }, {} as Record<string, number>);

    const renderedText = text
        .replace(citationRegex, (match, chunkId) => {
            const num = sourceIdToNumber[chunkId];
            return ` <button class="citation-link" data-citation-id="${chunkId}"><sup>[${num}]</sup></button> `;
        })
        .replace(/\s+/g, ' ')
        .trim();
    
    return {
        __html: renderedText,
        sources: uniqueSourceIds.map(id => ({
            id,
            num: sourceIdToNumber[id],
            name: allChunks.find(c => c.id === id)?.documentName || 'Unknown Document'
        })).sort((a,b) => a.num - b.num)
    };
  };
  
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('citation-link') || target.parentElement?.classList.contains('citation-link')) {
        const citationId = target.dataset.citationId || target.parentElement?.dataset.citationId;
        if (citationId) handleSourceClick(citationId);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {chatHistory.map((msg) => {
          const parsed = msg.sender === MessageSender.BOT ? parseMessage(msg.text) : null;
          return (
            <div key={msg.id} className={`flex items-start gap-3 md:gap-4 ${msg.sender === MessageSender.USER ? 'justify-end' : ''}`}>
              {msg.sender === MessageSender.BOT && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300">
                  <ZenLogo className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              )}
              <div className={`p-3 md:p-4 rounded-xl max-w-xl shadow-sm ${msg.sender === MessageSender.USER ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                <div 
                  className="prose prose-sm text-gray-800 leading-relaxed whitespace-pre-wrap"
                  onClick={handleMessageClick}
                  dangerouslySetInnerHTML={ msg.sender === MessageSender.USER ? {__html: msg.text} : parsed?.__html ? {__html: parsed.__html } : undefined}
                >
                  { msg.sender === MessageSender.BOT && !parsed?.__html ? msg.text : null}
                </div>

                {msg.sender === MessageSender.BOT && parsed && parsed.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Sources</h4>
                      <ul className="space-y-1">
                          {parsed.sources.map(source => (
                            <li key={source.id}>
                                <button 
                                    onClick={() => handleSourceClick(source.id)}
                                    className="text-xs text-blue-600 hover:underline text-left"
                                >
                                    [{source.num}] {source.name}
                                </button>
                            </li>
                          ))}
                      </ul>
                  </div>
                )}
              </div>
              {msg.sender === MessageSender.USER && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300">
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                </div>
              )}
            </div>
          )
        })}
        {isLoading && (
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300">
              <ZenLogo className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-200 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {viewingChunk && <CitationModal chunk={viewingChunk} onClose={() => setViewingChunk(null)} />}
    </>
  );
};

export default ChatWindow;
