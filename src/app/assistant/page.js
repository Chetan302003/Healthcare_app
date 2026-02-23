'use client';

import { useState } from 'react';
import css from './assistant.module.css';
import { Send, Bot, User } from 'lucide-react';

export default function Assistant() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your HealthCare+ AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currInput = input;
        const newMsg = { id: Date.now(), text: currInput, isBot: false };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currInput })
            });
            const data = await res.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply,
                isBot: true
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Network error connecting to AI.",
                isBot: true
            }]);
        }
    };

    const suggestions = [
        "What does high LDL mean?",
        "Remind me to take Aspirin",
        "Explain my latest blood test"
    ];

    return (
        <div className={css.container}>
            <header className={css.header}>
                <div className={css.botAvatar}>
                    <Bot size={24} color="white" />
                </div>
                <div>
                    <h2>AI Health Assistant</h2>
                    <p>Always here for you</p>
                </div>
            </header>

            <div className={css.chatArea}>
                {messages.map(msg => (
                    <div key={msg.id} className={`${css.messageRow} ${msg.isBot ? css.botRow : css.userRow}`}>
                        {msg.isBot && <div className={css.msgAvatar}><Bot size={16} color="white" /></div>}
                        <div className={`${css.messageBubble} ${msg.isBot ? css.botBubble : css.userBubble}`}>
                            {msg.text}
                        </div>
                        {!msg.isBot && <div className={`${css.msgAvatar} ${css.userAvatar}`}><User size={16} /></div>}
                    </div>
                ))}
            </div>

            <div className={css.suggestions}>
                {suggestions.map((s, i) => (
                    <button key={i} className={css.suggestionChip} onClick={() => setInput(s)}>{s}</button>
                ))}
            </div>

            <form onSubmit={handleSend} className={css.inputArea}>
                <input
                    type="text"
                    placeholder="Ask me anything about your health..."
                    className={css.input}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className={css.sendBtn} disabled={!input.trim()}>
                    <Send size={20} color="white" />
                </button>
            </form>
        </div>
    );
}
