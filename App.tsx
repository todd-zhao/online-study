
import React, { useState, useRef } from 'react';
import { Course, Chapter, ContentType, ContentItem, User, DifyConfig, UserRole } from './types';
import CourseCard from './components/CourseCard';
import ChapterNavigation from './components/ChapterNavigation';
import ContentViewer from './components/ContentViewer';
import AICoach from './components/AICoach';

const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Visual Identity & Brand Strategy',
    description: 'A deep dive into creating cohesive brands that resonate with audiences and stand the test of time.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop',
    instructor: 'David Aaker',
    category: 'Design',
    level: 'Intermediate',
    chapters: [
      {
        id: 'c1',
        title: 'The Core of Brand Identity',
        description: 'Defining values, mission, and visual linguistics.',
        content: [
          {
            id: 'v1',
            type: ContentType.VIDEO,
            title: 'Welcome: Brand Philosophy',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          {
            id: 't1',
            type: ContentType.TEXT,
            title: 'Reading: Strategy vs Design',
            body: `### Why Strategy Matters\nBrand strategy is the **long-term plan** for the development of a successful brand.\n\n#### Key Takeaways:\n1. **Consistency**: Ensure all touchpoints align.\n2. **Emotional Connection**: Brands are felt, not just seen.\n3. **Differentiation**: What makes you unique?\n\n> "A brand is no longer what we tell the consumer it is — it is what consumers tell each other it is." - Scott Cook`
          }
        ]
      }
    ]
  }
];

const App: React.FC = () => {
  // Auth & Config State
  const [user, setUser] = useState<User | null>(null);
  const [difyConfig, setDifyConfig] = useState<DifyConfig>({
    apiKey: '',
    baseUrl: 'https://api.dify.ai/v1'
  });

  // App Navigation State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [view, setView] = useState<'login' | 'dashboard' | 'viewer' | 'builder' | 'settings'>('login');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  // Builder State
  const [builderCourse, setBuilderCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: 'Design',
    level: 'Beginner',
    chapters: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ chapterIdx: number, contentIdx: number } | null>(null);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: role === 'admin' ? 'adm-01' : 'std-01',
      name: role === 'admin' ? 'Administrator' : 'Student User',
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    });
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setSelectedCourse(null);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setActiveChapter(course.chapters[0]);
    setView('viewer');
  };

  const handleCreateCourse = () => {
    if (!builderCourse.title || !builderCourse.chapters?.length) return;
    
    const finalCourse: Course = {
      ...builderCourse as Course,
      id: Date.now().toString(),
      instructor: user?.name || 'Admin',
      thumbnail: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&sig=${Date.now()}`,
      chapters: builderCourse.chapters
    };

    setCourses([...courses, finalCourse]);
    setView('dashboard');
    setBuilderCourse({ title: '', description: '', category: 'Design', level: 'Beginner', chapters: [] });
  };

  const addChapterToBuilder = () => {
    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: '',
      description: '',
      content: []
    };
    setBuilderCourse(prev => ({ ...prev, chapters: [...(prev.chapters || []), newChapter] }));
  };

  const addContentToChapter = (chapterIdx: number, type: ContentType) => {
    const newContent: ContentItem = {
      id: `cnt-${Date.now()}`,
      type,
      title: '',
      url: '',
      body: ''
    };
    const updatedChapters = [...(builderCourse.chapters || [])];
    updatedChapters[chapterIdx].content.push(newContent);
    setBuilderCourse({ ...builderCourse, chapters: updatedChapters });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const url = URL.createObjectURL(file);
      const updatedChapters = [...(builderCourse.chapters || [])];
      updatedChapters[uploadTarget.chapterIdx].content[uploadTarget.contentIdx].url = url;
      updatedChapters[uploadTarget.chapterIdx].content[uploadTarget.contentIdx].title = 
        updatedChapters[uploadTarget.chapterIdx].content[uploadTarget.contentIdx].title || file.name;
      setBuilderCourse({ ...builderCourse, chapters: updatedChapters });
      setUploadTarget(null);
    }
  };

  const triggerUpload = (chapterIdx: number, contentIdx: number) => {
    setUploadTarget({ chapterIdx, contentIdx });
    fileInputRef.current?.click();
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl mb-6 shadow-xl shadow-indigo-100">
              <i className="fas fa-bolt-lightning"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to EduFlow</h1>
            <p className="text-slate-500 font-medium mt-2">Select your role to continue</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleLogin('admin')}
              className="group bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-4 hover:bg-indigo-600 transition-all text-left shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl group-hover:bg-white group-hover:text-indigo-600 transition-all">
                <i className="fas fa-user-shield"></i>
              </div>
              <div>
                <span className="block font-black text-lg">Administrator</span>
                <span className="block text-xs opacity-70 font-bold uppercase tracking-widest">Full Control & API Settings</span>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('student')}
              className="group bg-white border-2 border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:border-indigo-600 transition-all text-left hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div>
                <span className="block font-black text-lg text-slate-900">Student</span>
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest">Learn & Access AI Coach</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="video/*,audio/*"
        onChange={handleFileUpload}
      />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <i className="fas fa-bolt-lightning text-lg"></i>
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900">EduFlow <span className="text-indigo-600">Pro</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-indigo-600' : 'hover:text-slate-900 transition-colors'}>Dashboard</button>
          
          {user?.role === 'admin' && (
            <>
              <button onClick={() => setView('builder')} className={view === 'builder' ? 'text-indigo-600' : 'hover:text-slate-900 transition-colors'}>Course Builder</button>
              <button onClick={() => setView('settings')} className={view === 'settings' ? 'text-indigo-600' : 'hover:text-slate-900 transition-colors'}>API Settings</button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block leading-none">
            <span className="block font-black text-slate-900 text-sm">{user?.name}</span>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${user?.role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
              {user?.role} Access
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border border-slate-100"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                  {user?.role === 'admin' ? 'Curriculum Management' : 'Discover Your Future'}
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-2xl">
                  {user?.role === 'admin' 
                    ? 'Oversee courses, manage learning modules, and configure intelligent agents.' 
                    : 'Embark on a personalized learning path powered by world-class curriculum and AI assistance.'}
                </p>
              </div>
              
              {user?.role === 'admin' && (
                <div className="flex gap-3">
                   <button 
                    onClick={() => setView('settings')}
                    className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3"
                  >
                    <i className="fas fa-cog"></i> Config Dify
                  </button>
                  <button 
                    onClick={() => setView('builder')}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
                  >
                    <i className="fas fa-plus"></i> New Course
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
              
              {user?.role === 'admin' && (
                <div 
                  onClick={() => setView('builder')}
                  className="group h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                    <i className="fas fa-layer-group text-2xl group-hover:text-indigo-600"></i>
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">Build New Module</span>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'settings' && user?.role === 'admin' && (
          <div className="max-w-3xl mx-auto py-16 px-6">
            <div className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Platform Settings</h1>
              <p className="text-slate-500 font-medium">Configure the global Dify API settings for the AI Coach.</p>
            </div>

            <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-2xl space-y-10">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  <i className="fas fa-plug"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Dify Integration</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">External Intelligence Service</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Base API URL</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-5 py-4 outline-none transition-all font-bold text-slate-700"
                    placeholder="https://api.dify.ai/v1"
                    value={difyConfig.baseUrl}
                    onChange={e => setDifyConfig({...difyConfig, baseUrl: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 mt-2">The endpoint of your Dify self-hosted or cloud instance.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">API Secret Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-5 py-4 outline-none transition-all font-bold text-slate-700"
                      placeholder="app-xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={difyConfig.apiKey}
                      onChange={e => setDifyConfig({...difyConfig, apiKey: e.target.value})}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 opacity-50">
                      <i className="fas fa-lock"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={() => setView('dashboard')}
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all"
                >
                  Save Global Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'builder' && user?.role === 'admin' && (
          <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Course Studio</h1>
                <p className="text-slate-500 font-medium">Design an engaging learning experience with mixed media.</p>
              </div>
              <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-slate-900 font-bold text-sm">Cancel</button>
            </div>

            <div className="space-y-12">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Course Title</label>
                    <input 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold"
                      placeholder="e.g. Master Class: Branding"
                      value={builderCourse.title}
                      onChange={e => setBuilderCourse({...builderCourse, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                    <select 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-bold"
                      value={builderCourse.category}
                      onChange={e => setBuilderCourse({...builderCourse, category: e.target.value})}
                    >
                      <option>Design</option>
                      <option>Business</option>
                      <option>Marketing</option>
                      <option>Technology</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Course Description</label>
                  <textarea 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-5 py-3 outline-none transition-all font-medium resize-none h-24"
                    placeholder="Tell your students what to expect..."
                    value={builderCourse.description}
                    onChange={e => setBuilderCourse({...builderCourse, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="font-black text-2xl tracking-tight text-slate-900">Curriculum Structure</h3>
                   <button 
                    onClick={addChapterToBuilder}
                    className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-100 transition-all"
                   >
                     <i className="fas fa-plus"></i> New Module
                   </button>
                </div>

                {builderCourse.chapters?.map((ch, chIdx) => (
                  <div key={ch.id} className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
                    <div className="bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-100">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">{chIdx + 1}</span>
                            <input 
                              className="bg-transparent border-none outline-none font-black text-xl text-slate-900 w-full placeholder:text-slate-300"
                              placeholder="Module Title..."
                              value={ch.title}
                              onChange={e => {
                                const updated = [...(builderCourse.chapters || [])];
                                updated[chIdx].title = e.target.value;
                                setBuilderCourse({...builderCourse, chapters: updated});
                              }}
                            />
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => addContentToChapter(chIdx, ContentType.VIDEO)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><i className="fas fa-video"></i></button>
                         <button onClick={() => addContentToChapter(chIdx, ContentType.AUDIO)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><i className="fas fa-headphones"></i></button>
                         <button onClick={() => addContentToChapter(chIdx, ContentType.TEXT)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><i className="fas fa-file-alt"></i></button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {ch.content.map((cnt, cntIdx) => (
                        <div key={cnt.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <input 
                                className="bg-transparent border-none outline-none font-bold text-slate-800 w-full placeholder:text-slate-400"
                                placeholder="Lesson Title..."
                                value={cnt.title}
                                onChange={e => {
                                  const updated = [...(builderCourse.chapters || [])];
                                  updated[chIdx].content[cntIdx].title = e.target.value;
                                  setBuilderCourse({...builderCourse, chapters: updated});
                                }}
                              />
                            <button onClick={() => {
                                const updated = [...(builderCourse.chapters || [])];
                                updated[chIdx].content.splice(cntIdx, 1);
                                setBuilderCourse({...builderCourse, chapters: updated});
                              }} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                          </div>
                          {cnt.type === ContentType.TEXT ? (
                            <textarea 
                              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium resize-none h-40 outline-none focus:ring-2 focus:ring-indigo-600"
                              placeholder="Supports Markdown Syntax..."
                              value={cnt.body}
                              onChange={e => {
                                const updated = [...(builderCourse.chapters || [])];
                                updated[chIdx].content[cntIdx].body = e.target.value;
                                setBuilderCourse({...builderCourse, chapters: updated});
                              }}
                            />
                          ) : (
                            <div className="flex gap-4">
                              <input className="flex-1 bg-white border rounded-lg px-4 py-2" placeholder="URL..." value={cnt.url} onChange={e => {
                                const updated = [...(builderCourse.chapters || [])];
                                updated[chIdx].content[cntIdx].url = e.target.value;
                                setBuilderCourse({...builderCourse, chapters: updated});
                              }} />
                              <button onClick={() => triggerUpload(chIdx, cntIdx)} className="bg-white border rounded-lg px-4 py-2 text-xs font-bold">Upload</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex justify-end">
                <button onClick={handleCreateCourse} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-2xl transition-all">Publish Course</button>
              </div>
            </div>
          </div>
        )}

        {view === 'viewer' && selectedCourse && activeChapter && (
          <div className="flex h-[calc(100vh-73px)]">
            <aside className="w-80 border-r border-slate-100 hidden lg:block overflow-hidden bg-white">
              <ChapterNavigation 
                course={selectedCourse} 
                activeChapterId={activeChapter.id}
                onChapterSelect={setActiveChapter}
              />
            </aside>

            <div className="flex-1 overflow-y-auto scroll-smooth bg-white">
              <ContentViewer chapter={activeChapter} />
              <div className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-100 flex justify-between items-center">
                <button className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  <i className="fas fa-chevron-left"></i> Previous Module
                </button>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all">
                  Next Module <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {isCoachOpen && (
              <div className="w-96 border-l border-slate-100 animate-in slide-in-from-right duration-300 bg-slate-50/30">
                <AICoach course={selectedCourse} chapter={activeChapter} difyConfig={difyConfig} />
              </div>
            )}
          </div>
        )}
      </main>

      {view === 'viewer' && (
        <button 
          onClick={() => setIsCoachOpen(!isCoachOpen)}
          className={`fixed bottom-8 right-8 w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center transition-all z-50 transform hover:scale-110 active:scale-95 ${
            isCoachOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-indigo-600 text-white'
          }`}
        >
          <i className={`fas ${isCoachOpen ? 'fa-times' : 'fa-brain'} text-2xl`}></i>
        </button>
      )}
    </div>
  );
};

export default App;
