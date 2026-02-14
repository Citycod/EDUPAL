'use client';

import { useState, useRef } from 'react';

interface UploadMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UploadData) => void;
}

export interface UploadData {
    title: string;
    courseTitle: string;
    courseCode: string;
    description: string;
    type: string;
    file: File | null;
}

const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<UploadData>({
        title: '',
        courseTitle: '',
        courseCode: '',
        description: '',
        type: 'PDF',
        file: null
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));
        if (errors.file) {
            setErrors(prev => ({ ...prev, file: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.courseTitle.trim()) {
            newErrors.courseTitle = 'Course title is required';
        }
        if (!formData.courseCode.trim()) {
            newErrors.courseCode = 'Course code is required';
        }
        if (!formData.file) {
            newErrors.file = 'Please select a file to upload';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            // Reset form
            setFormData({
                title: '',
                courseTitle: '',
                courseCode: '',
                description: '',
                type: 'PDF',
                file: null
            });
            setErrors({});
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            courseTitle: '',
            courseCode: '',
            description: '',
            type: 'PDF',
            file: null
        });
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Study Material</h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Resource Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Resource Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Lecture Notes - Week 5"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.title
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-slate-300 dark:border-slate-600 focus:border-primary'
                                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Course Title *
                        </label>
                        <input
                            type="text"
                            name="courseTitle"
                            value={formData.courseTitle}
                            onChange={handleInputChange}
                            placeholder="e.g., Introduction to Computer Science"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.courseTitle
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-slate-300 dark:border-slate-600 focus:border-primary'
                                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        />
                        {errors.courseTitle && <p className="text-red-500 text-xs mt-1">{errors.courseTitle}</p>}
                    </div>

                    {/* Course Code */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Course Code *
                        </label>
                        <input
                            type="text"
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleInputChange}
                            placeholder="e.g., CS101"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.courseCode
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-slate-300 dark:border-slate-600 focus:border-primary'
                                } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        />
                        {errors.courseCode && <p className="text-red-500 text-xs mt-1">{errors.courseCode}</p>}
                    </div>

                    {/* Material Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Material Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="PDF">PDF</option>
                            <option value="Notes">Notes</option>
                            <option value="Slides">Slides</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Past Paper">Past Paper</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Add a brief description..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Upload File *
                        </label>
                        <div className="relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed ${errors.file
                                        ? 'border-red-500'
                                        : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                                    } bg-slate-50 dark:bg-slate-700/50 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-primary">
                                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1-11.32,11.32L136,155.31V192a8,8,0,0,1-16,0V155.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0Z" />
                                </svg>
                                <span className="text-slate-600 dark:text-slate-300 font-medium">
                                    {formData.file ? formData.file.name : 'Choose a file'}
                                </span>
                            </label>
                        </div>
                        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold transition-colors shadow-lg hover:shadow-xl"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMaterialModal;
