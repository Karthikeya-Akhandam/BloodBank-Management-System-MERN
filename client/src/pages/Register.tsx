import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, User, Building2, Hospital, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('donor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const formData = {
                role, email, password, address, phone,
                name: (role === 'donor' || role === 'admin') ? name : undefined,
                organizationName: role === 'organization' ? organizationName : undefined,
                hospitalName: role === 'hospital' ? hospitalName : undefined
            };
            const { data } = await api.post('/auth/register', formData);
            if (data.success) {
                login(data);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleIcon = () => {
        switch(role) {
            case 'donor': return <User size={24} />;
            case 'organization': return <Building2 size={24} />;
            case 'hospital': return <Hospital size={24} />;
            default: return <User size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-12">
            <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl shadow-gray-200 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side - Info */}
                <div className="md:w-1/3 bg-red-600 p-12 text-white flex flex-col">
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <Heart className="text-white" size={24} fill="currentColor" />
                        <span className="text-xl font-black tracking-tighter uppercase">BloodConnect</span>
                    </Link>
                    
                    <div className="mt-auto">
                        <div className="bg-red-700/50 p-6 rounded-3xl mb-8">
                            <h3 className="text-2xl font-black mb-4 uppercase italic leading-tight">Join the <br />Life-Saving <br />Mission.</h3>
                            <p className="text-red-100 text-sm font-medium leading-relaxed">
                                Create an account to become part of a global network dedicated to emergency blood supply and donor management.
                            </p>
                        </div>
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-red-600 bg-red-400 flex items-center justify-center text-[10px] font-bold">
                                    UA
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-red-600 bg-white text-red-600 flex items-center justify-center text-[10px] font-bold">
                                +2k
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-black mt-4 opacity-60">Verified Partners Active</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-2/3 p-8 lg:p-16">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Create Account</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select your role to start</p>
                        </div>
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                            {['donor', 'organization', 'hospital'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${role === r ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 mb-8 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {role === 'donor' && (
                            <div className="space-y-1 col-span-full">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>
                        )}
                        {role === 'organization' && (
                            <div className="space-y-1 col-span-full">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Organization Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="Red Cross" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
                                </div>
                            </div>
                        )}
                        {role === 'hospital' && (
                            <div className="space-y-1 col-span-full">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hospital Name</label>
                                <div className="relative">
                                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="City Hospital" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input type="email" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="name@org.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-1 col-span-full">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={16} />
                                <textarea className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold min-h-[100px]" placeholder="123 Emergency St, Medical District" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-1 col-span-full">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input type="password" name="password" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-red-600 outline-none transition-all text-sm font-bold" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="col-span-full bg-gray-900 text-white font-black py-5 rounded-[2rem] hover:bg-red-600 transition-all shadow-xl shadow-gray-100 flex items-center justify-center gap-2 uppercase tracking-tighter text-lg mt-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Complete Registration'}
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        Already have an account? <Link to="/login" className="text-red-600 hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
