
import React from 'react';
import { Chapter, ContentType } from '../types';
import { marked } from 'marked';

interface ContentViewerProps {
  chapter: Chapter;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ chapter }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-3">
          <i className="fas fa-layer-group"></i> Module
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{chapter.title}</h1>
        <p className="text-slate-500 text-lg leading-relaxed">{chapter.description}</p>
      </div>

      <div className="space-y-16">
        {chapter.content.map((item) => (
          <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">
                {item.type === ContentType.VIDEO && <i className="fas fa-play"></i>}
                {item.type === ContentType.AUDIO && <i className="fas fa-headphones"></i>}
                {item.type === ContentType.TEXT && <i className="fas fa-paragraph"></i>}
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{item.title}</h3>
            </div>

            {item.type === ContentType.VIDEO && item.url && (
              <div className="group relative">
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                  <video 
                    className="w-full h-full"
                    controls
                    poster={`https://picsum.photos/seed/${item.id}/1280/720`}
                  >
                    <source src={item.url} type="video/mp4" />
                  </video>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-colors"></div>
              </div>
            )}

            {item.type === ContentType.AUDIO && item.url && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 text-2xl">
                   <i className="fas fa-waveform animate-pulse"></i>
                </div>
                <audio controls className="w-full h-10">
                  <source src={item.url} type="audio/mpeg" />
                </audio>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Fidelity Audio Lesson</p>
              </div>
            )}

            {item.type === ContentType.TEXT && (
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-loose prose-strong:text-indigo-600 prose-pre:bg-slate-900 prose-code:text-indigo-600">
                <div 
                  className="text-slate-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: marked.parse(item.body || "This section contains curated reading material.") }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentViewer;
