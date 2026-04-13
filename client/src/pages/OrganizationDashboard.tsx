import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw, Save } from 'lucide-react';

const OrganizationDashboard = () => {
    const { logout } = useAuth();
    const [inventory, setInventory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [newQuantities, setNewQuantities] = useState<any>({});
    const [donations, setDonations] = useState<any[]>([]);
    const [donationsLoading, setDonationsLoading] = useState(true);

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

    useEffect(() => {
        fetchInventory();
        fetchDonations();
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
                fetchInventory(); // Refresh inventory if fulfilled
            }
        } catch (error) {
            console.error('Failed to update donation status', error);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Inventory...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-red-600 text-white p-4 flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-bold">Blood Bank Organization Dashboard</h1>
                <button onClick={logout} className="flex items-center gap-2 bg-red-700 hover:bg-red-800 p-2 rounded transition">
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            <main className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
                    <button onClick={fetchInventory} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {bloodGroups.map((bg) => (
                        <div key={bg} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-gray-700">{bg}</span>
                                <span className="text-sm text-gray-500 font-medium">Current: {inventory?.[bg] || 0} units</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                                    value={newQuantities[bg]}
                                    onChange={(e) => setNewQuantities({ ...newQuantities, [bg]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleUpdate(bg)}
                                    disabled={updating === bg}
                                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
                                >
                                    {updating === bg ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Donation Bookings</h2>
                        <button onClick={fetchDonations} className="text-red-600 hover:text-red-700">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                                <tr>
                                    <th className="p-4">Donor Name</th>
                                    <th className="p-4">Blood Group</th>
                                    <th className="p-4">Date & Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donations.map((d) => (
                                    <tr key={d._id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{d.donor?.name}</div>
                                            <div className="text-xs text-gray-500">{d.donor?.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">{d.bloodGroup}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(d.date).toLocaleDateString()} at {d.time}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                                                d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                d.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                d.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {d.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDonationStatus(d._id, 'accepted')} className="text-blue-600 hover:underline text-sm font-medium">Accept</button>
                                                    <button onClick={() => handleDonationStatus(d._id, 'rejected')} className="text-red-600 hover:underline text-sm font-medium">Reject</button>
                                                </div>
                                            )}
                                            {d.status === 'accepted' && (
                                                <button onClick={() => handleDonationStatus(d._id, 'fulfilled')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">Fulfill</button>
                                            )}
                                            {d.status === 'fulfilled' && (
                                                <span className="text-gray-400 text-sm italic">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {donations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 italic">No donation bookings found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrganizationDashboard;
