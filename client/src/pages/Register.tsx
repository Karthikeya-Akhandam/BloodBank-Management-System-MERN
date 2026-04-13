import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Register</h2>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full mb-2">
                        <label className="block text-gray-700 mb-2">Role</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="donor">Donor</option>
                            <option value="organization">Blood Bank (Organization)</option>
                            <option value="hospital">Hospital</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {(role === 'donor' || role === 'admin') && (
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-2">Name</label>
                            <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    )}
                    {role === 'organization' && (
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-2">Organization Name</label>
                            <input type="text" className="w-full p-2 border rounded" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
                        </div>
                    )}
                    {role === 'hospital' && (
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-2">Hospital Name</label>
                            <input type="text" className="w-full p-2 border rounded" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />
                        </div>
                    )}

                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input type="password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2">Phone</label>
                        <input type="text" className="w-full p-2 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="col-span-full mb-4">
                        <label className="block text-gray-700 mb-2">Address</label>
                        <textarea className="w-full p-2 border rounded" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>

                    <button
                        type="submit"
                        className="col-span-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-red-600 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
