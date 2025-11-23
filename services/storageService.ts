import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Document, Chunk, ChatMessage } from '../types';

interface ZenDB extends DBSchema {
    documents: {
        key: string;
        value: Document;
    };
    chunks: {
        key: string;
        value: Chunk;
    };
    chatHistory: {
        key: string;
        value: ChatMessage;
    };
}

const DB_NAME = 'zen-assistant-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ZenDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<ZenDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('documents')) {
                    db.createObjectStore('documents', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('chunks')) {
                    db.createObjectStore('chunks', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('chatHistory')) {
                    db.createObjectStore('chatHistory', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

export const saveDocuments = async (documents: Document[]) => {
    const db = await initDB();
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    await store.clear(); // Simple strategy: clear and rewrite for sync
    for (const doc of documents) {
        await store.put(doc);
    }
    await tx.done;
};

export const loadDocuments = async (): Promise<Document[]> => {
    const db = await initDB();
    return db.getAll('documents');
};

export const saveChunks = async (chunks: Chunk[]) => {
    const db = await initDB();
    const tx = db.transaction('chunks', 'readwrite');
    const store = tx.objectStore('chunks');
    await store.clear();
    for (const chunk of chunks) {
        await store.put(chunk);
    }
    await tx.done;
};

export const loadChunks = async (): Promise<Chunk[]> => {
    const db = await initDB();
    return db.getAll('chunks');
};

export const saveChatHistory = async (history: ChatMessage[]) => {
    const db = await initDB();
    const tx = db.transaction('chatHistory', 'readwrite');
    const store = tx.objectStore('chatHistory');
    await store.clear();
    for (const msg of history) {
        await store.put(msg);
    }
    await tx.done;
};

export const loadChatHistory = async (): Promise<ChatMessage[]> => {
    const db = await initDB();
    return db.getAll('chatHistory');
};
