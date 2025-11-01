import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseCode: '',
    courseTitle: '',
    resourceType: '',
    academicLevel: '',
    description: '',
    file: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You can add API call here to submit the form data
    alert('Resource submitted for review!');
    navigate('/home'); // Redirect to home after submission
  };

  const handleUploadClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div 
      className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ 
        fontFamily: 'Manrope, "Noto Sans", sans-serif',
        '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(97,111,137)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
      } as React.CSSProperties}
    >
      {/* Header */}
      <Header title="Share Study Material" showBackButton={true} />

      {/* Main Content */}
      <div className="flex-1 pb-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Code Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111318] text-base font-medium leading-normal pb-2">Course Code</p>
              <input
                name="courseCode"
                placeholder="e.g., CSC 401"
                value={formData.courseCode}
                onChange={handleInputChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 h-14 placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal transition-colors duration-200"
              />
            </label>
          </div>

          {/* Course Title Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111318] text-base font-medium leading-normal pb-2">Course Title</p>
              <input
                name="courseTitle"
                placeholder="e.g., Final Year Project"
                value={formData.courseTitle}
                onChange={handleInputChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 h-14 placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal transition-colors duration-200"
              />
            </label>
          </div>

          {/* Resource Type Select */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111318] text-base font-medium leading-normal pb-2">Resource Type</p>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleInputChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 h-14 bg-[image:var(--select-button-svg)] bg-no-repeat bg-[center_right_15px] bg-[length:24px_24px] placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal appearance-none transition-colors duration-200"
              >
                <option value="">Select Resource Type</option>
                <option value="past-questions">Past Questions</option>
                <option value="lecture-notes">Lecture Notes</option>
                <option value="summaries">Summaries</option>
                <option value="assignments">Assignments</option>
                <option value="projects">Projects</option>
              </select>
            </label>
          </div>

          {/* Academic Level Select */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111318] text-base font-medium leading-normal pb-2">Academic Level</p>
              <select
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleInputChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 h-14 bg-[image:var(--select-button-svg)] bg-no-repeat bg-[center_right_15px] bg-[length:24px_24px] placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal appearance-none transition-colors duration-200"
              >
                <option value="">Select Academic Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </label>
          </div>

          {/* Description Textarea */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111318] text-base font-medium leading-normal pb-2">Description</p>
              <textarea
                name="description"
                placeholder="Add description (optional)..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-[#dbdfe6] bg-white focus:border-blue-500 min-h-36 placeholder:text-[#616f89] p-[15px] text-base font-normal leading-normal transition-colors duration-200"
              />
            </label>
          </div>

          {/* File Upload Section */}
          <div className="flex flex-col p-4">
            <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#dbdfe6] px-6 py-14 hover:border-blue-400 transition-colors duration-200">
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  {formData.file ? 'File Selected' : 'Tap to browse files'}
                </p>
                <p className="text-[#111318] text-sm font-normal leading-normal max-w-[480px] text-center">
                  {formData.file ? formData.file.name : 'PDF, DOC, JPG, PNG supported'}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111318] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors duration-200"
              >
                <span className="truncate">
                  {formData.file ? 'Change File' : 'Upload'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex px-4 py-3">
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#276cec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!formData.courseCode || !formData.courseTitle || !formData.resourceType || !formData.academicLevel || !formData.file}
            >
              <span className="truncate">Submit for Review</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Upload;