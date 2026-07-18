import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import BookSelectionForm from '@/components/BookSelectionForm';
import { Send, Sparkles, BookOpen, Loader2, RefreshCw, Mic, ChevronDown } from 'lucide-react';
import useCurriculumStore from '@/store/curriculumStore';
import api from '@/services/api';

export default function ChatWithBook({ onReady }) {
  const [selection, setSelection] = useState(null);
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    selectedChapterId,
    setSelectedChapterId,
    chapters: storeChapters,
    subjects: storeSubjects,
    books: storeBooks,
    showReader,
    toggleReader,
    setShowReader,
  } = useCurriculumStore();

  const [navSubjects, setNavSubjects] = useState([]);
  const [navChapters, setNavChapters] = useState([]);
  const [isNavChaptersLoading, setIsNavChaptersLoading] = useState(false);

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

  // Sync navChapters when selection.bookId changes or from store
  useEffect(() => {
    if (!selection?.bookId) return;
    setIsNavChaptersLoading(true);
    api
      .get(`/curriculum/chapters?subjectId=${encodeURIComponent(selection.bookId)}`)
      .then((res) => {
        const arr = res.data?.data || res.data || [];
        setNavChapters(Array.isArray(arr) ? arr : []);
      })
      .catch((err) => console.warn('Failed to fetch chapters for navbar:', err.message))
      .finally(() => setIsNavChaptersLoading(false));
  }, [selection?.bookId]);

  // Sync when store selectedChapterId changes outside (e.g. TopHeader)
  useEffect(() => {
    if (selection && selectedChapterId && selectedChapterId !== selection.chapterId) {
      const found =
        navChapters.find((c) => c.id === selectedChapterId || c._id === selectedChapterId) ||
        (storeChapters || []).find((c) => c.id === selectedChapterId || c._id === selectedChapterId);
      if (found) {
        setSelection((prev) => ({
          ...prev,
          chapterId: found.id || found._id,
          chapterTitle: found.title || found.name || prev.chapterTitle,
        }));
      }
    }
  }, [selectedChapterId, navChapters, storeChapters]);

  // Sync when store selectedSubjectId changes outside
  useEffect(() => {
    if (selection && selectedSubjectId && selectedSubjectId !== selection.bookId) {
      const foundBook =
        navSubjects.find((s) => s.id === selectedSubjectId || s._id === selectedSubjectId) ||
        (storeSubjects || []).find((s) => s.id === selectedSubjectId || s._id === selectedSubjectId) ||
        (storeBooks || []).find((b) => b.id === selectedSubjectId || b._id === selectedSubjectId);
      if (foundBook) {
        setSelection((prev) => ({
          ...prev,
          bookId: foundBook.id || foundBook._id,
          bookTitle: foundBook.title || foundBook.name || prev.bookTitle,
        }));
      }
    }
  }, [selectedSubjectId, navSubjects, storeSubjects, storeBooks]);

  const handleNavbarChapterChange = (newChapterId) => {
    if (!newChapterId || newChapterId === selection?.chapterId) return;
    const foundChapter = navChapters.find((c) => c.id === newChapterId || c._id === newChapterId);
    const newChapterTitle = foundChapter
      ? foundChapter.title || foundChapter.name
      : 'Selected Chapter';

    setSelection((prev) => ({
      ...prev,
      chapterId: newChapterId,
      chapterTitle: newChapterTitle,
    }));
    setSelectedChapterId(newChapterId);

    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        content: `📖 **Chapter Changed:** Switched to **"${newChapterTitle}"** (${selection?.bookTitle || 'Current Book'}).\n\nAsk me any questions or request summaries for this chapter!`,
        citation: 'Context Updated',
      },
    ]);
  };

  const handleNavbarBookChange = async (newBookId) => {
    if (!newBookId || newBookId === selection?.bookId) return;
    const foundBook = navSubjects.find((s) => s.id === newBookId || s._id === newBookId);
    const newBookTitle = foundBook ? foundBook.title || foundBook.name : 'Selected Book';

    setIsNavChaptersLoading(true);
    setSelectedSubjectId(newBookId);
    try {
      const res = await api.get(`/curriculum/chapters?subjectId=${encodeURIComponent(newBookId)}`);
      const data = res.data?.data || res.data || [];
      const chaps = Array.isArray(data) ? data : [];
      setNavChapters(chaps);

      let firstChapId = '';
      let firstChapTitle = '';
      if (chaps.length > 0) {
        firstChapId = chaps[0].id || chaps[0]._id;
        firstChapTitle = chaps[0].title || chaps[0].name;
      }

      setSelection((prev) => ({
        ...prev,
        bookId: newBookId,
        bookTitle: newBookTitle,
        chapterId: firstChapId || prev?.chapterId,
        chapterTitle: firstChapTitle || 'General Chapter',
      }));
      if (firstChapId) {
        setSelectedChapterId(firstChapId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `📚 **Textbook Changed:** Switched to **"${newBookTitle}"**${
            firstChapTitle ? ` (Current Chapter: **"${firstChapTitle}"**)` : ''
          }.\n\nYou can ask any questions directly right now!`,
          citation: 'Context Updated',
        },
      ]);
    } catch (err) {
      console.error('Error fetching chapters for new book:', err);
    } finally {
      setIsNavChaptersLoading(false);
    }
  };

  // Step 1: Show BookSelectionForm
  if (!selection) {
    return (
      <BookSelectionForm
        hidePeriods
        onGenerate={(data) => {
          setSelection(data);
          setSelectedSubjectId(data.bookId);
          setSelectedChapterId(data.chapterId);

          if (data.subjectsList && data.subjectsList.length > 0) {
            setNavSubjects(data.subjectsList);
          } else if (storeSubjects && storeSubjects.length > 0) {
            setNavSubjects(storeSubjects);
          } else {
            api
              .get(
                data.classId
                  ? `/curriculum/subjects?classId=${encodeURIComponent(data.classId)}`
                  : '/curriculum/books'
              )
              .then((res) => {
                const arr = res.data?.data || res.data || [];
                setNavSubjects(Array.isArray(arr) ? arr : []);
              })
              .catch(() => {});
          }

          if (data.chaptersList && data.chaptersList.length > 0) {
            setNavChapters(data.chaptersList);
          } else {
            setIsNavChaptersLoading(true);
            api
              .get(`/curriculum/chapters?subjectId=${encodeURIComponent(data.bookId)}`)
              .then((res) => {
                const arr = res.data?.data || res.data || [];
                setNavChapters(Array.isArray(arr) ? arr : []);
              })
              .catch(() => {})
              .finally(() => setIsNavChaptersLoading(false));
          }

          if (onReady) onReady(true);
        }}
      />
    );
  }

  // Step 2: Chat UI
  return (
    <GlassCard className="h-full flex flex-col relative p-0 overflow-hidden">
      {/* Header / Navbar */}
      <div
        className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(107,92,231,0.15)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(107,92,231,0.15), rgba(139,124,246,0.15))',
            }}
          >
            <BookOpen size={16} style={{ color: '#6B5CE7' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#1A1A2E' }}>
              Chat with Textbook
            </h3>
            <p className="text-[11px] font-medium hidden sm:block" style={{ color: '#9CA3AF' }}>
              Select & switch chapter directly from the navbar below
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 ml-auto">
          {/* Toggle Reader Button */}
          <button
            onClick={toggleReader || (() => setShowReader && setShowReader(!showReader))}
            title={showReader ? "Hide Textbook Reader Panel" : "Show Textbook Reader Panel"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
              showReader
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:opacity-90'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">{showReader ? 'Hide Reader' : '📖 Textbook Reader'}</span>
            <span className="sm:hidden">Reader</span>
          </button>

          {/* Book / Subject Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selection?.bookId || ''}
              onChange={(e) => handleNavbarBookChange(e.target.value)}
              title="Change Book / Subject dynamically"
              className="appearance-none text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 cursor-pointer transition-all outline-none shadow-sm hover:shadow truncate max-w-[140px] sm:max-w-[180px]"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1A1A2E',
                border: '1px solid rgba(107,92,231,0.25)',
              }}
            >
              {navSubjects && navSubjects.length > 0 ? (
                navSubjects.map((sub) => (
                  <option key={sub.id || sub._id} value={sub.id || sub._id}>
                    📚 {sub.title || sub.name}
                  </option>
                ))
              ) : (
                <option value={selection?.bookId || ''}>
                  📚 {selection?.bookTitle || 'Book'}
                </option>
              )}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#6B5CE7' }}
            />
          </div>

          {/* Chapter Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selection?.chapterId || ''}
              onChange={(e) => handleNavbarChapterChange(e.target.value)}
              title="Change Chapter directly during chat"
              disabled={isNavChaptersLoading}
              className="appearance-none text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 cursor-pointer transition-all outline-none shadow-sm hover:shadow truncate max-w-[150px] sm:max-w-[200px]"
              style={{
                background: 'rgba(107,92,231,0.08)',
                color: '#6B5CE7',
                border: '1px solid rgba(107,92,231,0.3)',
              }}
            >
              {isNavChaptersLoading ? (
                <option value="">⏳ Loading chapters...</option>
              ) : navChapters && navChapters.length > 0 ? (
                navChapters.map((chap) => (
                  <option key={chap.id || chap._id} value={chap.id || chap._id}>
                    📖 {chap.title || chap.name}
                  </option>
                ))
              ) : (
                <option value={selection?.chapterId || ''}>
                  📖 {selection?.chapterTitle || 'Chapter'}
                </option>
              )}
            </select>
            {isNavChaptersLoading ? (
              <Loader2
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin"
                style={{ color: '#6B5CE7' }}
              />
            ) : (
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#6B5CE7' }}
              />
            )}
          </div>
          {/* Reset button to go back to full form if desired */}
          <button
            onClick={() => {
              setSelection(null);
              setSelectedSubjectId('');
              setSelectedChapterId('');
              if (onReady) onReady(false);
            }}
            title="Return to full class/book selection screen"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 border border-transparent hover:border-red-200 ml-0.5"
            style={{ color: '#9CA3AF' }}
          >
            <RefreshCw size={14} className="hover:text-red-500 transition-colors" />
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
