import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Shield, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-red-600 p-2 rounded-lg">
                        <Heart className="text-white" size={24} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Blood<span className="text-red-600">Connect</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-red-600 transition">Login</Link>
                    <Link to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 transition shadow-lg shadow-gray-200">
                        Join Network
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Emergency Network Live</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter">
                            SAVE LIVES <br />
                            <span className="text-red-600 italic">IN REAL-TIME.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                            Connecting donors, hospitals, and blood banks through a seamless, automated infrastructure. Efficient, transparent, and built for emergency.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="flex items-center justify-center gap-2 bg-red-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-red-700 transition shadow-2xl shadow-red-200 uppercase">
                                Start Donating <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-900 px-10 py-5 rounded-2xl text-lg font-black hover:bg-gray-50 transition uppercase">
                                Hospital Login
                            </Link>
                        </div>
                    </div>
                    <div className="relative lg:h-[600px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-red-100 rounded-[4rem] rotate-3 -z-10 opacity-50"></div>
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-50 relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-red-50 p-6 rounded-3xl">
                                        <Activity className="text-red-600 mb-4" size={32} />
                                        <h3 className="font-black text-2xl text-gray-900">2.4k</h3>
                                        <p className="text-sm text-gray-500 font-bold uppercase">Requests</p>
                                    </div>
                                    <div className="bg-gray-900 p-6 rounded-3xl text-white">
                                        <Users className="text-red-500 mb-4" size={32} />
                                        <h3 className="font-black text-2xl uppercase italic">Global</h3>
                                        <p className="text-sm opacity-60 font-bold">Network</p>
                                    </div>
                                </div>
                                <div className="pt-8 space-y-4">
                                    <div className="bg-red-600 p-6 rounded-3xl text-white">
                                        <Heart className="text-white mb-4" size={32} fill="currentColor" />
                                        <h3 className="font-black text-2xl">850+</h3>
                                        <p className="text-sm opacity-80 font-bold uppercase">Donations</p>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-3xl">
                                        <Shield className="text-blue-600 mb-4" size={32} />
                                        <h3 className="font-black text-2xl text-gray-900 italic uppercase">Secure</h3>
                                        <p className="text-sm text-gray-500 font-bold uppercase">Infrastructure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Roles Section */}
            <section className="bg-gray-50 py-32">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 uppercase">One Platform. <span className="text-red-600 italic">Four Pillars.</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm">Empowering every role in the donation lifecycle.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Donors', desc: 'Book slots, track history, and get certified.', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
                            { title: 'Hospitals', desc: 'Real-time inventory and instant requests.', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'Organizations', desc: 'Automated inventory and request handling.', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'Admin', desc: 'Global oversight and network orchestration.', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
                        ].map((role, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                                <div className={`${role.bg} ${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <role.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic">{role.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{role.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
