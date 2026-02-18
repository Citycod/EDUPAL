'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useInstitutionContext } from '@/lib/hooks/useInstitutionContext';


interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  level: string; // inferred
  lessonsCount: number; // mock
  resourcesCount: number; // mock
  image: string;
  isEnrolled: boolean;
}

interface LearningMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
  updated: string;
  icon: string;
  colorClass: string;
}

const CoursesPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', course_code: '', department_id: '' });
  const [addingCourse, setAddingCourse] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  const { institution, loading: contextLoading } = useInstitutionContext();

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      let currentProfile = null;
      if (user) {
        const { data: profile } = await supabase.from('hub_profiles').select('*').eq('id', user.id).single();
        currentProfile = profile;
        setUserProfile(profile);
      }

      // Fetch Departments for the modal using context
      if (institution?.id) {
        const { data: deptData } = await supabase.from('hub_departments').select('*').eq('institution_id', institution.id);
        setDepartments(deptData || []);
      }

      // 2. Fetch Refined Courses
      let query = supabase.from('hub_courses').select(`
        *,
        hub_departments (name, institution_id)
      `);

      // Filter by institution from context
      if (institution?.id) {
        query = query.eq('institution_id', institution.id);
      }

      const { data: coursesData } = await query.order('course_code');

      if (coursesData) {
        const formattedCourses = coursesData.map((c: any) => ({
          id: c.id,
          title: c.title,
          code: c.course_code,
          instructor: 'Department Faculty',
          level: `${c.level}L`,
          image: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop`,
          isEnrolled: false, // Simplified for now
          department_id: c.department_id
        }));

        const prioritizedCourses = formattedCourses.sort((a: any, b: any) => {
          const userDept = currentProfile?.department || currentProfile?.department_id;
          const aDeptMatch = a.department_id === userDept;
          const bDeptMatch = b.department_id === userDept;
          if (aDeptMatch && !bDeptMatch) return -1;
          if (!aDeptMatch && bDeptMatch) return 1;

          const aLevelMatch = String(a.level?.replace('L', '')) === String(currentProfile?.level);
          const bLevelMatch = String(b.level?.replace('L', '')) === String(currentProfile?.level);
          if (aLevelMatch && !bLevelMatch) return -1;
          if (!aLevelMatch && bLevelMatch) return 1;

          return 0;
        });

        setCourses(prioritizedCourses);
      }

      // 3. Fetch Latest Resources
      const { data: resourcesData } = await supabase
        .from('hub_resources')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });

      if (resourcesData) {
        const formattedMaterials = resourcesData.map((r: any) => {
          const isPDF = r.type?.includes('PDF');
          return {
            id: r.id,
            title: r.course_title || r.title,
            type: r.type || 'Document',
            size: r.file_size || '1.5 MB',
            updated: new Date(r.created_at).toLocaleDateString(),
            icon: isPDF ? 'picture_as_pdf' : 'article',
            colorClass: isPDF ? 'text-red-500 bg-red-500/20' : 'text-blue-500 bg-blue-500/20'
          };
        });
        setMaterials(formattedMaterials);
      }

    } catch (error) {
      console.error("Error fetching courses data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (institution?.id) {
      fetchData();
    }
  }, [institution?.id]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCourse(true);
    try {
      const levelMatch = newCourse.course_code.match(/\d+/);
      const level = levelMatch ? `${Math.floor(parseInt(levelMatch[0]) / 100) * 100}` : '100';

      const { error } = await supabase.from('hub_courses').insert({
        title: newCourse.title,
        course_code: newCourse.course_code.toUpperCase(),
        department_id: newCourse.department_id,
        level: level,
        institution_id: institution?.id // Explicitly set institution_id
      });

      if (error) throw error;

      setIsAddModalOpen(false);
      setNewCourse({ title: '', course_code: '', department_id: '' });
      fetchData();
    } catch (error: any) {
      alert(`Error adding course: ${error.message}`);
    } finally {
      setAddingCourse(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesLevel = true;
    if (activeLevel === 'Beginner') matchesLevel = course.level === '100L' || course.level === '200L';
    if (activeLevel === 'Intermediate') matchesLevel = course.level === '300L';
    if (activeLevel === 'Advanced') matchesLevel = course.level === '400L' || course.level === '500L';

    return matchesSearch && matchesLevel;
  });


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Courses...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
        {/* Top Bar */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-40 border-b border-white/5">
          <div
            onClick={() => router.back()}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tighter uppercase flex-1 text-center">Course Catalog</h2>
          <div className="flex w-12 items-center justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-primary p-0"
            >
              <span className="material-symbols-outlined text-2xl font-black">add_circle</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-14 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-lg shadow-primary/5 transition-all focus-within:ring-2 focus-within:ring-primary/50">
              <div className="text-slate-400 flex border-none bg-white dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex w-full min-w-0 flex-1 bg-white dark:bg-surface-dark rounded-r-xl text-slate-900 dark:text-white focus:outline-0 border-none px-4 text-base font-bold placeholder:text-slate-400 placeholder:font-normal"
                placeholder="Find a course or material..."
              />
            </div>
          </label>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar scrollbar-hide">
          {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`flex h-10 shrink-0 items-center justify-center rounded-xl px-5 transition-all text-xs font-black uppercase tracking-widest border ${activeLevel === level
                ? 'bg-primary border-primary text-background-dark shadow-md shadow-primary/20'
                : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary/50'
                }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Section: Courses */}
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight leading-tight">
            Active Boards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => router.push(`/classes/${course.id}`)}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-all group active:scale-[0.98]"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-primary text-[10px] uppercase font-black tracking-widest bg-primary/10 px-2 py-0.5 rounded">{course.level}</span>
                  <h3 className="text-slate-900 dark:text-white text-lg font-black leading-tight mt-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">{course.code}</span>
                    <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Open Board</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-all">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">sentiment_dissatisfied</span>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No boards found in this level</p>
            </div>
          )}
        </div>

        {/* Section: Learning Materials */}
        <div className="px-5 pb-4 pt-10">
          <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight leading-tight">Latest Materials</h2>
        </div>

        <div className="px-4 space-y-3 pb-8">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-all group active:scale-[0.98]">
              <div className={`size-12 rounded-xl flex items-center justify-center border ${material.colorClass.split(' ')[1]} ${material.colorClass.split(' ')[0].replace('text-', 'border-').replace('500', '100')}`}>
                <span className={`material-symbols-outlined text-2xl ${material.colorClass.split(' ')[0]}`}>{material.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-900 dark:text-white font-black text-sm truncate uppercase tracking-tight">{material.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{material.type}</span>
                  <span className="text-slate-300 dark:text-slate-800">•</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{material.updated}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-all">
                <span className="material-symbols-outlined text-xl">download</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => router.push('/library')}
            className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-black uppercase text-[11px] tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            Go to Full Archive
          </button>
        </div>

      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">New Board</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Initialize a new course board</p>

            <form onSubmit={handleAddCourse} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Title</label>
                <input
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-surface-dark border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                  placeholder="e.g. Introduction to Law"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Code</label>
                <input
                  required
                  value={newCourse.course_code}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, course_code: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-surface-dark border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                  placeholder="e.g. LAW 101"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Department</label>
                <select
                  required
                  className="w-full bg-slate-50 dark:bg-surface-dark border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:outline-none focus:border-primary transition-all font-bold"
                  value={newCourse.department_id}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, department_id: e.target.value }))}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCourse || !newCourse.title || !newCourse.course_code || !newCourse.department_id}
                  className="flex-1 bg-primary text-background-dark font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.95] disabled:opacity-50 uppercase text-xs tracking-widest"
                >
                  {addingCourse ? 'Creating...' : 'Initialize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default CoursesPage;
