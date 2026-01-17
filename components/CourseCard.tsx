
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div 
      onClick={() => onClick(course)}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all cursor-pointer group border border-slate-100 flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm">
            {course.level || 'Beginner'}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
          {course.chapters.length} Modules
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
          {course.category || 'Development'}
        </div>
        <h3 className="font-bold text-xl text-slate-800 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>
        
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden border border-white shadow-sm">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor}`} alt={course.instructor} />
            </div>
            <span className="text-xs text-slate-600 font-semibold">{course.instructor}</span>
          </div>
          <div className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            VIEW <i className="fas fa-chevron-right text-[10px]"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
