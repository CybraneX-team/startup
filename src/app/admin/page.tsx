"use client"
import { STUDENT_NAMES } from '@/utils/nameByEnroll';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const FacultyDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'super' | 'normal' | null>(null);
  const [accountFilter, setAccountFilter] = useState<'university' | 'normal'>('university');
  const [passInput, setPassInput] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New state for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_session');
    const savedRole = localStorage.getItem('admin_role');
    if (token && savedRole) {
      setRole(savedRole as any);
      setIsAuthenticated(true);
      fetchUsers(token);
    }
  }, [accountFilter]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users-list?type=${accountFilter}`, { 
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      if (Array.isArray(data)) setUsers(data);
      else setIsAuthenticated(false);
    } catch (err) { console.error(err); }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (STUDENT_NAMES as any)[user.enrollmentNo] || user.username || "";
      const email = user.email || "";
      const enroll = user.enrollmentNo || "";
      const query = searchQuery.toLowerCase();

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        enroll.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passInput })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_session', data.token);
        localStorage.setItem('admin_role', data.role);
        setRole(data.role);
        setIsAuthenticated(true);
        fetchUsers(data.token);
      } else { alert("Unauthorized Access"); }
    } catch (err) { alert("Login failed"); }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-[#0b0d11] items-center justify-center p-4">
        <div className="bg-[#151921] p-10 rounded-3xl border border-white/5 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-2 text-center  uppercase tracking-tighter">Admin Dashboard</h2>
          
          <div className="relative mt-8 group">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full p-4 bg-black/40 text-white rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all pr-12"
              placeholder="Enter Admin Key"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
            />
            {/* Eye Icon Button */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? (
                // Eye Off Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                // Eye Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold mt-6 uppercase tracking-widest transition-all hover:bg-blue-500 shadow-lg shadow-blue-900/20">
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d11] text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-6">
          <div className="flex-1 w-full">
            <h1 className="text-3xl font-bold tracking-tight uppercase">Admin Dashboard</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {role === 'super' && (
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 h-11">
                  <button onClick={() => setAccountFilter('university')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${accountFilter === 'university' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>UNIVERSITY</button>
                  <button onClick={() => setAccountFilter('normal')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${accountFilter === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>STANDARD</button>
                </div>
              )}

              <div className="relative flex-1 min-w-[300px]">
                <input 
                  type="text"
                  placeholder="Search by name, email or enrollment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                        CLEAR
                    </button>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-white/5 px-6 py-2 rounded-xl text-xs font-bold border border-white/10 uppercase hover:bg-red-500/10 hover:border-red-500/50 transition-all">Sign Out</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} onClick={() => router.push(`/admin/users/${user._id}`)} className="bg-[#151921] p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/50 cursor-pointer transition-all shadow-xl group">
                <div className="flex justify-between items-start mb-6">
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors truncate">{(STUDENT_NAMES as any)[user.enrollmentNo] || user.username}</h3>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <span className="bg-black/40 px-3 py-1 rounded-lg border border-white/5 text-[9px] font-bold text-slate-400 shrink-0 ml-2">{user.enrollmentNo || 'USER'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Revenue</p>
                     <p className="text-lg font-bold text-emerald-400">${user.revenue?.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Credits</p>
                     <p className="text-lg font-bold text-blue-400 font-mono">{user.credits?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-[#151921] rounded-[2rem] border border-dashed border-white/10">
              <p className="text-slate-500">No users found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;