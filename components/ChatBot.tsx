import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

interface ChatBotProps {
  userRole: 'CUSTOMER' | 'PARTNER' | 'REGION';
  userName: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatBot: React.FC<ChatBotProps> = ({ userRole, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: `Hi ${userName}! How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMessages = [
        ...messages, 
        { id: Date.now().toString(), text: userMsg, sender: 'user' as const }
    ];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = newMessages.map(m => ({
          role: m.sender,
          parts: [{ text: m.text }]
      }));

      const reply = await chatWithAI(userMsg, userRole, history);
      
      setMessages(prev => [
          ...prev, 
          { id: (Date.now() + 1).toString(), text: reply, sender: 'bot' }
      ]);
    } catch (error) {
       setMessages(prev => [
          ...prev, 
          { id: (Date.now() + 1).toString(), text: "I'm having trouble connecting right now. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Window */}
        {isOpen && (
            <div className="bg-white w-[90vw] md:w-96 h-[500px] rounded-3xl shadow-2xl border border-brand-200 mb-4 flex flex-col overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-brand-900 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-full">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Prelook Assistant</h3>
                            <span className="text-[10px] text-brand-200 uppercase tracking-wider block">
                                {userRole === 'REGION' ? 'Franchise Support' : userRole === 'PARTNER' ? 'Partner Support' : 'Customer Support'}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-brand-300 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed
                                    ${msg.sender === 'user' 
                                        ? 'bg-brand-800 text-white rounded-br-none' 
                                        : 'bg-white text-brand-900 border border-brand-100 rounded-bl-none shadow-sm'
                                    }
                                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="bg-white border border-brand-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-1">
                                 <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                                 <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-75"></div>
                                 <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-150"></div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-100 shrink-0 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="p-2 bg-brand-900 text-white rounded-xl hover:bg-black disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        )}

        {/* Toggle Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-brand-100 text-brand-900' : 'bg-brand-900 text-white'}`}
        >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
    </div>
  );
};