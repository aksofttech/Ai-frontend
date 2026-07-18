'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import CreateBookModal from '@/components/admin/CreateBookModal';
import { BookOpen, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function CurriculumManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/curriculum/books');
      const raw = response.data?.data || response.data;
      const data = Array.isArray(raw) ? raw : [];
      // Sort by class number (1, 2, 3...) then by title alphabetically
      const sorted = [...data].sort((a: any, b: any) => {
        const clsA = parseInt(String(a?.class ?? a?.grade ?? a?.className ?? ''), 10);
        const clsB = parseInt(String(b?.class ?? b?.grade ?? b?.className ?? ''), 10);
        if (!isNaN(clsA) && !isNaN(clsB) && clsA !== clsB) return clsA - clsB;
        return String(a?.title ?? a?.name ?? '').localeCompare(String(b?.title ?? b?.name ?? ''));
      });
      setBooks(sorted);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto relative">
      <AdminHeader 
        title="Curriculum Manager" 
        description="View and manage the ingested textbooks and their extracted knowledge." 
      />

      <CreateBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchBooks} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-cs-dark">Ingested Textbooks</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="cs-btn-purple px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span className="text-lg leading-none mb-0.5">+</span> Create Book
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xs" style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cs-gray">
            <thead className="bg-purple-50/70 border-b border-purple-100 text-xs uppercase tracking-wider text-cs-gray font-bold">
              <tr>
                <th className="px-6 py-4 font-extrabold">Textbook Title</th>
                <th className="px-6 py-4 font-extrabold">Class/Grade</th>
                <th className="px-6 py-4 font-extrabold">Chapters</th>
                <th className="px-6 py-4 font-extrabold">Status</th>
                <th className="px-6 py-4 font-extrabold">Last Updated</th>
                <th className="px-6 py-4 text-right font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 bg-white/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-cs-gray font-semibold">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6B5CE7]" />
                    Loading textbooks...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-cs-gray font-semibold">
                    No books found. Click "Create Book" to get started.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <BookOpen size={16} className="text-[#6B5CE7]" />
                        </div>
                        <span className="font-bold text-cs-dark">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-cs-dark">{book.class || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-cs-dark">{book.chapters?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Ingested
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-cs-gray">{new Date(book.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-2 text-cs-gray hover:text-[#6B5CE7] transition-colors rounded-lg hover:bg-purple-50 cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-cs-gray hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
