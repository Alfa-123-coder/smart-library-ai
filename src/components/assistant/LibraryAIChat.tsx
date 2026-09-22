import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ArrowUpRight, BookOpen, ShieldCheck, MapPin, Check } from 'lucide-react';
import { Book, ChatMessage } from '../../types';
import { libraryService } from '../../services/libraryService';

interface LibraryAIChatProps {
  onSelectBook: (bookId: string) => void;
  initialPrompt?: string;
}

export const LibraryAIChat: React.FC<LibraryAIChatProps> = ({ onSelectBook, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I'm **Library AI**, your intelligent assistant connected directly to the university's authoritative PostgreSQL catalogue and physical stack inventory.

You can ask me to:
• Recommend titles on specific topics (e.g., *"Show me beginner-friendly Python books"* or *"Machine learning textbooks"*)
• Check real-time physical copy availability and exact shelf locations
• Suggest books similar to titles you've previously enjoyed.`,
      timestamp: 'Just now',
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate grounded retrieval response from libraryService
    setTimeout(() => {
      const response = libraryService.answerWithLibraryAI(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedBooks: response.suggestedBooks,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    'Show me beginner-friendly Python books.',
    'Do you have books about machine learning?',
    'What fantasy books have available copies right now?',
    'Where is Clean Code located in the stacks?',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-[#EAE7DF] shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-[#F0EEE6] bg-[#FAF9F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#E06953] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-base text-[#1D1D1F] flex items-center gap-2">
              <span>Library AI</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Live Catalog Grounded
              </span>
            </div>
            <p className="text-[11px] text-[#8A857A]">
              Real-time physical copy verification • Zero hallucinated availability
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((m) => {
          const isBot = m.sender === 'assistant';
          return (
            <div key={m.id} className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isBot ? 'bg-[#1D1D1F] text-white' : 'bg-[#E06953] text-white'
              }`}>
                {isBot ? <Sparkles className="w-4 h-4 text-[#E06953]" /> : 'Me'}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xl space-y-3 ${isBot ? '' : 'text-right'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-[#FAF9F5] text-[#1D1D1F] border border-[#EAE7DF] rounded-tl-sm shadow-xs'
                    : 'bg-[#1D1D1F] text-white rounded-tr-sm'
                }`}>
                  <div className="whitespace-pre-line">
                    {m.text}
                  </div>
                </div>

                {/* Suggested Books Cards if returned */}
                {m.suggestedBooks && m.suggestedBooks.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3 pt-2 text-left">
                    {m.suggestedBooks.map((b) => (
                      <div
                        key={b.book_id}
                        onClick={() => onSelectBook(b.book_id)}
                        className="p-3 rounded-2xl bg-white border border-[#EAE7DF] hover:border-[#D6D2C4] shadow-xs cursor-pointer flex items-center gap-3 group transition-all"
                      >
                        <div className="w-12 h-16 rounded overflow-hidden book-card-shadow shrink-0 bg-[#232323]">
                          <img src={b.image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h4 className="text-xs font-serif font-bold text-[#1D1D1F] truncate group-hover:text-[#E06953]">
                            {b.title}
                          </h4>
                          <p className="text-[10px] text-[#8A857A] truncate">
                            {b.authors[0]}
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[10px]">
                            <span className={`font-semibold ${b.availableCopies > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {b.availableCopies > 0 ? `${b.availableCopies} available` : 'On loan'}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#8A857A]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-[#8A857A] px-1">
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center text-xs">
              <Sparkles className="w-4 h-4 text-[#E06953]" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE7DF] text-xs text-[#8A857A] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E06953] animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E06953] animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E06953] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2">Querying library catalogue & physical stack availability...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Strip */}
      <div className="px-4 py-2 border-t border-[#F0EEE6] bg-[#FAF9F5] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] uppercase font-bold text-[#8A857A] shrink-0">Try asking:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EAE8E0] text-[#656157] hover:text-[#1D1D1F] border border-[#E8E6DF] whitespace-nowrap text-[11px] transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-4 border-t border-[#F0EEE6] bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about topics, check copy counts, or get personalized recommendations..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-full focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D1D1F]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-[#333336] transition-all disabled:opacity-40 shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
