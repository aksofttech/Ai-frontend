import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import BookSelectionForm from '@/components/BookSelectionForm';
import { Send, Sparkles, BookOpen, Loader2, RefreshCw, Mic } from 'lucide-react';
import useCurriculumStore from '@/store/curriculumStore';
import api from '@/services/api';

export default function ChatWithBook({ onReady }) {
  const [selection, setSelection] = useState(null);
  const { setSelectedSubjectId, setSelectedChapterId } = useCurriculumStore();

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content:
        'Hello! I am your AI Teaching Assistant. How can I help you explain concepts from your selected textbook chapter?',
      citation: 'Assistant',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Speech-to-Text configuration
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const recordingBaseTextRef = useRef('');

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let speechText = '';
      for (let i = 0; i < event.results.length; i++) {
        speechText += event.results[i][0].transcript;
      }

      const base = recordingBaseTextRef.current;
      const newText = base
        ? (base.endsWith(' ') ? base + speechText : base + ' ' + speechText)
        : speechText;
      setInput(newText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recordingBaseTextRef.current = input; // Capture the text in input before starting speech recognition
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const queryText = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/rag/chat', {
        query: queryText,
        bookId: selection?.bookId || undefined,
        chapterId: selection?.chapterId || undefined,
        history: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      });

      const data = response.data?.data || response.data;
      const { answer, sources } = data;

      const citation =
        sources && sources.length > 0
          ? sources[0].chapterTitle
          : 'General Knowledge';

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: answer, citation },
      ]);
    } catch (err) {
      console.warn('Textbook chat error:', err.message);
      const apiError = err.response?.data?.message;
      let errorMessage = '';
      if (typeof apiError === 'string') {
        errorMessage = apiError;
      } else if (Array.isArray(apiError)) {
        errorMessage = apiError.join(', ');
      } else if (apiError && typeof apiError === 'object') {
        errorMessage = apiError.message || JSON.stringify(apiError);
      } else {
        errorMessage =
          err.response?.data?.error ||
          err.message ||
          'Sorry, I could not complete the request.';
      }

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: errorMessage, citation: 'System Error' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Step 1: Show BookSelectionForm
  if (!selection) {
    return (
      <BookSelectionForm
        hidePeriods
        onGenerate={(data) => {
          setSelection(data);
          setSelectedSubjectId(data.bookId);
          setSelectedChapterId(data.chapterId);
          if (onReady) onReady(true);
        }}
      />
    );
  }

  // Step 2: Chat UI
  return (
    <GlassCard className="h-full flex flex-col relative p-0 overflow-hidden">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(107,92,231,0.1)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(107,92,231,0.1)' }}>
            <BookOpen size={16} style={{ color: '#6B5CE7' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#1A1A2E' }}>Chat with Textbook</h3>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              {selection.chapterTitle}
              <span className="mx-1.5">·</span>
              {selection.bookTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sparkles size={16} style={{ color: '#6B5CE7' }} />
          <button
            onClick={() => {
              setSelection(null);
              setSelectedSubjectId('');
              setSelectedChapterId('');
              if (onReady) onReady(false);
            }}
            title="Change book / chapter"
            className="transition-colors"
            style={{ color: '#9CA3AF' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4"
        style={{ background: 'rgba(248,246,255,0.5)' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[80%] ${
              msg.role === 'user'
                ? 'self-end items-end ml-auto'
                : 'self-start items-start mr-auto'
            }`}
          >
            <div
              className="p-3.5 rounded-2xl text-sm"
              style={msg.role === 'user'
                ? {
                    background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)',
                    color: 'white',
                    borderRadius: '18px 18px 4px 18px',
                  }
                : {
                    background: 'rgba(255,255,255,0.9)',
                    color: '#1A1A2E',
                    border: '1px solid rgba(107,92,231,0.15)',
                    borderRadius: '18px 18px 18px 4px',
                  }
              }
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
            {msg.citation && (
              <span className="text-xs mt-1 flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                <BookOpen size={10} /> Source: {msg.citation}
              </span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col max-w-[80%] self-start items-start mr-auto">
            <div
              className="p-3.5 rounded-2xl flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(107,92,231,0.15)', borderRadius: '18px 18px 18px 4px' }}
            >
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2.5 h-2.5 rounded-full animate-bounce"
                  style={{ background: '#6B5CE7', animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-4"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(107,92,231,0.1)' }}
      >
        <div className="flex gap-2 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about the textbook..."
            className={`${isSpeechSupported ? 'pr-20' : 'pr-12'} rounded-full`}
            disabled={isLoading}
          />
          <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1.5">
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-md' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                disabled={isLoading}
                title={isRecording ? "Stop recording" : "Voice search (Speech to Text)"}
              >
                <Mic size={16} />
              </button>
            )}
            <Button
              variant="primary"
              onClick={handleSend}
              className="rounded-full px-3.5 h-8 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
