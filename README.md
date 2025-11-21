🧘‍♂️ ZEN Assistant
AI-Powered PDF Understanding & Intelligent Q&A

A calm, smart, modern assistant that reads your documents and answers your questions instantly.

🚀 Overview

ZEN Assistant is an AI-powered  understanding tool that allows users to upload documents and ask natural-language questions about them. It extracts text, chunks it smartly, embeds it using Google Gemini’s text-embedding-004, and performs context-aware retrieval to generate accurate answers using Gemini 1.5 Flash.

Built with Vite + React + TypeScript, optimized for speed, and designed for simplicity.

✨ Features
📄 PDF Processing

Upload any PDF

Extract text using PDF.js

Chunk text efficiently for RAG (Retrieval-Augmented Generation)

🤖 AI-Powered Answers

Uses Google Gemini 1.5 Flash for fast, intelligent responses

Uses text-embedding-004 for vector search

Retrieves only the most relevant chunks

🎯 Smart RAG Pipeline

Embeddings stored in memory

Cosine similarity ranking

High-precision context extraction

⚡ Modern Web Stack

Vite for blazing-fast dev

React + TypeScript

Clean modular folder structure

📁 Project Structure
zen-assistant/
│── components/
│   ├── LandingPage.tsx
│   └── ZenApp.tsx
│── services/
│   └── geminiService.ts
│── utils/
│   └── textProcessor.ts
│── App.tsx
│── main.tsx
│── index.html
│── package.json
│── vite.config.ts
│── README.md

🛠️ Tech Stack
Technology	Purpose
React + TypeScript	UI & app logic
Vite	Development + build tool
PDF.js	PDF text extraction
Google Gemini API	AI responses + embeddings
Cosine Similarity	Ranking best text chunks
🔑 Environment Variables

Create a .env file in the project root:

VITE_GOOGLE_API_KEY=YOUR_API_KEY_HERE


Get your key from Google AI Studio:
https://aistudio.google.com

▶️ How to Run Locally
1️⃣ Install dependencies
npm install

2️⃣ Start the dev server
npm run dev

3️⃣ Open in browser
http://localhost:3000


You're good to go!

🧠 How It Works (RAG Flow)
PDF → Extract Text → Chunk → Embed → Store → User Question → Embed → Compare → Retrieve → Ask Gemini → Final Answer


textProcessor.ts handles chunking + similarity

geminiService.ts handles embeddings + AI responses

App.tsx connects all parts and shows the UI

📌 Future Enhancements

Save vector index to local storage

Support for multiple PDFs

Chat history for each document

Dark mode UI

Export answers as PDF

🤝 Contributing

Pull Requests are welcome!
If you want to add features, fix bugs, or improve documentation — feel free.

📜 License

This project is open-source under the MIT License.

⭐ Support the Project

If you like Zen Assistant, please consider giving the repository a star ⭐ on GitHub — it greatly helps!
