// App.tsx
import React, { useState, useCallback } from 'react';
import type { Document, Chunk, ChatMessage } from './types';
import { MessageSender } from './types';
import { chunkText, retrieveRelevantChunks } from './utils/textProcessor';
import { getAnswerFromContext, getEmbedding } from './services/geminiService';
import {
  saveDocuments,
  loadDocuments,
  saveChunks,
  loadChunks,
  saveChatHistory,
  loadChatHistory
} from './services/storageService';
import * as pdfjsLib from 'pdfjs-dist';
import ZenApp from './components/ZenApp';
import LandingPage from './components/LandingPage';

// Declare mammoth for DOCX processing
declare const mammoth: any;

// Set PDF.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ==========================================
// FILE TEXT EXTRACTION
// ==========================================
const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf': {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => item.str)
            .join(' ');
          textContent += pageText + '\n';
        }

        return textContent.trim();
      } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
      }
    }

    case 'docx': {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } catch (error) {
        console.error('DOCX extraction error:', error);
        throw new Error('Failed to extract text from DOCX');
      }
    }

    case 'txt':
    case 'md':
    case 'eml':
      return file.text();

    default:
      throw new Error(`Unsupported file type: .${extension}`);
  }
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  // ==========================================
  // PERSISTENCE (Load & Save)
  // ==========================================

  // Load data on startup
  React.useEffect(() => {
    const init = async () => {
      try {
        const [docs, chks, hist] = await Promise.all([
          loadDocuments(),
          loadChunks(),
          loadChatHistory()
        ]);

        if (docs.length > 0) setDocuments(docs);
        if (chks.length > 0) setChunks(chks);
        if (hist.length > 0) setChatHistory(hist);
      } catch (error) {
        console.error("Failed to load data from storage:", error);
      }
    };
    init();
  }, []);

  // Save data when it changes
  React.useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  React.useEffect(() => {
    saveChunks(chunks);
  }, [chunks]);

  React.useEffect(() => {
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  // ==========================================
  // FILE UPLOAD HANDLER
  // ==========================================
  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsProcessingFiles(true);
    const newDocs: Document[] = [];
    const newChunks: Chunk[] = [];
    const processingErrors: string[] = [];

    for (const file of Array.from(files)) {
      try {
        console.log(`Processing: ${file.name}`);
        const text = await extractTextFromFile(file);

        // Validate extracted text
        if (!text || text.trim().length === 0) {
          throw new Error('No text extracted from file');
        }

        console.log(`Extracted ${text.length} characters from ${file.name}`);

        const docId = `doc-${documents.length + newDocs.length + 1}`;
        const newDoc: Document = {
          id: docId,
          name: file.name,
          content: text
        };
        newDocs.push(newDoc);

        // Create chunks with proper structure
        const docChunks = chunkText(docId, file.name, text);
        console.log(`Created ${docChunks.length} chunks for ${file.name}`);

        // Generate embeddings for chunks
        console.log(`Generating embeddings for ${file.name}...`);
        for (const chunk of docChunks) {
          const embedding = await getEmbedding(chunk.content);
          if (embedding) {
            chunk.embedding = embedding;
          }
        }

        newChunks.push(...docChunks);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        processingErrors.push(file.name);
      }
    }

    setDocuments(prev => [...prev, ...newDocs]);
    setChunks(prev => [...prev, ...newChunks]);
    setIsProcessingFiles(false);

    // Send feedback messages
    const messagesToAdd: ChatMessage[] = [];
    if (newDocs.length > 0) {
      messagesToAdd.push({
        id: `msg-${Date.now()}`,
        sender: MessageSender.BOT,
        text: `I've successfully processed ${newDocs.length} document(s). You can now ask anything from them.`
      });
    }
    if (processingErrors.length > 0) {
      messagesToAdd.push({
        id: `msg-${Date.now() + 1}`,
        sender: MessageSender.BOT,
        text: `I couldn't process: ${processingErrors.join(', ')}.`
      });
    }

    if (messagesToAdd.length > 0) {
      setChatHistory(prev => [...prev, ...messagesToAdd]);
    }
  }, [documents.length]);

  // ==========================================
  // MESSAGE HANDLER
  // ==========================================
  const handleSendMessage = useCallback(async (message: string) => {
    setIsBotLoading(true);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: MessageSender.USER,
      text: message,
    };
    setChatHistory(prev => [...prev, userMessage]);

    // Check if knowledge base is empty
    if (chunks.length === 0) {
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: MessageSender.BOT,
        text: "Your knowledge base is empty. Please upload some documents first."
      };
      setChatHistory(prev => [...prev, botMessage]);
      setIsBotLoading(false);
      return;
    }

    // Retrieve relevant chunks
    console.log(`Searching ${chunks.length} chunks for: "${message}"`);

    // Generate query embedding
    const queryEmbedding = await getEmbedding(message);

    const relevantChunks = retrieveRelevantChunks(message, chunks, 5, queryEmbedding);
    console.log(`Found ${relevantChunks.length} relevant chunks`);

    let botResponseText: string;

    if (relevantChunks.length === 0) {
      botResponseText = "I couldn't find relevant information in your documents for that query. Try rephrasing your question or upload more documents.";
    } else {
      botResponseText = await getAnswerFromContext(message, relevantChunks, chatHistory);
    }

    const botMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: MessageSender.BOT,
      text: botResponseText,
    };

    setChatHistory(prev => [...prev, botMessage]);
    setIsBotLoading(false);
  }, [chunks, chatHistory]);

  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <ZenApp
      documents={documents}
      chunks={chunks}
      chatHistory={chatHistory}
      isProcessingFiles={isProcessingFiles}
      isBotLoading={isBotLoading}
      onFileUpload={handleFileUpload}
      onSendMessage={handleSendMessage}
    />
  );
};

export default App;