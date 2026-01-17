
import React from 'react';
import { Course, Chapter, ContentType } from '../types';

interface ChapterNavigationProps {
  course: Course;
  activeChapterId: string;
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({ course, activeChapterId, onChapterSelect }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h2 className="font-black text-slate-900 text-lg mb-1">{course.title}</h2>
        <p className="text-xs text-slate-500 font-medium">{course.chapters.length} Chapters • {course.instructor}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {course.chapters.map((chapter, idx) => {
          const isActive = activeChapterId === chapter.id;
          return (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(chapter)}
              className={`w-full text-left group transition-all duration-200 rounded-xl p-3 border-2 ${
                isActive 
                  ? 'bg-white border-indigo-600 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {chapter.title}
                  </h4>
                  <div className="flex gap-2 mt-1 opacity-70">
                    {chapter.content.some(c => c.type === ContentType.VIDEO) && <i className="fas fa-circle-play text-[10px]"></i>}
                    {chapter.content.some(c => c.type === ContentType.AUDIO) && <i className="fas fa-volume-up text-[10px]"></i>}
                    {chapter.content.some(c => c.type === ContentType.TEXT) && <i className="fas fa-file-lines text-[10px]"></i>}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterNavigation;
