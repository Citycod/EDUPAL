'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

const UploadPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);

  // Structured Data
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    institutionId: '',
    departmentId: '',
    courseTitle: '',
    courseCode: '',
    sessionId: '',
    level: '100',
    file: null as File | null
  });

  // Fetch Institutions & Sessions via Bridge
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: inst } = await supabase.from('hub_institutions').select('*').order('name');
      const { data: sess } = await supabase.from('hub_sessions').select('*').order('name', { ascending: false });
      if (inst) setInstitutions(inst);
      if (sess) setSessions(sess);
    };
    fetchInitialData();
  }, []);

  // Fetch Departments via Bridge
  useEffect(() => {
    if (!formData.institutionId) return;
    const fetchDepts = async () => {
      const { data } = await supabase.from('hub_departments').select('*').eq('institution_id', formData.institutionId).order('name');
      setDepartments(data || []);
      setFormData(prev => ({ ...prev, departmentId: '' }));
    };
    fetchDepts();
  }, [formData.institutionId]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.courseTitle || !formData.courseCode || !formData.sessionId) {
      alert('Please fill in all required fields and upload a file.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload.');

      // Check if course exists, if not create it
      let courseId: string | null = null;
      
      const { data: existingCourse, error: courseCheckError } = await supabase
        .from('hub_courses')
        .select('id')
        .eq('course_code', formData.courseCode)
        .eq('department_id', formData.departmentId)
        .maybeSingle();

      if (courseCheckError) {
        console.error('Error checking course:', courseCheckError);
      }

      if (existingCourse) {
        courseId = existingCourse.id;
      } else {
        // Create new course
        const { data: newCourse, error: courseCreateError } = await supabase
          .from('academic.courses')
          .insert({
            title: formData.courseTitle,
            course_code: formData.courseCode,
            department_id: formData.departmentId
          })
          .select('id')
          .single();

        if (courseCreateError) {
          console.error('Error creating course:', courseCreateError);
          alert('Failed to create course. Please try again.');
          return;
        }

        courseId = newCourse.id;
      }

      // 1. Upload File
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // 2. Get session details for title
      const selectedSession = sessions.find(s => s.id === formData.sessionId);

      // 3. Insert Resource Record using new scalable structure via Bridge
      const { error: insertError } = await supabase
        .from('hub_resources')
        .insert({
          title: `${formData.courseCode} - ${selectedSession?.name}`,
          type: fileExt?.toUpperCase() || 'DOC',
          category: 'past-questions',
          course_id: courseId,
          session_id: formData.sessionId,
          uploader_id: user.id,
          file_url: publicUrl,
          level: formData.level,
          file_size: (formData.file.size / 1024 / 1024).toFixed(2) + ' MB'
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/library');
      }, 2000);

    } catch (error: any) {
      console.error('Upload failed details:', error);
      alert(`Upload failed: ${error.message || 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden max-w-md mx-auto border-x border-slate-200 dark:border-border-dark/30">

        {/* Top App Bar */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-border-dark/20 backdrop-blur-md">
          <div
            onClick={() => router.back()}
            className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-surface-dark transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 ml-4">Upload Past Question</h2>
          <div className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Progress Indicator (Subtle) */}
          <div className="flex items-center gap-2 px-1">
            <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
            <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
            <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Academic Hierarchy Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Academic Archive Context</h3>
              </div>
              <div className="space-y-4">
                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Institution</p>
                  <select
                    name="institutionId"
                    value={formData.institutionId}
                    onChange={handleInputChange}
                    required
                    className="form-select flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 p-4 text-base"
                  >
                    <option value="">Select Institution</option>
                    {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                  </select>
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Department</p>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    disabled={!formData.institutionId}
                    required
                    className="form-select flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 p-4 text-base disabled:opacity-50"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                  </select>
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Course Title *</p>
                  <input
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Computer Science"
                    disabled={!formData.departmentId}
                    required
                    className="form-input flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 px-4 text-base disabled:opacity-50"
                  />
                </label>

                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Course Code *</p>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101"
                    disabled={!formData.departmentId}
                    required
                    className="form-input flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 px-4 text-base disabled:opacity-50"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Level</p>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="form-select flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 p-4 text-base"
                    >
                      <option>100</option>
                      <option>200</option>
                      <option>300</option>
                      <option>400</option>
                      <option>500</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Session</p>
                    <select
                      name="sessionId"
                      value={formData.sessionId}
                      onChange={handleInputChange}
                      required
                      className="form-select flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 p-4 text-base"
                    >
                      <option value="">Select Session</option>
                      {sessions.map(sess => <option key={sess.id} value={sess.id}>{sess.name}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            </section>

            {/* File Upload Area */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Upload Document</h3>
              </div>
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className={`flex flex-col items-center justify-center border-2 border-dashed ${formData.file ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark/50'} rounded-xl p-8 group-hover:bg-primary/5 group-hover:border-primary transition-all text-center`}>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {formData.file ? 'check' : 'cloud_upload'}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {formData.file ? formData.file.name : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-slate-500 dark:text-white/40 text-xs mt-2 uppercase tracking-widest">PDF, PNG, or JPG (Max 10MB)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-xs text-primary/90 font-medium">High-quality scans or clear photos earn 2x more contribution points!</p>
              </div>
            </section>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Submit Question'}
              {!loading && <span className="material-symbols-outlined">send</span>}
            </button>
          </form>
        </div>

        {/* Success Modal Overlay */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-surface-dark border border-border-dark w-full max-w-xs rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Upload Successful!</h4>
              <p className="text-white/60 text-sm mb-6">Thank you for contributing to the EduPal community. Your file is being processed.</p>
              <button
                onClick={() => router.push('/library')}
                className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl"
              >
                Awesome
              </button>
            </div>
          </div>
        )}

        <div className="h-8 bg-background-light dark:bg-background-dark"></div>
        <BottomNav />
      </div>
    </div>
  );
};

export default UploadPage;
