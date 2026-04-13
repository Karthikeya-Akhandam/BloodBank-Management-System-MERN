import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { LogOut, Search, MapPin, Calendar, Heart, X, CheckCircle2, Bell, Clock, FileDown, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Personalizing your donor portal...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* Header */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
                            <Heart className="text-white fill-current" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">Donor<span className="text-red-600">Portal</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {notifications.length > 0 && (
                            <div className="relative group">
                                <Bell className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors" size={24} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                                <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-[2rem] border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
                                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">Updates</span>
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
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <div className="text-xs font-black uppercase tracking-tighter text-gray-900">{user?.name}</div>
                                <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest italic">Certified Donor</div>
                            </div>
                            <button onClick={logout} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 transition-colors rounded-xl border border-gray-100">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Find Centers */}
                    <div className="lg:col-span-2">
                        <div className="mb-12">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Be a <span className="text-red-600">Hero.</span></h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic max-w-xl leading-relaxed">Your contribution is vital for emergency medical support. Select a certified blood bank from the network below to schedule your next donation.</p>
                        </div>

                        <div className="relative mb-10 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search by bank name or district..."
                                className="w-full pl-16 pr-6 py-6 bg-white border-2 border-transparent shadow-sm shadow-gray-100 rounded-[2rem] focus:border-red-600 outline-none transition-all font-bold text-lg text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredOrgs.map((inv) => (
                                <div key={inv._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 group">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Activity className="text-red-600" size={24} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-3 group-hover:text-red-600 transition-colors">{inv.organization.organizationName}</h4>
                                    <div className="flex items-start gap-2 text-gray-400 mb-8 h-12 overflow-hidden">
                                        <MapPin className="mt-1 flex-shrink-0 text-red-600" size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed line-clamp-2">{inv.organization.address}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrg(inv)}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all uppercase tracking-tighter shadow-xl shadow-gray-200"
                                    >
                                        <Calendar size={18} /> Schedule Slot
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Donation History */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-32">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                                <Clock className="text-red-600" size={24} /> Records.
                            </h3>
                            <div className="space-y-6">
                                {myDonations.map((d) => (
                                    <div key={d._id} className="relative pl-6 border-l-2 border-gray-100 py-1 hover:border-red-600 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-black text-gray-900 text-[11px] uppercase tracking-tighter group-hover:text-red-600 transition-colors">{d.organization.organizationName}</span>
                                            <span className={`text-[9px] uppercase px-3 py-1 rounded-full font-black tracking-[0.1em] ${
                                                d.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                d.status === 'accepted' ? 'bg-blue-50 text-blue-600' :
                                                d.status === 'fulfilled' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">{new Date(d.date).toLocaleDateString()} @ {d.time}</div>
                                        <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between">
                                            <span className="text-xl font-black italic text-gray-900">{d.bloodGroup}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase italic">Authorized Group</span>
                                        </div>
                                        {d.status === 'fulfilled' && (
                                            <button 
                                                onClick={() => handleDownloadCertificate(d._id)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-red-100"
                                            >
                                                <FileDown size={14} /> Get Certificate
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {myDonations.length === 0 && (
                                    <div className="text-center py-12 px-6">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                                            <Heart className="text-gray-300" size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No donation records found in the network.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {selectedOrg && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 max-w-2xl w-full relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                        
                        <button
                            onClick={() => setSelectedOrg(null)}
                            className="absolute right-10 top-10 p-3 bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors rounded-2xl border border-gray-100"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full mb-6">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Booking</span>
                            </div>
                            <h3 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Book <span className="text-red-600">Slot.</span></h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Facility: {selectedOrg.organization.organizationName}</p>
                        </div>

                        {bookingStatus === 'success' ? (
                            <div className="text-center py-16 animate-in zoom-in-95">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                                    <CheckCircle2 className="text-green-500" size={48} />
                                </div>
                                <h4 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Slot Confirmed!</h4>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Redirecting to history...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBook} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
                                        <select
                                            className="w-full bg-gray-50 p-5 rounded-[2rem] border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-black text-xl italic text-gray-900 appearance-none cursor-pointer"
                                            value={bookingData.bloodGroup}
                                            onChange={(e) => setBookingData({ ...bookingData, bloodGroup: e.target.value })}
                                            required
                                        >
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-gray-50 p-5 rounded-[2rem] border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-black text-sm text-gray-900"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Time</label>
                                        <select
                                            className="w-full bg-gray-50 p-5 rounded-[2rem] border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-black text-sm text-gray-900 appearance-none cursor-pointer"
                                            value={bookingData.time}
                                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose Slot</option>
                                            {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={bookingStatus === 'loading'}
                                    className="w-full bg-gray-900 text-white font-black py-6 rounded-[2.5rem] hover:bg-red-600 transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 uppercase tracking-tighter text-xl italic disabled:opacity-50"
                                >
                                    {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Appointment'}
                                    {!bookingStatus === 'loading' && <ArrowRight size={24} />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;
