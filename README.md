# Zen Assistant - Personal AI Knowledge Partner

Zen Assistant is a powerful, privacy-focused personal AI agent that helps you learn from your documents. It runs entirely in your browser, processing files locally and using Google's Gemini AI for intelligent analysis.

## 🚀 Features

-   **Multi-Format Support**: Upload and chat with PDF, DOCX, TXT, MD, and EML files.
-   **Long-Term Memory**: Your documents and chat history are saved automatically using IndexedDB.
-   **Context-Aware**: Zen remembers your conversation context, allowing for natural follow-up questions.
-   **Email Integration**: Easily import emails from Gmail and Outlook (via .eml export).
-   **Privacy First**: File processing happens locally in your browser. No documents are sent to a backend server.
-   **Smart Retrieval**: Uses intelligent chunking and keyword matching to find relevant information.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **AI Model**: Google Gemini 2.0 Flash (via `@google/genai`)
-   **Storage**: IndexedDB (via `idb`)
-   **File Processing**: `pdfjs-dist` (PDF), `mammoth` (DOCX)
-   **Styling**: Tailwind CSS (via utility classes)

## 🏃‍♂️ Run Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Zayn-Qureshi/Zen-Assistant.git
    cd Zen-Assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    -   Create a `.env.local` file in the root directory.
    -   Add your Gemini API key:
        ```env
        VITE_GOOGLE_API_KEY=your_api_key_here
        ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

## 📦 Build for Production

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
