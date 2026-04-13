import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw, Search, Phone, MapPin, X, CheckCircle2, AlertCircle } from 'lucide-react';

const HospitalDashboard = () => {
    const { logout } = useAuth();
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

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Inventories...</div>;

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-bold">Hospital Dashboard</h1>
                <button onClick={logout} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 p-2 rounded transition">
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Blood Bank Inventories</h2>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name or location..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {filteredInventories.map((inv) => (
                                <div key={inv._id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{inv.organization.organizationName}</h3>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                                <MapPin size={14} /> {inv.organization.address}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                                <Phone size={14} /> {inv.organization.phone}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedOrg(inv);
                                                setRequestData({ ...requestData, bloodGroup: 'A+' });
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition self-start"
                                        >
                                            Request Blood
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-6">
                                        {bloodGroups.map(bg => (
                                            <div key={bg} className="text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                                                <div className="text-xs font-bold text-gray-500 uppercase">{bg}</div>
                                                <div className={`text-lg font-bold ${inv[bg] > 0 ? 'text-green-600' : 'text-red-400'}`}>
                                                    {inv[bg] || 0}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: My Requests */}
                    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Requests</h3>
                        <div className="space-y-4">
                            {myRequests.map((r) => (
                                <div key={r._id} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-800 text-sm">{r.organization.organizationName}</span>
                                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                            r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            r.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {r.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                                    <div className="text-xs font-bold text-blue-600">
                                        {r.bloodGroup} - {r.quantity} units
                                    </div>
                                    {r.status === 'accepted' && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-600">
                                            <div className="font-bold uppercase mb-1">Contact Details:</div>
                                            <div>{r.organization.phone}</div>
                                            <div>{r.organization.email}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {myRequests.length === 0 && (
                                <div className="text-center py-10 text-gray-400 italic text-sm">No requests yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Request Modal */}
            {selectedOrg && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setSelectedOrg(null)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Request Blood</h3>
                        <p className="text-center text-gray-500 mb-6">{selectedOrg.organization.organizationName}</p>

                        {requestStatus === 'success' ? (
                            <div className="text-center py-8">
                                <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
                                <h4 className="text-xl font-bold text-gray-800">Request Sent!</h4>
                                <p className="text-gray-500">Wait for organization to accept.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                                    <select
                                        className="w-full p-3 border rounded-xl"
                                        value={requestData.bloodGroup}
                                        onChange={(e) => setRequestData({ ...requestData, bloodGroup: e.target.value })}
                                        required
                                    >
                                        {bloodGroups.map(bg => (
                                            <option key={bg} value={bg}>{bg} (Available: {selectedOrg[bg] || 0})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity (Units)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded-xl"
                                        value={requestData.quantity}
                                        onChange={(e) => setRequestData({ ...requestData, quantity: Number(e.target.value) })}
                                        min={1}
                                        max={selectedOrg[requestData.bloodGroup]}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={requestStatus === 'loading'}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition mt-4 disabled:opacity-50"
                                >
                                    {requestStatus === 'loading' ? 'Sending...' : 'Send Request'}
                                </button>
                                {requestStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
                                        <AlertCircle size={16} />
                                        <span>{errorMessage}</span>
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
