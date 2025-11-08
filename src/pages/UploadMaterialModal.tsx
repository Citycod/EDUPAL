import  { useState } from 'react';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadData) => void;
}

interface UploadData {
  title: string;
  department: string;
  courseCode: string;
  description: string;
  file: File | null;
}

const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<UploadData>({
    title: '',
    department: '',
    courseCode: '',
    description: '',
    file: null
  });

  const [fileUploaded, setFileUploaded] = useState(false);

  // Custom select arrow SVG as data URL
  const selectButtonSvg = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(73,138,156)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e";

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
    setFileUploaded(!!file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      title: '',
      department: '',
      courseCode: '',
      description: '',
      file: null
    });
    setFileUploaded(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      department: '',
      courseCode: '',
      description: '',
      file: null
    });
    setFileUploaded(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex flex-col justify-end items-stretch bg-[#141414]/40 z-50"
      onClick={handleBackdropClick}
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-col items-stretch bg-[#f8fbfc] rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Drag Handle */}
        <button 
          className="flex h-5 w-full items-center justify-center pt-2 pb-1"
          onClick={handleCancel}
        >
          <div className="h-1 w-9 rounded-full bg-[#cee3e8]"></div>
        </button>

        {/* Modal Content */}
        <div className="flex-1">
          <h1 className="text-[#0d191c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
            Upload Material
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Title Input */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
                  required
                />
              </label>
            </div>

            {/* Department Select */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 bg-[image:--select-button-svg] bg-no-repeat bg-[center_right_1rem] bg-[length:24px_24px] placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors appearance-none"
                  required
                  style={{ '--select-button-svg': `url('${selectButtonSvg}')` } as React.CSSProperties}
                >
                  <option value="">Department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="engineering">Engineering</option>
                </select>
              </label>
            </div>

            {/* Course Code Input */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="text"
                  name="courseCode"
                  placeholder="Course Code"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
                  required
                />
              </label>
            </div>

            {/* Description Textarea */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none min-h-36 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
                  rows={4}
                  required
                />
              </label>
            </div>

            {/* File Upload */}
            <div className="flex px-4 py-3">
              <label className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#e7f1f4] text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#dde9ec] transition-colors">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
                <span className="truncate">
                  {fileUploaded ? 'File Selected' : 'Upload File'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7f1f4] text-[#0d191c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#dde9ec] transition-colors flex-1"
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.department || !formData.courseCode || !formData.description || !formData.file}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#0ba9d5] text-[#f8fbfc] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0a95c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  <span className="truncate">Submit</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Spacer */}
        <div className="h-5 bg-[#f8fbfc]"></div>
      </div>
    </div>
  );
};

export default UploadMaterialModal;