'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Loader2 } from 'lucide-react';

import api from '@/services/api';

interface CreateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBookModal({ isOpen, onClose, onSuccess }: CreateBookModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bookClass, setBookClass] = useState('');
  const [bookSubject, setBookSubject] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!bookClass.trim() || !bookSubject.trim()) {
      setError('Please provide Class and Subject.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // 1. Create a Book entity in the DB
      // Capitalize the first letter of the subject for better formatting
      const formattedSubject = bookSubject.trim().charAt(0).toUpperCase() + bookSubject.trim().slice(1);
      const bookTitle = `${formattedSubject} - Class ${bookClass.trim()}`;
      const bookRes = await api.post('/curriculum/books', {
        title: bookTitle,
        class: bookClass,
        subject: bookSubject
      });
      
      const bookId = bookRes.data?.data?.id || bookRes.data?.id;
      
      if (!bookId) {
        throw new Error('Failed to create book record.');
      }

      // 2. Upload PDF for AI RAG Processing
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookId', bookId);

      await api.post('/rag/ingest-book', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to process textbook.';
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(err.response.data.message) 
          ? err.response.data.message[0] 
          : typeof err.response.data.message === 'object'
            ? JSON.stringify(err.response.data.message)
            : err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-purple-200 bg-white text-cs-dark"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cs-gray hover:text-cs-dark transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-black text-cs-dark mb-1">Upload New Textbook</h2>
              <p className="text-sm text-cs-gray font-semibold">
                Upload a PDF. Our AI will automatically chunk it into chapters and blocks.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
                <strong>Upload Failed:</strong> {error}
              </div>
            )}

            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <FileText className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-cs-dark mb-2">Upload Successful!</h3>
                <p className="text-sm text-cs-gray font-semibold">The textbook has been processed and indexed.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-cs-gray mb-1 uppercase">Class / Grade</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 6, Grade 10" 
                      value={bookClass}
                      onChange={(e) => setBookClass(e.target.value)}
                      className="cs-input w-full rounded-lg px-4 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-cs-gray mb-1 uppercase">Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. English, Science" 
                      value={bookSubject}
                      onChange={(e) => setBookSubject(e.target.value)}
                      className="cs-input w-full rounded-lg px-4 py-2"
                    />
                  </div>
                </div>

                <div 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
                    ${file ? 'border-[#6B5CE7] bg-purple-50' : 'border-purple-200 hover:border-[#6B5CE7] hover:bg-purple-50/50'}
                  `}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <Upload className="text-[#6B5CE7]" size={24} />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm font-bold text-cs-dark mb-1">{file.name}</p>
                        <p className="text-xs text-cs-gray font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-cs-dark mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-cs-gray font-semibold">PDF up to 50MB</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-cs-gray hover:text-cs-dark hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="cs-btn-purple px-6 py-2.5 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing AI...
                      </>
                    ) : (
                      'Start Ingestion'
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
