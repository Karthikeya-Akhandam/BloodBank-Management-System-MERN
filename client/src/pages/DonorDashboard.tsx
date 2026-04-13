import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search, MapPin, Calendar, Heart } from 'lucide-react';

const DonorDashboard = () => {
    const { logout, user } = useAuth();
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventory'); // Get organizations via inventory list
            if (data.success) {
                setOrganizations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const filteredOrgs = organizations.filter(inv => 
        inv.organization.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.organization.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Organizations...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-red-500 text-white p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <Heart className="fill-white" size={24} />
                    <h1 className="text-xl font-bold">Donor Portal</h1>
                </div>
                <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded transition">
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            <main className="p-8 max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {user?.name}!</h2>
                    <p className="text-gray-600">Your contribution can save lives. Find a blood bank near you.</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Available Blood Banks</h3>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search blood banks..."
                            className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-red-300 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrgs.map((inv) => (
                        <div key={inv._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <h4 className="text-xl font-bold text-gray-800 mb-3">{inv.organization.organizationName}</h4>
                            <div className="flex items-start gap-2 text-gray-600 mb-2">
                                <MapPin className="mt-1 flex-shrink-0 text-red-400" size={16} />
                                <span className="text-sm">{inv.organization.address}</span>
                            </div>
                            <div className="mt-6">
                                <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition">
                                    <Calendar size={18} /> Book a Donation Slot
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredOrgs.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            No blood banks found in this area.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DonorDashboard;
