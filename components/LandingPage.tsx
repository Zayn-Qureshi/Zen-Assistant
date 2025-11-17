import React from 'react';
import { ZenAvatar } from './icons/ZenAvatar';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-slate-900 text-white font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] bg-indigo-800/40 rounded-full blur-3xl animate-glow"></div>

      <main className="relative z-10 w-full max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left animate-fade-in-up">
            <div
              className="inline-block bg-green-400/10 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-400/20"
            >
              Personal AI Knowledge Assistant
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              Hi, I'm Zen
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Your personal AI that turns your documents into instant, accurate knowledge, delivered through conversation.
            </p>
            <button
              onClick={onGetStarted}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              Get Started
            </button>
          </div>
          <div className="flex justify-center items-center h-full animate-fade-in [animation-delay:200ms]">
            <ZenAvatar className="w-64 h-64 md:w-80 md:h-80 text-indigo-500" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;