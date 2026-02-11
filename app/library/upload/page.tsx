'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const UploadPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseCode: '',
    department: '',
    level: '100L',
    yearSemester: '2023/2024 - 1st',
    file: null as File | null
  });

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
    if (!formData.file || !formData.courseCode || !formData.courseTitle) {
      alert('Please fill in all required fields and upload a file.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload.');

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

      // 2. Handle Course (Find or Create)
      let courseId;
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('course_code', formData.courseCode.toUpperCase())
        .single();

      if (existingCourse) {
        courseId = existingCourse.id;
      } else {
        const { data: newCourse, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: formData.courseTitle,
            course_code: formData.courseCode.toUpperCase(),
            instructor_name: 'TBA' // Default
          })
          .select('id')
          .single();

        if (courseError) throw courseError;
        courseId = newCourse.id;
      }

      // 3. Insert Resource Record
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title: `${formData.courseCode} - ${formData.yearSemester}`,
          type: fileExt?.toUpperCase() || 'DOC',
          category: 'past-questions',
          course_id: courseId,
          uploader_id: user.id,
          file_url: publicUrl,
          file_size: (formData.file.size / 1024 / 1024).toFixed(2) + ' MB'
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/library');
      }, 2000);

    } catch (error: any) {
      console.error('Upload failed details:', error);
      let errorMsg = error.message || 'An unknown error occurred';

      if (errorMsg === 'Failed to fetch') {
        errorMsg = 'Network error: Could not reach Supabase. Please check your internet connection or ad-blocker.';
      }

      alert(`Upload failed: ${errorMsg}`);
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
            {/* Course Information Group */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Course Information</h3>
              </div>
              <div className="space-y-4">
                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Course Title</p>
                  <input
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    className="form-input flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-white/30 p-4 text-base font-normal"
                    placeholder="e.g. Introduction to Psychology"
                    type="text"
                    required
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Course Code</p>
                  <input
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="form-input flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-white/30 p-4 text-base font-normal"
                    placeholder="e.g. PSY 101"
                    type="text"
                    required
                  />
                </label>
              </div>
            </section>

            {/* Academic Details Group */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">school</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Academic Details</h3>
              </div>
              <div className="space-y-4">
                <label className="flex flex-col w-full">
                  <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Department</p>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select flex w-full rounded-xl text-black dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1c2720] focus:border-primary h-14 p-4 text-base font-normal appearance-none"
                    required
                  >
                    <option disabled value="">Select Department</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Science">Science</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Level</p>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="form-select flex w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-14 p-4 text-base font-normal"
                    >
                      <option>100L</option>
                      <option>200L</option>
                      <option>300L</option>
                      <option>400L</option>
                      <option>500L</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-white/80 text-sm font-medium pb-2 ml-1">Year/Semester</p>
                    <select
                      name="yearSemester"
                      value={formData.yearSemester}
                      onChange={handleInputChange}
                      className="form-select flex w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-14 p-4 text-base font-normal"
                    >
                      <option>2023/2024 - 1st</option>
                      <option>2023/2024 - 2nd</option>
                      <option>2022/2023 - 1st</option>
                      <option>2022/2023 - 2nd</option>
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
      </div>
    </div>
  );
};

export default UploadPage;
