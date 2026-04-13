import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                login(data);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Side - Visual */}
            <div className="md:w-1/2 bg-gray-900 flex flex-col justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                
                <Link to="/" className="flex items-center gap-2 mb-16 relative z-10">
                    <div className="bg-red-600 p-2 rounded-lg">
                        <Heart className="text-white" size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white uppercase">Blood<span className="text-red-600">Connect</span></span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-5xl font-black text-white leading-tight mb-6 tracking-tighter uppercase italic">
                        Access the <br />
                        <span className="text-red-600 not-italic font-black">Emergency Network.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed font-medium">
                        Log in to manage your inventory, request vital resources, or schedule your next life-saving donation.
                    </p>
                </div>

                <div className="mt-auto relative z-10 flex items-center gap-4 text-gray-500 text-sm font-bold uppercase tracking-widest">
                    <ShieldCheck size={20} className="text-red-600" />
                    Encrypted Infrastructure
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 bg-white flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Welcome Back</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 mb-8 rounded-2xl flex items-center gap-3 text-sm font-bold">
                            <div className="bg-red-600 w-2 h-2 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 uppercase tracking-tighter text-lg disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Authorize Access'}
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        New to the network? <Link to="/register" className="text-red-600 hover:underline">Register Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
