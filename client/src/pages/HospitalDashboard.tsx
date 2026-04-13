import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { LogOut, RefreshCw, Search, Phone, MapPin, X, CheckCircle2, AlertCircle, Bell, Activity, Droplets, ArrowRight, ClipboardList } from 'lucide-react';

const HospitalDashboard = () => {
    const { logout, user } = useAuth();
    const [inventories, setInventories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<any>(null);
    const [requestData, setRequestData] = useState({
        bloodGroup: 'A+',
        quantity: 1
    });
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);

    useSocket((event, data) => {
        if (event === 'request-status-update') {
            setNotifications(prev => [`Your blood request for ${data.request.bloodGroup} is now ${data.request.status}!`, ...prev]);
            fetchMyRequests();
        }
    });

    const fetchInventories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventory');
            if (data.success) {
                setInventories(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch inventories', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const { data } = await api.get('/requests/my');
            if (data.success) {
                setMyRequests(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch my requests', error);
        }
    };

    useEffect(() => {
        fetchInventories();
        fetchMyRequests();
    }, []);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setRequestStatus('loading');
        setErrorMessage('');
        try {
            const { data } = await api.post('/requests/create', {
                ...requestData,
                organization: selectedOrg.organization._id
            });
            if (data.success) {
                setRequestStatus('success');
                fetchMyRequests();
                setTimeout(() => {
                    setSelectedOrg(null);
                    setRequestStatus('idle');
                }, 2000);
            }
        } catch (error: any) {
            setRequestStatus('error');
            setErrorMessage(error.response?.data?.message || 'Request failed');
        }
    };

    const filteredInventories = inventories.filter(inv => 
        inv.organization.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.organization.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Mapping Local Inventories...</p>
        </div>
    );

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* Header */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <Activity className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">Hospital<span className="text-blue-600">Portal</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {notifications.length > 0 && (
                            <div className="relative group">
                                <Bell className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" size={24} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                                <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-[2rem] border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
                                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">Updates</span>
                                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{notifications.length}</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((n, i) => (
                                            <div key={i} className="p-4 text-[11px] font-bold text-gray-600 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setNotifications([])} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors">Clear all notifications</button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <div className="text-xs font-black uppercase tracking-tighter text-gray-900">{user?.name}</div>
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Facility Authorized</div>
                            </div>
                            <button onClick={logout} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 transition-colors rounded-xl border border-gray-100">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left: Inventory Explorer */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Live Inventory.</h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Across 12 verified blood banks in your region</p>
                            </div>
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by facility name or district..."
                                    className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent shadow-sm shadow-gray-100 rounded-3xl focus:border-blue-600 outline-none transition-all font-bold text-sm text-gray-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {filteredInventories.map((inv) => (
                                <div key={inv._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                                    <div className="p-8 lg:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-3 group-hover:text-blue-600 transition-colors">{inv.organization.organizationName}</h3>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                    <MapPin size={14} className="text-blue-600" /> {inv.organization.address}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                    <Phone size={14} className="text-blue-600" /> {inv.organization.phone}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedOrg(inv);
                                                setRequestData({ ...requestData, bloodGroup: 'A+' });
                                            }}
                                            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
                                        >
                                            Initiate Request <ArrowRight size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-px bg-gray-50">
                                        {bloodGroups.map(bg => (
                                            <div key={bg} className="bg-white p-6 text-center group/item hover:bg-blue-50 transition-colors">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover/item:text-blue-400 transition-colors">{bg}</div>
                                                <div className={`text-2xl font-black italic ${inv[bg] > 0 ? 'text-gray-900' : 'text-red-300 opacity-50'}`}>
                                                    {inv[bg] || 0}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Request Management */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-32">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                                <Activity className="text-blue-600" size={24} /> Requests.
                            </h3>
                            <div className="space-y-6">
                                {myRequests.map((r) => (
                                    <div key={r._id} className="relative pl-6 border-l-2 border-gray-100 py-1 hover:border-blue-600 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-black text-gray-900 text-[11px] uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{r.organization.organizationName}</span>
                                            <span className={`text-[9px] uppercase px-3 py-1 rounded-full font-black tracking-[0.1em] ${
                                                r.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                r.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {r.status}
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">{new Date(r.createdAt).toLocaleDateString()}</div>
                                        <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between">
                                            <span className="text-xl font-black italic text-gray-900">{r.bloodGroup}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{r.quantity} Units</span>
                                        </div>
                                        {r.status === 'accepted' && (
                                            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2">
                                                <div className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-2 italic underline decoration-2 underline-offset-4">Dispatch Authorized</div>
                                                <div className="text-[10px] font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2"><Phone size={12}/> {r.organization.phone}</div>
                                                <div className="text-[10px] font-bold text-gray-500 lowercase mt-1">{r.organization.email}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {myRequests.length === 0 && (
                                    <div className="text-center py-12 px-6">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                                            <ClipboardList className="text-gray-300" size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active requests found in the system.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Request Modal */}
            {selectedOrg && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 max-w-2xl w-full relative shadow-2xl overflow-hidden">
                        {/* Modal Background Visual */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                        
                        <button
                            onClick={() => setSelectedOrg(null)}
                            className="absolute right-10 top-10 p-3 bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors rounded-2xl border border-gray-100"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
                                <Activity size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resource Requisition</span>
                            </div>
                            <h3 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Request <span className="text-blue-600">Form.</span></h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Targeting: {selectedOrg.organization.organizationName}</p>
                        </div>

                        {requestStatus === 'success' ? (
                            <div className="text-center py-16 animate-in zoom-in-95">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                                    <CheckCircle2 className="text-green-500" size={48} />
                                </div>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Request Transmitted!</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Real-time sync established with {selectedOrg.organization.organizationName}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRequest} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Required Blood Group</label>
                                        <select
                                            className="w-full bg-gray-50 p-5 rounded-[2rem] border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-black text-xl italic text-gray-900 appearance-none cursor-pointer"
                                            value={requestData.bloodGroup}
                                            onChange={(e) => setRequestData({ ...requestData, bloodGroup: e.target.value })}
                                            required
                                        >
                                            {bloodGroups.map(bg => (
                                                <option key={bg} value={bg}>{bg} (Available: {selectedOrg[bg] || 0})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Volume (Units Required)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 p-5 rounded-[2rem] border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-black text-3xl italic text-gray-900"
                                            value={requestData.quantity}
                                            onChange={(e) => setRequestData({ ...requestData, quantity: Number(e.target.value) })}
                                            min={1}
                                            max={selectedOrg[requestData.bloodGroup]}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                                    <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                                    <p className="text-[11px] font-bold text-blue-900/70 leading-relaxed uppercase tracking-tight italic">By initiating this request, you authorize the facility to view your contact information upon approval for dispatch logistics.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={requestStatus === 'loading'}
                                    className="w-full bg-gray-900 text-white font-black py-6 rounded-[2.5rem] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 uppercase tracking-tighter text-xl italic disabled:opacity-50"
                                >
                                    {requestStatus === 'loading' ? 'Transmitting...' : 'Confirm Emergency Request'}
                                    {!requestStatus === 'loading' && <ArrowRight size={24} />}
                                </button>
                                {requestStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest justify-center italic">
                                        <XCircle size={16} />
                                        <span>Transmission Failure: {errorMessage}</span>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDashboard;
