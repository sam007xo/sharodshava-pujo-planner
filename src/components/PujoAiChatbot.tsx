import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Flame, 
  RotateCcw,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { askGeminiPujoAi } from '../services/geminiAi';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

const INITIAL_BOT_MESSAGES: BotMessage[] = [
  {
    id: 'intro-1',
    sender: 'bot',
    text: 'নমস্কার! I am your Sharodshav Pujo AI powered by Google Gemini. Ask me about nearby pandals, route timings, food hotspots, or metro lines — I reply in short, location-grounded answers!',
    timestamp: 'Just now',
    chips: [
      'Top pandals near my location?',
      'Sandhi Puja time for Ashtami?',
      'Famous food near Bagbazar?',
      'Late night Metro schedule?'
    ]
  }
];

export const PujoAiChatbot: React.FC = () => {
  const { coordinates, locality } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>(INITIAL_BOT_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const reply = await askGeminiPujoAi(text, {
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        locality: locality || 'Kolkata'
      });

      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('[PujoAiChatbot] Response error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button on Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(prev => !prev)}
          className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e6ca65] to-[#d4af37] text-black shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.6)] flex items-center justify-center cursor-pointer transition-all border border-amber-200/50"
          title="Ask Sharodshav Pujo AI"
        >
          {/* Animated beacon ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#0b0d13]" />
          </span>

          <div className="flex items-center gap-2">
            <Bot size={22} className="text-black" />
            <span className="text-xs font-bold font-sans hidden sm:inline tracking-tight">
              Pujo AI
            </span>
          </div>
        </motion.button>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[380px] h-[500px] max-h-[80vh] rounded-3xl glass-panel border border-[#d4af37]/40 shadow-2xl z-50 overflow-hidden flex flex-col bg-[#0b0d13]/95 backdrop-blur-2xl text-left"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                  <Flame size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Sharodshav AI</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono flex items-center gap-1">
                      <Sparkles size={9} />
                      GEMINI
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-white/50">
                    <MapPin size={9} className="text-[#d4af37]" />
                    <span className="truncate max-w-[140px]">{locality || 'Kolkata'} GPS Grounded</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(INITIAL_BOT_MESSAGES)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                  title="Reset Chat"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className="space-y-2">
                    <div className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
                      {isBot && (
                        <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0 mt-0.5 border border-[#d4af37]/40">
                          <Bot size={13} />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isBot
                          ? 'bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-xs'
                          : 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-black font-semibold rounded-tr-xs shadow-md'
                      }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[8px] block text-right mt-1 ${isBot ? 'text-white/40' : 'text-black/60'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Chips if present */}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-1 pl-8">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 text-[10px] text-[#f4e5a9] transition-all text-left cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 pl-2 text-xs text-white/50">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/40">
                    <Bot size={12} />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-2 rounded-2xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pandals, food, timings..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-[#d4af37] text-black hover:bg-[#e6ca65] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
