import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Database, Activity, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [inventories, setInventories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'inventory'>('users');

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

    const counts = {
        donors: users.filter(u => u.role === 'donor').length,
        organizations: users.filter(u => u.role === 'organization').length,
        hospitals: users.filter(u => u.role === 'hospital').length
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Admin Panel...</div>;

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white min-h-screen hidden md:block">
                <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                    <ShieldCheck className="text-red-500" size={28} />
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                    >
                        <Users size={20} /> Users Management
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'inventory' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                    >
                        <Database size={20} /> Global Inventory
                    </button>
                    <div className="pt-8 mt-8 border-t border-gray-800">
                        <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 text-red-400 transition">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab} Overview</h2>
                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
                            <Activity className="text-red-500" size={24} />
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Total Users</div>
                                <div className="text-xl font-bold">{users.length}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-sm font-medium opacity-80 mb-1 uppercase">Donors</div>
                        <div className="text-4xl font-bold">{counts.donors}</div>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-sm font-medium opacity-80 mb-1 uppercase">Blood Banks</div>
                        <div className="text-4xl font-bold">{counts.organizations}</div>
                    </div>
                    <div className="bg-purple-500 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-sm font-medium opacity-80 mb-1 uppercase">Hospitals</div>
                        <div className="text-4xl font-bold">{counts.hospitals}</div>
                    </div>
                </div>

                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">User / Contact</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Joined At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{u.name || u.organizationName || u.hospitalName}</div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                                                <span className="flex items-center gap-1"><Phone size={12} /> {u.phone}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                u.role === 'admin' ? 'bg-gray-800 text-white' :
                                                u.role === 'donor' ? 'bg-blue-100 text-blue-700' :
                                                u.role === 'organization' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-xs text-gray-600 max-w-xs truncate">
                                                <MapPin size={12} className="flex-shrink-0" /> {u.address}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        {inventories.map((inv) => (
                            <div key={inv._id} className="bg-white p-6 rounded-2xl shadow-sm border">
                                <h4 className="text-xl font-bold text-gray-800 mb-4">{inv.organization.organizationName}</h4>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                    {bloodGroups.map(bg => (
                                        <div key={bg} className="bg-gray-50 p-3 rounded-xl text-center border">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{bg}</div>
                                            <div className={`text-xl font-bold ${inv[bg] > 0 ? 'text-green-600' : 'text-red-300'}`}>
                                                {inv[bg] || 0}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
