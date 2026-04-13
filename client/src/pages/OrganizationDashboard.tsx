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

    useEffect(() => {
        fetchInventory();
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </main>
        </div>
    );
};

export default OrganizationDashboard;
