import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, Sparkles, X, User } from 'lucide-react';

export const AIAssistant = ({ onClose, currentCode, language }) => {
    const [messages, setMessages] = useState([{
        role: 'system',
        text: "Hi! I'm your Gemini AI pair programmer. Ask me to explain code, find bugs, or suggest optimizations."
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
            const res = await axios.post(`${apiUrl}/ai/chat`, {
                prompt: userText,
                language,
                codeContext: currentCode
            });

            setMessages(prev => [...prev, { role: 'ai', text: res.data.text }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'system', text: "Error connecting to AI. Make sure GEMINI_API_KEY is configured in the backend." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#05030a] border-l border-white/10 w-80 shrink-0 shadow-2xl relative z-30">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-emerald-500/5">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles size={18} />
                    <span className="font-bold tracking-wide">Gemini AI</span>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                            m.role === 'user' ? 'bg-white/10' :
                            m.role === 'system' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                            'bg-gradient-to-br from-emerald-500 to-cyan-500 border border-emerald-400/30'
                        }`}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${
                            m.role === 'user' ? 'bg-white/10 rounded-tr-sm' :
                            m.role === 'system' ? 'bg-red-500/10 text-red-400 rounded-tl-sm border border-red-500/20' :
                            'bg-emerald-500/10 text-emerald-50 rounded-tl-sm border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                        }`}>
                            {/* Simple text split by newline for rudimentary markdown support */}
                            {m.text.split('\n').map((line, j) => (
                                <React.Fragment key={j}>
                                    {line}<br/>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center border border-emerald-400/30 animate-pulse">
                            <Bot size={14} />
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl rounded-tl-sm text-emerald-400 animate-pulse text-xs">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Gemini to explain..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};
