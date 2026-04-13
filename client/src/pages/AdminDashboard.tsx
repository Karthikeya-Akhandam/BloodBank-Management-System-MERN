import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Database, Activity, ShieldCheck, MapPin, Phone, Mail, LayoutDashboard, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [inventories, setInventories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'inventory'>('users');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, invRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/inventory')
            ]);
            if (usersRes.data.success) setUsers(usersRes.data.data);
            if (invRes.data.success) setInventories(invRes.data.data);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter(u => 
        (u.name || u.organizationName || u.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const counts = {
        donors: users.filter(u => u.role === 'donor').length,
        organizations: users.filter(u => u.role === 'organization').length,
        hospitals: users.filter(u => u.role === 'hospital').length
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
            <div className="w-20 h-2 border-2 border-red-900 bg-red-950 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
            <p className="mt-6 text-red-900 font-black uppercase tracking-[0.3em] text-[10px]">Secure Boot / Admin Layer</p>
            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <div className="min-h-screen bg-[#050505] text-gray-400 flex flex-col md:flex-row font-sans selection:bg-red-600 selection:text-white">
            {/* Sidebar */}
            <aside className="md:w-80 bg-[#0a0a0a] border-r border-white/5 p-8 flex flex-col sticky top-0 md:h-screen">
                <div className="flex items-center gap-3 mb-16">
                    <div className="bg-red-600 p-2.5 rounded-xl shadow-2xl shadow-red-900/20">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Net<span className="text-red-600">Admin</span></span>
                </div>

                <nav className="space-y-2 flex-1">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2">Main Console</p>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-tighter italic transition-all ${activeTab === 'users' ? 'bg-white/5 text-white border border-white/10 shadow-2xl' : 'hover:bg-white/5'}`}
                    >
                        <Users size={20} className={activeTab === 'users' ? 'text-red-600' : ''} /> Directory
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-tighter italic transition-all ${activeTab === 'inventory' ? 'bg-white/5 text-white border border-white/10 shadow-2xl' : 'hover:bg-white/5'}`}
                    >
                        <Database size={20} className={activeTab === 'inventory' ? 'text-red-600' : ''} /> Global Grid
                    </button>
                </nav>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <div className="bg-gradient-to-br from-red-950/20 to-transparent p-6 rounded-[2rem] border border-red-900/20 mb-8">
                        <div className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 italic">System Health</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Nodes Operational</span>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-red-600 hover:text-white rounded-2xl transition-all group">
                        <span className="font-black uppercase tracking-tighter italic">Terminate Session</span>
                        <LogOut size={18} className="opacity-50 group-hover:opacity-100" />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 md:p-16 overflow-y-auto">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic mb-4 leading-none">Console.</h2>
                            <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px]">Real-time Network Orchestration Layer</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] min-w-[160px]">
                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Total Nodes</div>
                                <div className="text-4xl font-black italic text-white tracking-tighter">{users.length}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { label: 'Verified Donors', val: counts.donors, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                        { label: 'Supply Nodes', val: counts.organizations, color: 'text-red-500', bg: 'bg-red-500/5' },
                        { label: 'Medical Facilities', val: counts.hospitals, color: 'text-purple-500', bg: 'bg-purple-500/5' },
                    ].map((s, i) => (
                        <div key={i} className={`${s.bg} border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-colors`}>
                            <div className={`text-[10px] font-black ${s.color} uppercase tracking-[0.2em] mb-4 italic`}>{s.label}</div>
                            <div className="text-5xl font-black text-white italic tracking-tighter">{s.val}</div>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                {activeTab === 'users' ? <Users className="text-red-600" size={24} /> : <Database className="text-red-600" size={24} />}
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{activeTab === 'users' ? 'Registry Explorer' : 'Global Supply Matrix'}</h3>
                        </div>
                        
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Query network..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-red-600 transition-all font-bold text-sm text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Entity / Metadata</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Permission</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Geolocation</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Registration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="font-black text-white italic uppercase tracking-tight group-hover:text-red-600 transition-colors">{u.name || u.organizationName || u.hospitalName}</div>
                                                <div className="text-[10px] font-bold text-gray-600 uppercase mt-1 flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Mail size={10} /> {u.email}</span>
                                                    <span className="flex items-center gap-1"><Phone size={10} /> {u.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                                                    u.role === 'admin' ? 'bg-white text-black border-white' :
                                                    u.role === 'donor' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    u.role === 'organization' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 max-w-xs truncate uppercase tracking-tighter">
                                                    <MapPin size={12} className="text-red-600" /> {u.address}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-[10px] font-black text-gray-600 uppercase italic">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-10 grid grid-cols-1 gap-8">
                            {inventories.map((inv) => (
                                <div key={inv._id} className="bg-white/5 rounded-[2.5rem] border border-white/10 p-10 hover:border-red-600/30 transition-all group">
                                    <div className="flex justify-between items-center mb-10">
                                        <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-red-600 transition-colors">{inv.organization.organizationName}</h4>
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={12} /> {inv.organization.address}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                        {bloodGroups.map(bg => (
                                            <div key={bg} className="bg-black/40 border border-white/5 p-6 rounded-3xl text-center group/item hover:bg-red-600/5 hover:border-red-600/20 transition-all">
                                                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 group-hover/item:text-red-600 transition-colors">{bg}</div>
                                                <div className={`text-2xl font-black italic ${inv[bg] > 0 ? 'text-white' : 'text-gray-800'}`}>
                                                    {inv[bg] || 0}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
