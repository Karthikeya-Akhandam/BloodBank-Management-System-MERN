import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { LogOut, RefreshCw, Save, Bell, Droplets, ArrowUpRight, ArrowDownRight, ClipboardList, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';

const OrganizationDashboard = () => {
    const { logout, user } = useAuth();
    const [inventory, setInventory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [newQuantities, setNewQuantities] = useState<any>({});
    const [donations, setDonations] = useState<any[]>([]);
    const [donationsLoading, setDonationsLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [notifications, setNotifications] = useState<string[]>([]);

    useSocket((event, data) => {
        if (event === 'new-donation') {
            setNotifications(prev => [`New donation booking from ${data.donorName}!`, ...prev]);
            fetchDonations();
        } else if (event === 'new-request') {
            setNotifications(prev => [`New blood request from ${data.hospitalName}!`, ...prev]);
            fetchRequests();
        }
    });

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventory/me');
            if (data.success) {
                setInventory(data.data);
                const initialQuantities: any = {};
                bloodGroups.forEach(bg => {
                    initialQuantities[bg] = data.data[bg] || 0;
                });
                setNewQuantities(initialQuantities);
            }
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        setDonationsLoading(true);
        try {
            const { data } = await api.get('/donations/org');
            if (data.success) {
                setDonations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch donations', error);
        } finally {
            setDonationsLoading(false);
        }
    };

    const fetchRequests = async () => {
        setRequestsLoading(true);
        try {
            const { data } = await api.get('/requests/org');
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setRequestsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchDonations();
        fetchRequests();
    }, []);

    const handleUpdate = async (bloodGroup: string) => {
        setUpdating(bloodGroup);
        try {
            const { data } = await api.put('/inventory/update', {
                bloodGroup,
                quantity: Number(newQuantities[bloodGroup])
            });
            if (data.success) {
                setInventory(data.data);
            }
        } catch (error) {
            console.error('Failed to update inventory', error);
        } finally {
            setUpdating(null);
        }
    };

    const handleDonationStatus = async (id: string, status: string) => {
        try {
            const { data } = await api.put(`/donations/${id}/status`, { status });
            if (data.success) {
                fetchDonations();
                fetchInventory();
            }
        } catch (error) {
            console.error('Failed to update donation status', error);
        }
    };

    const handleRequestStatus = async (id: string, status: string) => {
        try {
            const { data } = await api.put(`/requests/${id}/status`, { status });
            if (data.success) {
                fetchRequests();
                fetchInventory();
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update request status');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Syncing Emergency Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="md:w-80 bg-gray-900 text-white p-8 flex flex-col sticky top-0 md:h-screen">
                <div className="flex items-center gap-2 mb-12">
                    <Droplets className="text-red-500 fill-red-500" size={28} />
                    <span className="text-2xl font-black tracking-tighter uppercase italic">Control<span className="text-red-500">Center</span></span>
                </div>

                <div className="space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 p-4 bg-red-600 rounded-2xl font-black uppercase tracking-tighter italic shadow-xl shadow-red-900/20">
                        <ClipboardList size={20} /> Overview
                    </button>
                    <div className="pt-8 mb-4 ml-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Quick Stats</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-[2rem] border border-white/5">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase">Donations</span>
                            <ArrowUpRight className="text-green-400" size={16} />
                        </div>
                        <div className="text-3xl font-black italic">{donations.filter(d => d.status === 'fulfilled').length}</div>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-[2rem] border border-white/5">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase">Requests</span>
                            <ArrowDownRight className="text-red-400" size={16} />
                        </div>
                        <div className="text-3xl font-black italic">{requests.length}</div>
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-black italic text-xs">BC</div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-tighter truncate w-32">{user?.name}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Authorized Org</div>
                        </div>
                    </div>
                    <button onClick={logout} className="p-3 bg-gray-800 hover:bg-red-600 transition-colors rounded-xl">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Inventory.</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Real-time blood bank management</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {notifications.length > 0 && (
                                <div className="relative group">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer relative">
                                        <Bell className="text-gray-400 group-hover:text-red-600 transition-colors" size={24} />
                                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                                    </div>
                                    <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-[2rem] border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
                                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-900">Notifications</span>
                                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{notifications.length}</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map((n, i) => (
                                                <div key={i} className="p-4 text-[11px] font-bold text-gray-600 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    {n}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setNotifications([])} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">Dismiss All</button>
                                    </div>
                                </div>
                            )}
                            <button onClick={fetchInventory} className="flex items-center gap-2 bg-white px-6 py-4 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-tighter text-xs hover:bg-gray-50 transition-all shadow-sm shadow-gray-100">
                                <RefreshCw size={16} /> Sync Data
                            </button>
                        </div>
                    </header>

                    {/* Inventory Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {bloodGroups.map((bg) => (
                            <div key={bg} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col group hover:border-red-100 transition-all duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-4xl font-black italic text-gray-900 tracking-tighter">{bg}</span>
                                    <Droplets className={`${inventory?.[bg] > 5 ? 'text-red-100' : 'text-red-600 animate-pulse'}`} size={24} />
                                </div>
                                <div className="mb-6">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Level</div>
                                    <div className="text-3xl font-black italic text-gray-900">{inventory?.[bg] || 0} <span className="text-xs not-italic font-bold text-gray-400 uppercase ml-1">Units</span></div>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-3 py-2 text-sm font-black focus:bg-white focus:border-red-600 outline-none transition-all"
                                        value={newQuantities[bg]}
                                        onChange={(e) => setNewQuantities({ ...newQuantities, [bg]: e.target.value })}
                                    />
                                    <button
                                        onClick={() => handleUpdate(bg)}
                                        disabled={updating === bg}
                                        className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-gray-200"
                                    >
                                        {updating === bg ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 gap-12">
                        {/* Donations Table */}
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Donations.</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Upcoming and past donor slots</p>
                                </div>
                                <Clock className="text-gray-200" size={32} />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Donor Identity</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Group</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scheduled</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verification</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {donations.map((d) => (
                                            <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="font-black text-gray-900 italic uppercase truncate w-48">{d.donor?.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{d.donor?.phone}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-black italic">{d.bloodGroup}</span>
                                                </td>
                                                <td className="px-10 py-8 text-xs font-bold text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span>{new Date(d.date).toLocaleDateString()}</span>
                                                        <span className="text-gray-900 font-black italic uppercase">{d.time}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        d.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                        d.status === 'accepted' ? 'bg-blue-50 text-blue-600' :
                                                        d.status === 'fulfilled' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            d.status === 'pending' ? 'bg-orange-600' :
                                                            d.status === 'accepted' ? 'bg-blue-600' :
                                                            d.status === 'fulfilled' ? 'bg-green-600' : 'bg-red-600'
                                                        }`}></span>
                                                        {d.status}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {d.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleDonationStatus(d._id, 'accepted')} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><CheckCircle2 size={18} /></button>
                                                            <button onClick={() => handleDonationStatus(d._id, 'rejected')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={18} /></button>
                                                        </div>
                                                    )}
                                                    {d.status === 'accepted' && (
                                                        <button onClick={() => handleDonationStatus(d._id, 'fulfilled')} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-gray-200 italic">Mark Fulfilled</button>
                                                    )}
                                                    {d.status === 'fulfilled' && <CheckCircle2 className="text-green-500" size={24} />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Requests Table */}
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-900 text-white">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Requests.</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Hospital emergency requirements</p>
                                </div>
                                <Activity className="text-red-600" size={32} />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target Facility</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority/Group</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Volume</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verification</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {requests.map((r) => (
                                            <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="font-black text-gray-900 italic uppercase truncate w-48">{r.hospital?.hospitalName}</div>
                                                    {r.status === 'accepted' ? (
                                                        <div className="text-[10px] font-bold text-red-600 uppercase mt-1">{r.hospital?.phone}</div>
                                                    ) : (
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Contact Hidden</div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-black italic">{r.bloodGroup}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-xl font-black italic text-gray-900">{r.quantity} <span className="text-[10px] not-italic font-bold text-gray-400 uppercase ml-1">Units</span></div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        r.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                        r.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            r.status === 'pending' ? 'bg-orange-600' :
                                                            r.status === 'accepted' ? 'bg-green-600' : 'bg-red-600'
                                                        }`}></span>
                                                        {r.status}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {r.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleRequestStatus(r._id, 'accepted')} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-gray-200 italic">Approve & Dispatch</button>
                                                            <button onClick={() => handleRequestStatus(r._id, 'rejected')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={18} /></button>
                                                        </div>
                                                    )}
                                                    {r.status !== 'pending' && <CheckCircle2 className="text-green-500" size={24} />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrganizationDashboard;
