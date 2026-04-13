import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw, Search, Phone, MapPin } from 'lucide-react';

const HospitalDashboard = () => {
    const { logout } = useAuth();
    const [inventories, setInventories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchInventories();
    }, []);

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
                        <div key={inv._id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 overflow-x-auto">
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
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition self-start">
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
                    {filteredInventories.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                            No blood banks found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HospitalDashboard;
