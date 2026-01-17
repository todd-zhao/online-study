
import React, { useState, useRef, useEffect } from 'react';
import { Message, Course, Chapter, DifyConfig } from '../types';
import { getDifyCoachResponse } from '../services/coachService';
import { marked } from 'marked';

interface AICoachProps {
  course: Course;
  chapter: Chapter;
  difyConfig: DifyConfig;
}

const AICoach: React.FC<AICoachProps> = ({ course, chapter, difyConfig }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好啊，我是Seed，你的销售教练' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMsg: Message = { role: 'user', content: userText };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getDifyCoachResponse(
        userText,
        course,
        chapter,
        difyConfig,
        conversationId
      );

      setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
      setConversationId(result.conversationId);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the Dify agent." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-lg shadow-indigo-100">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-none mb-1">销售教练Seed</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Dify</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm prose prose-sm prose-slate ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none prose-invert font-medium' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium prose-p:my-1'
            }`}>
              <div 
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your Dify coach..."
            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl pl-5 pr-14 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
