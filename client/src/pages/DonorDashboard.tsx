import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { LogOut, Search, MapPin, Calendar, Heart, X, CheckCircle2, Bell } from 'lucide-react';

const DonorDashboard = () => {
    const { logout, user } = useAuth();
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<any>(null);
    const [bookingData, setBookingData] = useState({
        bloodGroup: 'O+',
        date: '',
        time: ''
    });
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [myDonations, setMyDonations] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);

    useSocket((event, data) => {
        if (event === 'donation-status-update') {
            setNotifications(prev => [`Your donation status is now ${data.donation.status}!`, ...prev]);
            fetchMyDonations();
        }
    });

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventory');
            if (data.success) {
                setOrganizations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyDonations = async () => {
        try {
            const { data } = await api.get('/donations/my');
            if (data.success) {
                setMyDonations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch my donations', error);
        }
    };

    useEffect(() => {
        fetchOrganizations();
        fetchMyDonations();
    }, []);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStatus('loading');
        try {
            const { data } = await api.post('/donations/book', {
                ...bookingData,
                organization: selectedOrg.organization._id
            });
            if (data.success) {
                setBookingStatus('success');
                fetchMyDonations();
                setTimeout(() => {
                    setSelectedOrg(null);
                    setBookingStatus('idle');
                }, 2000);
            }
        } catch (error) {
            setBookingStatus('error');
        }
    };

    const handleDownloadCertificate = async (donationId: string) => {
        try {
            const response = await api.get(`/donations/${donationId}/certificate`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate_${donationId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download certificate', error);
        }
    };

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
                <div className="flex items-center gap-4">
                    {notifications.length > 0 && (
                        <div className="relative group">
                            <Bell className="cursor-pointer" size={24} />
                            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-bold px-1 rounded-full">{notifications.length}</span>
                            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-xl rounded-lg hidden group-hover:block z-50 p-2 border">
                                <h4 className="font-bold border-b pb-1 mb-2 text-red-600">Notifications</h4>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {notifications.map((n, i) => (
                                        <div key={i} className="text-xs bg-gray-50 p-2 rounded">{n}</div>
                                    ))}
                                </div>
                                <button onClick={() => setNotifications([])} className="w-full text-center text-red-600 text-xs mt-2 hover:underline">Clear all</button>
                            </div>
                        </div>
                    )}
                    <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded transition">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {user?.name}!</h2>
                    <p className="text-gray-600">Your contribution can save lives. Find a blood bank near you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Find Organizations */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Available Blood Banks</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-red-300 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredOrgs.map((inv) => (
                                <div key={inv._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <h4 className="text-xl font-bold text-gray-800 mb-3">{inv.organization.organizationName}</h4>
                                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                                        <MapPin className="mt-1 flex-shrink-0 text-red-400" size={16} />
                                        <span className="text-sm">{inv.organization.address}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrg(inv)}
                                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition"
                                    >
                                        <Calendar size={18} /> Book a Slot
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: My Bookings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">My Recent Bookings</h3>
                        <div className="space-y-4">
                            {myDonations.map((d) => (
                                <div key={d._id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-800">{d.organization.organizationName}</span>
                                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                            d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            d.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                            d.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">{new Date(d.date).toLocaleDateString()} at {d.time}</div>
                                    <div className="text-xs font-bold text-red-600">Blood Group: {d.bloodGroup}</div>
                                    {d.status === 'fulfilled' && (
                                        <button 
                                            onClick={() => handleDownloadCertificate(d._id)}
                                            className="mt-3 w-full text-xs bg-red-600 text-white py-1.5 rounded hover:bg-red-700 transition"
                                        >
                                            Download Certificate
                                        </button>
                                    )}
                                </div>
                            ))}
                            {myDonations.length === 0 && (
                                <div className="text-center py-10 text-gray-400 italic text-sm">No bookings yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {selectedOrg && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setSelectedOrg(null)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Book a Slot</h3>
                        <p className="text-center text-gray-500 mb-6">{selectedOrg.organization.organizationName}</p>

                        {bookingStatus === 'success' ? (
                            <div className="text-center py-8">
                                <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
                                <h4 className="text-xl font-bold text-gray-800">Booking Successful!</h4>
                                <p className="text-gray-500">Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBook} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                                    <select
                                        className="w-full p-3 border rounded-xl"
                                        value={bookingData.bloodGroup}
                                        onChange={(e) => setBookingData({ ...bookingData, bloodGroup: e.target.value })}
                                        required
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border rounded-xl"
                                        value={bookingData.date}
                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Time</label>
                                    <select
                                        className="w-full p-3 border rounded-xl"
                                        value={bookingData.time}
                                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a time slot</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={bookingStatus === 'loading'}
                                    className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition mt-4 disabled:opacity-50"
                                >
                                    {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
                                </button>
                                {bookingStatus === 'error' && (
                                    <p className="text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;
