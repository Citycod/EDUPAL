'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch Courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (coursesData) {
          // Check enrollments for current user to mark "ENROLLED"
          const { data: enrollments } = user ? await supabase
            .from('enrollments')
            .select('course_id')
            .eq('user_id', user.id) : { data: [] };

          const enrolledIds = new Set(enrollments?.map(e => e.course_id));

          const formattedCourses = coursesData.map((c: any, index: number) => {
            // Infer level from code (e.g., CSC 101 -> 1)
            const codeMatch = c.course_code.match(/\d+/);
            const levelNum = codeMatch ? Math.floor(parseInt(codeMatch[0]) / 100) : 1;

            return {
              id: c.id,
              title: c.title,
              code: c.course_code,
              instructor: c.instructor_name || 'EduPal Instructor',
              level: `Level ${levelNum}`,
              lessonsCount: 12 + (index % 5), // Mock
              resourcesCount: 4 + (index % 3), // Mock
              image: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop`,
              isEnrolled: enrolledIds.has(c.id)
            };
          });
          setCourses(formattedCourses);
        }

        // 2. Fetch Resources (Learning Materials)
        const { data: resourcesData } = await supabase
          .from('resources')
          .select('*')
          .limit(5)
          .order('created_at', { ascending: false });

        if (resourcesData) {
          const formattedMaterials = resourcesData.map((r: any) => {
            let icon = 'article';
            let colorClass = 'text-blue-500 bg-blue-500/20';

            if (r.type?.includes('PDF')) {
              icon = 'picture_as_pdf';
              colorClass = 'text-red-500 bg-red-500/20';
            } else if (r.type?.includes('Video')) {
              icon = 'play_circle';
              colorClass = 'text-primary bg-primary/20';
            } else if (r.type?.includes('Zip')) {
              icon = 'folder_zip';
              colorClass = 'text-yellow-500 bg-yellow-500/20';
            }

            return {
              id: r.id,
              title: r.title,
              type: r.type || 'Document',
              size: r.file_size || '1.2 MB',
              updated: new Date(r.created_at).toLocaleDateString(),
              icon,
              colorClass
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

    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesLevel = true;
    if (activeLevel === 'Beginner') matchesLevel = course.level === 'Level 1' || course.level === 'Level 2';
    if (activeLevel === 'Intermediate') matchesLevel = course.level === 'Level 3';
    if (activeLevel === 'Advanced') matchesLevel = course.level === 'Level 4' || course.level === 'Level 5';

    return matchesSearch && matchesLevel;
  });

  const navItems = [
    { icon: "home", label: "Home", active: false, onClick: () => router.push('/home') },
    { icon: "menu_book", label: "Library", active: false, onClick: () => router.push('/library') },
    { icon: "school", label: "Courses", active: true, onClick: () => router.push('/classes') },
    { icon: "forum", label: "Community", active: false, onClick: () => router.push('/community') },
    { icon: "person", label: "Profile", active: false, onClick: () => router.push('/profile') }
  ];

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
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">EduPal Learning</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-slate-900 dark:text-white p-0">
              <span className="material-symbols-outlined text-2xl">more_vert</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#9db9a8] flex border-none bg-[#28392f]/10 dark:bg-[#28392f] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#28392f]/10 dark:bg-[#28392f] focus:border-none h-full placeholder:text-[#9db9a8] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal"
                placeholder="Search for courses or materials"
              />
            </div>
          </label>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex gap-3 p-3 overflow-x-auto no-scrollbar scrollbar-hide">
          {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${activeLevel === level
                ? 'bg-primary text-background-dark'
                : 'bg-[#28392f]/20 dark:bg-[#28392f] text-slate-900 dark:text-white'
                }`}
            >
              <p className={`text-sm ${activeLevel === level ? 'font-bold' : 'font-medium'} leading-normal`}>{level}</p>
              {activeLevel !== level && <span className="material-symbols-outlined text-lg">expand_more</span>}
            </button>
          ))}
        </div>

        {/* Section: Courses */}
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
            {activeLevel === 'All Levels' ? 'All Courses' : `${activeLevel} Courses`}
          </h2>
          <button className="text-primary text-sm font-semibold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => router.push(`/classes/${course.id}`)}
                className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1c2720] p-4 shadow-sm border border-slate-200 dark:border-white/5 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <span className="text-primary text-[10px] uppercase font-bold tracking-wider">{course.level}</span>
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">{course.title}</p>
                  <p className="text-slate-500 dark:text-[#9db9a8] text-xs font-normal leading-normal">
                    {course.lessonsCount} Lessons • {course.resourcesCount} Resources
                  </p>
                  <div className="flex gap-2 mt-2">
                    {course.isEnrolled ? (
                      <span className="bg-[#28392f]/30 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">ENROLLED</span>
                    ) : (
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">FREE</span>
                    )}
                  </div>
                </div>
                <div
                  className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url("${course.image}")` }}
                ></div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No courses found for this filter.</p>
            </div>
          )}
        </div>

        {/* Section: Learning Materials */}
        <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8">Learning Materials</h2>
        <div className="px-4 space-y-3 pb-8">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center gap-4 bg-[#28392f]/10 dark:bg-[#28392f] p-4 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors group">
              <div className={`size-12 rounded-lg flex items-center justify-center ${material.colorClass.split(' ')[1]}`}>
                <span className={`material-symbols-outlined ${material.colorClass.split(' ')[0]}`}>{material.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-900 dark:text-white font-semibold text-sm truncate">{material.title}</h4>
                <p className="text-xs text-slate-500 dark:text-[#9db9a8]">{material.size} • Updated {material.updated}</p>
              </div>
              <button className="text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">{material.icon === 'open_in_new' ? 'open_in_new' : 'download'}</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => router.push('/library')}
            className="w-full mt-4 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">menu_book</span>
            View All Materials
          </button>
        </div>

      </div>

      <BottomNav navItems={navItems} />
    </div>
  );
};

export default CoursesPage;
