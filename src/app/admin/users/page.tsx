'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Users, Mail, Shield, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data?.data || response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto relative">
      <AdminHeader 
        title="User Directory" 
        description="Manage teachers, students, and system administrators." 
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-cs-dark">Registered Users</h2>
        <button className="cs-btn-purple px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer">
          <span className="text-lg leading-none mb-0.5">+</span> Invite User
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xs" style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cs-gray">
            <thead className="bg-purple-50/70 border-b border-purple-100 text-xs uppercase tracking-wider text-cs-gray font-bold">
              <tr>
                <th className="px-6 py-4 font-extrabold">User</th>
                <th className="px-6 py-4 font-extrabold">Role</th>
                <th className="px-6 py-4 font-extrabold">Status</th>
                <th className="px-6 py-4 font-extrabold">Last Active</th>
                <th className="px-6 py-4 text-right font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 bg-white/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-cs-gray font-semibold">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6B5CE7]" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-cs-gray font-semibold">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const displayName = user.email.split('@')[0];
                  return (
                  <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                          <span className="text-[#6B5CE7] font-black uppercase">{displayName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-bold text-cs-dark">{displayName}</div>
                          <div className="text-xs text-cs-gray font-semibold flex items-center gap-1 mt-0.5">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Shield size={14} className={
                          user.role === 'ADMIN' ? 'text-[#6B5CE7]' : 
                          user.role === 'TEACHER' ? 'text-emerald-600' : 'text-blue-600'
                        } />
                        <span className={`text-xs font-black tracking-wide ${
                          user.role === 'ADMIN' ? 'text-[#6B5CE7]' : 
                          user.role === 'TEACHER' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-cs-dark">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-cs-gray">Recently</td>
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
                )
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
