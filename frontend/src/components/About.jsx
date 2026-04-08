import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, Code, Zap, Globe, Cpu } from 'lucide-react';

export const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white font-sans selection:bg-emerald-500/30">
            {/* Navigation Bar */}
            <nav className="flex items-center px-8 py-6 max-w-7xl mx-auto z-10 relative">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-8 pt-12 pb-32 animate-fade-in relative z-10">
                {/* Decorative background glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="text-center mb-16">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-4xl shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto mb-8">
                        D
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Hi, I'm <span className="text-gradient">Dinesh</span></h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Creator of Colab-Code. A passionate full-stack developer dedicated to building high-performance, real-time web applications.
                    </p>
                </div>

                <div className="glass-card p-10 mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Code className="text-emerald-400" /> Why I Built Colab-Code
                    </h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                        <p>
                            I created Colab-Code because I wanted a frictionless, instant way to pair-program and conduct technical interviews. Most solutions required accounts, downloads, or were bloated with unnecessary features.
                        </p>
                        <p>
                            I challenged myself to build an architecture utilizing <strong>WebSockets</strong> for sub-30ms latency keystroke syncing, integrated an enterprise-grade execution engine (<strong>JDoodle</strong>), and engineered a clean, ephemeral session state using <strong>MongoDB</strong>.
                        </p>
                        <p>
                            Recently, I injected a custom <strong>WebRTC</strong> video layer and a <strong>Gemini AI</strong> integration to push the boundaries of what an in-browser development environment can achieve.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <Cpu className="text-cyan-400 mx-auto mb-4" size={28} />
                        <h3 className="font-bold mb-2">Modern Stack</h3>
                        <p className="text-sm text-white/50">React, Node.js, Express, Socket.io, MongoDB</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <Zap className="text-emerald-400 mx-auto mb-4" size={28} />
                        <h3 className="font-bold mb-2">Real-time Performance</h3>
                        <p className="text-sm text-white/50">Optimized WebSocket payload broadcasting</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl text-center">
                        <Globe className="text-cyan-400 mx-auto mb-4" size={28} />
                        <h3 className="font-bold mb-2">WebRTC & GenAI</h3>
                        <p className="text-sm text-white/50">Peer-to-peer media streams & Gemini coding assistant</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    <a href="https://github.com/DineshDumka/" target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                        <Github className="text-white/50 group-hover:text-emerald-400 transition-colors" />
                        GitHub Profile
                    </a>
                    <a href="https://www.linkedin.com/in/DineshDumka/" target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                        <Linkedin className="text-white/50 group-hover:text-blue-400 transition-colors" />
                        LinkedIn
                    </a>
                </div>
            </main>
        </div>
    );
};
