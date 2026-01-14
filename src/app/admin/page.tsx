"use client"
import { STUDENT_NAMES } from '@/utils/nameByEnroll';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useColorMode from '@/hooks/useColorMode'; // Adjust path as needed

// Theme Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591-1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

// User-friendly Tooltip
const Tooltip = ({ children, text, theme }: { children: React.ReactNode; text: string; theme: string }) => (
  <div className="group relative flex items-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center">
      <div className={`relative z-10 w-48 p-2 text-[10px] leading-tight rounded-lg shadow-xl border text-center font-bold ${theme === 'dark' ? 'bg-slate-800 text-white border-white/10' : 'bg-white text-slate-800 border-slate-200'}`}>
        {text}
      </div>
      <div className={`w-2 h-2 -mt-1 rotate-45 border-r border-b ${theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'}`}></div>
    </div>
  </div>
);

const EyeIcon = ({ show }: { show: boolean }) => (
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
);

const FacultyDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'super' | 'normal' | 'university' | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<'dashboard' | 'manage-universities' | 'create-user'>('dashboard');
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Using your specific hook with "color-theme" key
  const [colorMode, setColorMode] = useColorMode();

  // Eye Icon Toggles
  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassCreate, setShowPassCreate] = useState(false);

  const [loginType, setLoginType] = useState<'standard' | 'university'>('standard');
  const [usernameInput, setUsernameInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const [newUniUser, setNewUniUser] = useState({ username: "", password: "", universityName: "" });
  const [createdCreds, setCreatedCreds] = useState<any>(null);

  const [studentForm, setStudentForm] = useState({
    name: "", username: "", email: "", password: "", enrollmentNo: "", isUniversityAc: true, universityName: ""
  });

  const [bulkForm, setBulkForm] = useState({ count: 10, universityName: "", isUniversityAc: true });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_session');
    const savedRole = localStorage.getItem('admin_role');
    if (token && savedRole) {
      setRole(savedRole as any);
      setIsAuthenticated(true);
      fetchUsers(token, activeFilter);
      fetchUniTags(token);
    }
  }, [activeFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'university') {
        const savedUni = localStorage.getItem('admin_uni_name');
        if (savedUni) {
            setStudentForm(prev => ({ ...prev, universityName: savedUni, isUniversityAc: true }));
            setBulkForm(prev => ({ ...prev, universityName: savedUni, isUniversityAc: true }));
        }
      } else if (role === 'super' && availableTags.length > 0 && !studentForm.universityName) {
        setStudentForm(prev => ({ ...prev, universityName: availableTags[0] }));
        setBulkForm(prev => ({ ...prev, universityName: availableTags[0] }));
      }
    }
  }, [availableTags, role, isAuthenticated]);

  const handleToggleTheme = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  const fetchUniTags = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/universities-tags`, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAvailableTags(data);
    } catch (err) { console.error(err); }
  };

  const handleExportCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const loadId = toast.loading("Preparing CSV export...");
    try {
      const token = localStorage.getItem('admin_session');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export-users-csv?filter=${activeFilter}`, { headers: { 'x-admin-token': token || "" } });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Student_Data_${activeFilter.toUpperCase()}.csv`;
      document.body.appendChild(link);
      link.click();
      toast.update(loadId, { render: "Export Successful", type: "success", isLoading: false, autoClose: 3000 });
      setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); setIsExporting(false); }, 500);
    } catch (err) { 
      toast.update(loadId, { render: "Export failed", type: "error", isLoading: false, autoClose: 3000 });
      setIsExporting(false); 
    }
  };

  const fetchUsers = async (token: string, filter: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users-list?filter=${filter}`, { headers: { 'x-admin-token': token } });
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
      return name.toLowerCase().includes(query) || email.toLowerCase().includes(query) || enroll.toLowerCase().includes(query);
    });
  }, [users, searchQuery]);

  const handleLogin = async () => {
    const loadId = toast.loading("Authenticating...");
    try {
      const body = loginType === 'standard' ? { password: passInput, type: 'standard' } : { username: usernameInput, password: passInput, type: 'university' };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_session', data.token);
        localStorage.setItem('admin_role', data.role);
        if (data.universityName) localStorage.setItem('admin_uni_name', data.universityName);
        setRole(data.role); setIsAuthenticated(true); fetchUsers(data.token, 'all');
        toast.update(loadId, { render: "Welcome back, Admin", type: "success", isLoading: false, autoClose: 3000 });
      } else { 
        toast.update(loadId, { render: data.message || "Invalid Credentials", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) { 
        toast.update(loadId, { render: "Login failed", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleCreateStudent = async () => {
    let payload = { ...studentForm };
    if (role === 'university') {
      const savedUni = localStorage.getItem('admin_uni_name');
      if (savedUni) { payload.universityName = savedUni; payload.isUniversityAc = true; }
    }
    if (payload.isUniversityAc && !payload.universityName) { toast.warning("Please select a university."); return; }
    
    const loadId = toast.loading("Provisioning account...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-user`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('admin_session') || "" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (response.ok) { 
        toast.update(loadId, { render: "Account Created Successfully", type: "success", isLoading: false, autoClose: 3000 });
        setStudentForm({ ...studentForm, username: "", email: "", password: "", enrollmentNo: "" }); 
        setActiveView('dashboard'); 
        fetchUsers(localStorage.getItem('admin_session')!, activeFilter); 
      } else { 
        toast.update(loadId, { render: data.message || "Creation failed", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) { 
        toast.update(loadId, { render: "Server Communication Error", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleBulkCreate = async () => {
    if (bulkForm.count > 100) return toast.error("Maximum 100 users per batch allowed.");
    setIsExporting(true);
    const loadId = toast.loading(`Generating ${bulkForm.count} user credentials...`);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-create-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('admin_session') || "" },
            body: JSON.stringify(bulkForm)
        });
        const result = await response.json();
        if (response.ok) {
            const headers = "Username,Password,Email,University\n";
            const rows = result.data.map((u: any) => `"${u.username}","${u.password}","${u.email}","${u.university}"`).join("\n");
            const csvContent = "\uFEFF" + headers + rows;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Batch_Creds_${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.update(loadId, { render: "Batch created & CSV downloaded!", type: "success", isLoading: false, autoClose: 5000 });
            setActiveView('dashboard');
            fetchUsers(localStorage.getItem('admin_session')!, activeFilter);
        } else { 
            toast.update(loadId, { render: result.message || "Bulk creation failed", type: "error", isLoading: false, autoClose: 3000 });
        }
    } catch (err) { 
        toast.update(loadId, { render: "Server Error", type: "error", isLoading: false, autoClose: 3000 });
    }
    finally { setIsExporting(false); }
  };

  const handleCreateUniversity = async () => {
    if (!newUniUser.username || !newUniUser.password || !newUniUser.universityName) { toast.warning("All fields are mandatory."); return; }
    const loadId = toast.loading("Registering University Admin...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-university-admin`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('admin_session') || "" }, body: JSON.stringify(newUniUser) });
      if (response.ok) { 
        toast.update(loadId, { render: "University Admin Registered", type: "success", isLoading: false, autoClose: 3000 });
        setCreatedCreds({ ...newUniUser }); 
        setNewUniUser({ username: "", password: "", universityName: "" }); 
        fetchUniTags(localStorage.getItem('admin_session')!); 
      } else { 
        toast.update(loadId, { render: "Registration failed", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) { 
        toast.update(loadId, { render: "Connection error", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const copyToClipboard = (text: string) => { 
    navigator.clipboard.writeText(text); 
    toast.info("Copied to clipboard");
  };

  // Theme-aware styles
  const colors = {
    bg: colorMode === 'dark' ? 'bg-[#0b0d11]' : 'bg-slate-50',
    card: colorMode === 'dark' ? 'bg-[#151921]' : 'bg-white',
    cardLight: colorMode === 'dark' ? 'bg-black/20' : 'bg-slate-100/50',
    text: colorMode === 'dark' ? 'text-slate-100' : 'text-slate-800',
    textMuted: colorMode === 'dark' ? 'text-slate-500' : 'text-slate-400',
    border: colorMode === 'dark' ? 'border-white/5' : 'border-slate-200',
    inputBg: colorMode === 'dark' ? 'bg-black/40' : 'bg-slate-100',
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex h-screen items-center justify-center p-4 transition-colors duration-300 ${colors.bg}`}>
        <ToastContainer theme={colorMode === 'dark' ? 'dark' : 'light'} position="top-center" />
        <div className={`${colors.card} p-6 sm:p-10 rounded-3xl border ${colors.border} w-full max-w-md shadow-2xl`}>
          <h2 className={`${colors.text} text-xl sm:text-2xl font-bold mb-6 text-center uppercase tracking-tighter`}>Admin Login</h2>
          <div className={`flex ${colorMode === 'dark' ? 'bg-black/40' : 'bg-slate-100'} p-1 rounded-xl border ${colors.border} mb-8`}>
            <button onClick={() => setLoginType('standard')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginType === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>STANDARD</button>
            <button onClick={() => setLoginType('university')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loginType === 'university' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>UNIVERSITY</button>
          </div>
          <div className="space-y-4">
            {loginType === 'university' && (
              <input type="text" className={`w-full p-4 ${colors.inputBg} ${colors.text} rounded-2xl border ${colors.border} focus:border-blue-500 outline-none transition-all text-sm`} placeholder="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
            )}
            <div className="relative group">
              <input type={showPassLogin ? "text" : "password"} className={`w-full p-4 ${colors.inputBg} ${colors.text} rounded-2xl border ${colors.border} focus:border-blue-500 outline-none transition-all pr-12 text-sm`} placeholder="Password" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
              <button type="button" onClick={() => setShowPassLogin(!showPassLogin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 p-1">
                <EyeIcon show={showPassLogin} />
              </button>
            </div>
          </div>
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold mt-8 uppercase tracking-widest hover:bg-blue-500 transition-all text-sm">Log In</button>
          <div className="mt-6 flex justify-center">
             <button onClick={handleToggleTheme} className={`p-3 rounded-full border ${colors.border} hover:scale-110 transition-transform`}>{colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${colors.bg} ${colors.text} p-4 sm:p-8`}>
      <ToastContainer theme={colorMode === 'dark' ? 'dark' : 'light'} />
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 border-b ${colors.border} pb-8 gap-6`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase italic">Admin Panel</h1>
            <p className={`${colors.textMuted} text-[10px] font-bold mt-1 uppercase tracking-widest leading-none`}>
              {activeView === 'dashboard' ? 'Summary' : activeView === 'manage-universities' ? 'Manage Admins' : 'Create User'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleToggleTheme} className={`p-2.5 rounded-xl border ${colors.border} ${colorMode === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-all`}>
              {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setActiveView('create-user')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black border transition-all uppercase ${activeView === 'create-user' ? 'bg-emerald-600 border-emerald-400 text-white' : `bg-white/5 ${colors.border} ${colors.textMuted} hover:text-blue-500`}`}>+ Create User</button>
            {role === 'super' && (
              <button onClick={() => { setActiveView(activeView === 'manage-universities' ? 'dashboard' : 'manage-universities'); setCreatedCreds(null); }} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black border transition-all uppercase ${activeView === 'manage-universities' ? 'bg-blue-600 border-blue-400 text-white' : `bg-white/5 ${colors.border} ${colors.textMuted} hover:text-blue-500`}`}>
                {activeView === 'dashboard' ? 'University Admins' : 'Back to Users'}
              </button>
            )}
            {activeView !== 'dashboard' && <button onClick={() => setActiveView('dashboard')} className={`bg-white/5 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black border ${colors.border} uppercase hover:text-blue-500`}>Dashboard</button>}
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className={`bg-white/5 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black border ${colors.border} uppercase hover:bg-red-500/10 hover:text-red-400 transition-all`}>Sign Out</button>
          </div>
        </div>

        {activeView === 'create-user' ? (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
             <div className={`${colors.card} p-6 sm:p-10 rounded-[2.5rem] border ${colors.border} shadow-2xl`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg sm:text-xl font-bold uppercase italic text-emerald-400">{isBulkMode ? 'Bulk Creation' : 'Create New Account'}</h2>
                  {role === 'super' && (
                    <button onClick={() => setIsBulkMode(!isBulkMode)} className="text-[10px] font-black text-blue-400 uppercase border border-blue-400/30 px-4 py-1.5 rounded-xl hover:bg-blue-400/10 transition-all">
                       Switch to {isBulkMode ? 'Single' : 'Bulk'}
                    </button>
                  )}
                </div>

                {!isBulkMode ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      <div className="space-y-1">
                        <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Username</label>
                        <input placeholder="jdoe_123" value={studentForm.username} onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-3.5 text-sm ${colors.text} outline-none focus:border-emerald-500 transition-all`} />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Password</label>
                        <div className="relative">
                          <input placeholder="••••••••" type={showPassCreate ? "text" : "password"} value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-3.5 text-sm ${colors.text} outline-none focus:border-emerald-500 transition-all pr-12`} />
                          <button type="button" onClick={() => setShowPassCreate(!showPassCreate)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 p-1">
                            <EyeIcon show={showPassCreate} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Email</label>
                      <input placeholder="user@example.com" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-3.5 text-sm ${colors.text} outline-none focus:border-emerald-500 transition-all`} />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Enrollment No</label>
                      <input placeholder="124BTEC..." value={studentForm.enrollmentNo} onChange={(e) => setStudentForm({ ...studentForm, enrollmentNo: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-3.5 text-sm ${colors.text} outline-none focus:border-emerald-500 transition-all`} />
                    </div>
                    <div className={`pt-6 border-t ${colors.border} space-y-5`}>
                      {role === 'super' && (
                        <div className={`flex items-center justify-between ${colors.cardLight} p-4 rounded-2xl border ${colors.border}`}>
                          <span className={`text-[10px] font-bold uppercase ${colors.textMuted} italic`}>University Account?</span>
                          <button onClick={() => setStudentForm({ ...studentForm, isUniversityAc: !studentForm.isUniversityAc })} className={`px-6 py-1.5 rounded-lg text-[9px] font-black transition-all ${studentForm.isUniversityAc ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'}`}>{studentForm.isUniversityAc ? 'YES' : 'NO'}</button>
                        </div>
                      )}
                      {(studentForm.isUniversityAc || role === 'university') && (
                        <div className="space-y-1">
                          <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Select University</label>
                          <select value={studentForm.universityName} disabled={role === 'university'} onChange={(e) => setStudentForm({ ...studentForm, universityName: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-4 text-sm ${colors.text} outline-none font-bold ${role === 'university' ? 'opacity-60' : 'cursor-pointer uppercase'}`}>
                            {role === 'university' ? <option value={studentForm.universityName}>{studentForm.universityName.toUpperCase()}</option> : availableTags.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                    <button onClick={handleCreateStudent} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg mt-6">Confirm and Create</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6"><p className="text-[10px] text-blue-500 font-medium italic">Generates unique IDs and random passwords. Download CSV provided automatically.</p></div>
                    <div className="space-y-1">
                      <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Number of Users (Max 100)</label>
                      <input type="number" value={bulkForm.count} onChange={(e) => setBulkForm({...bulkForm, count: Number(e.target.value)})} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-3.5 text-sm ${colors.text} outline-none`} />
                    </div>
                    <div className={`flex items-center justify-between ${colors.cardLight} p-4 rounded-2xl border ${colors.border}`}>
                        <span className={`text-[10px] font-bold uppercase ${colors.textMuted} italic`}>University Affiliate?</span>
                        <button onClick={() => setBulkForm({ ...bulkForm, isUniversityAc: !bulkForm.isUniversityAc })} className={`px-6 py-1.5 rounded-lg text-[9px] font-black transition-all ${bulkForm.isUniversityAc ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'}`}>{bulkForm.isUniversityAc ? 'YES' : 'NO'}</button>
                    </div>
                    {bulkForm.isUniversityAc && (
                      <div className="space-y-1">
                        <label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Select University</label>
                        <select value={bulkForm.universityName} onChange={(e) => setBulkForm({ ...bulkForm, universityName: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-4 text-sm ${colors.text} font-bold uppercase cursor-pointer`}>
                          {availableTags.map(tag => <option key={tag} value={tag}>{tag.toUpperCase()}</option>)}
                        </select>
                      </div>
                    )}
                    <button disabled={isExporting} onClick={handleBulkCreate} className={`w-full py-4.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg mt-6 transition-all ${isExporting ? 'bg-slate-400 text-slate-700' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                        {isExporting ? 'Creating Batch...' : 'Batch Provision and Download'}
                    </button>
                  </div>
                )}
             </div>
          </div>
        ) : activeView === 'manage-universities' ? (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
             {createdCreds ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 sm:p-10 rounded-[2.5rem] mb-8 text-center">
                <h2 className="text-emerald-400 font-bold text-lg sm:text-xl uppercase italic mb-2">Login Created!</h2>
                <div className={`${colors.cardLight} rounded-3xl p-5 sm:p-7 text-left space-y-5 border ${colors.border} mt-6`}>
                  <div><p className={`text-[10px] ${colors.textMuted} uppercase font-black italic ml-1`}>Username</p><div className={`flex justify-between items-center gap-3 ${colors.inputBg} p-3 rounded-xl border ${colors.border}`}><code className="text-blue-500 text-xs truncate flex-1">{createdCreds.username}</code><button onClick={() => copyToClipboard(createdCreds.username)} className={`text-[9px] ${colorMode === 'dark' ? 'bg-white/10' : 'bg-slate-200'} px-3 py-1.5 rounded-lg font-black uppercase`}>COPY</button></div></div>
                  <div><p className={`text-[10px] ${colors.textMuted} uppercase font-black italic ml-1`}>Password</p><div className={`flex justify-between items-center gap-3 ${colors.inputBg} p-3 rounded-xl border ${colors.border}`}><code className="text-blue-500 text-xs truncate flex-1">{createdCreds.password}</code><button onClick={() => copyToClipboard(createdCreds.password)} className={`text-[9px] ${colorMode === 'dark' ? 'bg-white/10' : 'bg-slate-200'} px-3 py-1.5 rounded-lg font-black uppercase`}>COPY</button></div></div>
                </div>
                <button onClick={() => setCreatedCreds(null)} className="mt-10 text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest">Create Another Admin</button>
              </div>
            ) : (
              <div className={`${colors.card} p-6 sm:p-10 rounded-[2.5rem] border ${colors.border} shadow-2xl`}>
                <h2 className="text-lg sm:text-xl font-bold mb-2 uppercase italic text-blue-600">Register University Admin</h2>
                <div className="space-y-6 mt-8">
                  <div className="space-y-1"><label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Username</label><input placeholder="admin@sakec.edu" value={newUniUser.username} onChange={(e) => setNewUniUser({ ...newUniUser, username: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-4 text-sm ${colors.text} outline-none focus:border-blue-500 transition-all`} /></div>
                  <div className="space-y-1"><label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>Password</label><input placeholder="••••••••" type="password" value={newUniUser.password} onChange={(e) => setNewUniUser({ ...newUniUser, password: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-4 text-sm ${colors.text} outline-none focus:border-blue-500 transition-all`} /></div>
                  <div className="space-y-1"><label className={`text-[9px] font-bold ${colors.textMuted} uppercase ml-2 italic`}>University Tag</label><input placeholder="e.g. sakec" value={newUniUser.universityName} onChange={(e) => setNewUniUser({ ...newUniUser, universityName: e.target.value })} className={`w-full ${colors.inputBg} border ${colors.border} rounded-2xl px-5 py-4 text-sm ${colors.text} outline-none focus:border-blue-500 transition-all`} /></div>
                  <button onClick={handleCreateUniversity} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest mt-6">Setup Account</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10 space-y-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full ${colors.card} border ${colors.border} rounded-2xl px-6 py-4 text-sm ${colors.text} focus:border-blue-500 outline-none transition-all italic`} />
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 text-[10px] font-black uppercase">CLEAR</button>}
                </div>
                <button onClick={handleExportCSV} disabled={isExporting} className={`px-8 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all shadow-lg ${isExporting ? 'bg-slate-300 text-slate-600' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                  {isExporting ? <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                  <span className="text-[10px] font-black uppercase tracking-widest">Export CSV</span>
                </button>
                {role === 'super' && (
                  <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`px-8 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all shadow-lg ${isFilterOpen ? 'bg-blue-600 border-blue-400 text-white shadow-blue-900/20' : `bg-white/5 ${colors.border} ${colors.textMuted} hover:text-blue-500`}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                  </button>
                )}
              </div>

              {isFilterOpen && role === 'super' && (
                <div className={`p-5 sm:p-7 ${colors.card} border ${colors.border} rounded-[2rem] animate-in slide-in-from-top-2 duration-300 shadow-xl`}>
                  <div className="space-y-8">
                    <div>
                      <p className={`text-[10px] ${colors.textMuted} font-black uppercase mb-4 ml-1 tracking-widest italic`}>System Categories</p>
                      <div className="flex flex-wrap gap-3">
                        {['all', 'general'].map((f) => (
                          <Tooltip key={f} text={f === 'all' ? "Total users" : "No uni affiliation"} theme={colorMode}>
                            <button onClick={() => setActiveFilter(f)} className={`px-5 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all border tracking-widest ${activeFilter === f ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : `${colors.cardLight} ${colors.textMuted} ${colors.border} hover:border-blue-500`}`}>
                              {f === 'all' ? '🌎 All Users' : '👤 Standard'}
                            </button>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                    {availableTags.length > 0 && (
                      <div className={`pt-6 border-t ${colors.border}`}>
                        <p className={`text-[10px] ${colors.textMuted} font-black uppercase mb-4 ml-1 tracking-widest italic`}>University Filters</p>
                        <div className="flex flex-wrap gap-3">
                          {availableTags.map((tag) => (
                            <button key={tag} onClick={() => setActiveFilter(tag)} className={`px-5 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all border tracking-widest ${activeFilter === tag ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : `${colors.cardLight} ${colors.textMuted} ${colors.border} hover:border-blue-500`}`}>
                              🏛️ {tag.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className={`text-[10px] ${colors.textMuted} font-black uppercase mb-6 ml-1 italic tracking-widest`}>Showing {filteredUsers.length} Profiles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <div key={user._id} onClick={() => router.push(`/admin/users/${user._id}`)} className={`${colors.card} p-6 sm:p-9 rounded-[2.5rem] border ${colors.border} hover:border-blue-500/50 cursor-pointer transition-all shadow-xl group hover:shadow-2xl`}>
                  <div className="flex justify-between items-start mb-8">
                    <div className="overflow-hidden">
                      <h3 className="text-lg sm:text-xl font-black group-hover:text-blue-500 transition-colors truncate italic tracking-tighter">{(STUDENT_NAMES as any)[user.enrollmentNo] || user.username}</h3>
                      <p className={`text-[10px] sm:text-xs ${colors.textMuted} truncate font-medium`}>{user.email}</p>
                    </div>
                    <span className={`${colors.cardLight} px-3.5 py-1.5 rounded-xl border ${colors.border} text-[9px] font-black ${colors.textMuted} shrink-0 ml-3 tracking-widest`}>{user.enrollmentNo || 'GUEST'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${colors.cardLight} p-4 sm:p-5 rounded-3xl border ${colors.border} transition-all`}>
                        <p className={`text-[9px] ${colors.textMuted} uppercase font-black mb-1 italic tracking-widest leading-none`}>Revenue</p>
                        <p className="text-base sm:text-xl font-black text-emerald-500 italic">${user.revenue?.toLocaleString()}</p>
                    </div>
                    <div className={`${colors.cardLight} p-4 sm:p-5 rounded-3xl border ${colors.border} transition-all`}>
                        <p className={`text-[9px] ${colors.textMuted} uppercase font-black mb-1 italic tracking-widest leading-none`}>Credits</p>
                        <p className="text-base sm:text-xl font-black text-blue-500 font-mono italic tracking-tighter">{user.credits?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className={`col-span-full text-center py-24 ${colors.card} rounded-[3rem] border border-dashed ${colors.border} animate-pulse`}>
                  <p className={`${colors.textMuted} font-black uppercase tracking-widest text-xs italic`}>No profiles found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;