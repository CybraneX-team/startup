"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { STUDENT_NAMES } from '@/utils/nameByEnroll';

const UserDeepDive = () => {
  const params = useParams() as any;
  const id = params?.id; 
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedSim, setExpandedSim] = useState<string | null>(null);

  useEffect(() => { if (id) fetchUserData(); }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user-detail/${id}`, {
        headers: { 'x-admin-token': localStorage.getItem('admin_session') || "" }
      });
      const result = await response.json();
      if (response.ok) setData(result);
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  const handleUpdate = async (type: 'user' | 'sim', payload: any, simId?: string) => {
    const url = type === 'user' ? `/admin/update-user/${id}` : `/admin/update-simulation/${simId}`;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('admin_session') || "" },
        body: JSON.stringify(payload)
      });
      if (response.ok) fetchUserData();
    } catch (err) { alert("Override Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#0b0d11] flex items-center justify-center text-blue-500 font-bold animate-pulse uppercase tracking-widest">Accessing Node...</div>;
  if (!data) return <div className="min-h-screen bg-[#0b0d11] flex items-center justify-center text-red-500 font-bold">Node Not Found</div>;

  const { user, games, role } = data;
  const isSuper = role === 'super';

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-[#1e293b]/40 p-6 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/admin')} className="bg-white/5 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all border border-white/10 uppercase font-bold text-xs tracking-tighter">← Back</button>
            <div>
              <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-1 italic">Admin Dashboard</p>
              <h1 className="text-3xl font-bold text-white uppercase italic">{(STUDENT_NAMES as any)[user.enrollmentNo] || user.username}</h1>
            </div>
          </div>
          {isSuper && (
            <button onClick={() => setIsEditMode(!isEditMode)} className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${isEditMode ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {isEditMode ? 'Finish Overrides' : 'Enable Full Overrides'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: STUDENT METRICS (Editable only for Super) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 shadow-xl">
               <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic text-center">Metric Parameters</h3>
               <div className="space-y-4">
                  <EditableField label="User Acquisition" value={user.metrics.userAcquisition} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('user', { metrics: {...user.metrics, userAcquisition: Number(v)} })} />
                  <EditableField label="Conversion Rate (%)" value={(user.metrics.conversionFirstPurchase * 100).toFixed(2)} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('user', { metrics: {...user.metrics, conversionFirstPurchase: Number(v)/100} })} />
                  <EditableField label="Buyer Count" value={user.metrics.buyerCount} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('user', { metrics: {...user.metrics, buyerCount: Number(v)} })} />
                  <EditableField label="Avg Order Value" value={user.metrics.averageOrderValue?.toFixed(2)} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('user', { metrics: {...user.metrics, averageOrderValue: Number(v)} })} />
                  <MetricStatic label="CLTV ($)" value={`$${user.metrics.customerLifetimeValue?.toFixed(2)}`} color="text-emerald-400" />
               </div>
            </section>
          </div>

          {/* COLUMN 2: FINANCIAL P&L (Editable only for Super) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-2 italic text-center">Profit & Loss Manual Overrides</h3>
              <div className="space-y-4">
                <FinanceRow label="Gross Revenue" value={user.revenue} edit={isEditMode && isSuper} color="text-emerald-400" onSave={(v: any) => handleUpdate('user', { revenue: Number(v) })} />
                <FinanceRow label="Cost of Sales" value={user.costOfSales} edit={isEditMode && isSuper} prefix="-" color="text-red-400" onSave={(v: any) => handleUpdate('user', { costOfSales: Number(v) })} />
                <FinanceRow label="Salaries" value={user.salaries} edit={isEditMode && isSuper} prefix="-" color="text-red-400" onSave={(v: any) => handleUpdate('user', { salaries: Number(v) })} />
                <FinanceRow label="Rent" value={user.rent} edit={isEditMode && isSuper} prefix="-" color="text-red-400" onSave={(v: any) => handleUpdate('user', { rent: Number(v) })} />
                <FinanceRow label="Marketing (CPA)" value={user.marketing} edit={isEditMode && isSuper} prefix="-" color="text-red-400" onSave={(v: any) => handleUpdate('user', { marketing: Number(v) })} />
                
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 tracking-widest italic">Contribution Margin Override</p>
                   {isEditMode && isSuper ? (
                        <div className="flex gap-2 justify-center">
                            <input type="number" defaultValue={user.metrics.contributionMargin} id="over-cm" className="bg-black/30 border border-blue-500/50 p-2 rounded-lg text-white font-mono w-32 text-center text-xl outline-none" />
                            <button onClick={() => handleUpdate('user', { metrics: { ...user.metrics, contributionMargin: Number((document.getElementById('over-cm') as any).value) } })} className="bg-blue-600 px-4 rounded-xl text-[10px] font-black uppercase text-white">Sync</button>
                        </div>
                   ) : (
                        <p className={`text-5xl font-mono font-bold italic ${user.metrics.contributionMargin < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            ${user.metrics.contributionMargin?.toLocaleString()}
                        </p>
                   )}
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-3xl shadow-xl border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-2 italic">Faculty Wallet Balance</p>
              <div className="flex gap-4 items-center">
                <h2 className="text-4xl font-mono font-bold text-white tracking-tighter flex-1">{user.credits?.toLocaleString()}</h2>
                {isEditMode && isSuper && (
                    <div className="flex gap-2">
                        <input type="number" id="v-coins" defaultValue={user.credits} className="bg-black/30 p-2 rounded-lg border border-white/10 w-24 text-white text-xs outline-none" />
                        <button onClick={() => handleUpdate('user', { credits: Number((document.getElementById('v-coins') as any).value) })} className="bg-emerald-500 px-3 rounded-lg text-[9px] font-black uppercase text-white">Sync</button>
                    </div>
                )}
              </div>
            </section>
          </div>

          {/* COLUMN 3: SIMULATION LOGS (Now with Restored Expandable Details) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-2 italic text-center">Simulation Archive</h3>
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {games.map((game: any) => (
                  <div key={game._id} className="bg-black/40 border border-white/5 p-6 rounded-2xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div onClick={() => setExpandedSim(expandedSim === game._id ? null : game._id)} className="cursor-pointer group flex-1">
                        <h4 className="font-bold text-white mb-1 uppercase tracking-tight group-hover:text-blue-400 flex items-center gap-2">
                           {game.businessName || "Instance"} <span>{expandedSim === game._id ? '▲' : '▼'}</span>
                        </h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{game.industry}</p>
                      </div>
                      
                      {isEditMode && isSuper ? (
                        <select value={game.currentStage} onChange={(e) => handleUpdate('sim', { currentStage: e.target.value }, game._id)} className="bg-blue-600 text-white text-[9px] font-black p-1 rounded-lg border-none outline-none ring-2 ring-blue-400/20 cursor-pointer">
                          {["FFF", "Angels", "pre_seed", "Seed", "a", "b", "c", "d"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-[9px] font-bold border border-blue-500/20 italic">{game.currentStage}</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-2">
                       <MiniStat label="Wallet" value={`$${game.finances?.toLocaleString()}`} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('sim', { finances: Number(v) }, game._id)} color="text-emerald-400" />
                       <MiniStat label="Turns" value={game.turnNumber} edit={isEditMode && isSuper} onSave={(v: any) => handleUpdate('sim', { turnNumber: Number(v) }, game._id)} />
                    </div>

                    {expandedSim === game._id && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-1">
                         <div className="grid grid-cols-2 gap-2 text-[9px] uppercase font-bold text-slate-500">
                           <span>Model: <span className="text-white font-mono">{game.businessModel || 'N/A'}</span></span>
                           <span>Velocity: <span className="text-blue-400 font-mono">{game.revenueVelocity?.toFixed(2)}</span></span>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Difficulty Override</p>
                            {isEditMode && isSuper ? (
                                <select value={game.difficultyMode} onChange={(e) => handleUpdate('sim', { difficultyMode: e.target.value }, game._id)} className="bg-black/60 text-blue-400 w-full p-2 text-xs rounded-xl border border-white/10 outline-none">
                                    <option value="basic">Basic Mode</option>
                                    <option value="intermediate">Intermediate Mode</option>
                                </select>
                            ) : (
                                <p className="text-white font-mono text-xs uppercase bg-white/5 p-2 rounded-lg">{game.difficultyMode || 'Basic'}</p>
                            )}
                         </div>
                         <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest tracking-tighter">Goal</p>
                            <p className="text-[10px] text-slate-400 italic leading-relaxed">{game.goal || 'No goal set'}</p>
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- REFACTORED SUB-COMPONENTS ---

const EditableField = ({ label, value, edit, onSave, color = "text-white" }: any) => {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
      <div>
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{label}</p>
        {edit ? <input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="bg-transparent border-b-2 border-blue-500 text-xl font-mono font-bold text-white w-28 outline-none" /> : <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>}
      </div>
      {edit && <button onClick={() => onSave(val)} className="bg-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-white shadow-lg">Sync</button>}
    </div>
  );
};

const FinanceRow = ({ label, value, edit, prefix = "", color = "text-white", onSave }: any) => {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">{label}</span>
      {edit ? <div className="flex gap-2"><input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="bg-black/40 border border-blue-500/30 rounded-lg p-1 text-xs font-mono w-24 text-right text-white" /><button onClick={() => onSave(val)} className="text-[9px] font-bold text-blue-400 uppercase">Sync</button></div> : <span className={`font-mono font-black ${color}`}>{prefix}${Math.abs(value)?.toLocaleString()}</span>}
    </div>
  );
};

const MiniStat = ({ label, value, edit, onSave, color = "text-white" }: any) => {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  return (
    <div className="bg-black/20 p-2 rounded-xl border border-white/5 flex flex-col items-center">
       <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">{label}</p>
       {edit ? <div className="flex flex-col items-center gap-1"><input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="bg-transparent border-b border-blue-500 w-16 text-center text-xs font-mono font-bold text-white outline-none" /><button onClick={() => onSave(val)} className="text-[7px] text-blue-400 uppercase font-black tracking-tighter">Sync</button></div> : <p className={`text-xs font-mono font-bold ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>}
    </div>
  );
};

const MetricStatic = ({ label, value, color = "text-white" }: any) => (
  <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-60">
    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
  </div>
);

export default UserDeepDive;