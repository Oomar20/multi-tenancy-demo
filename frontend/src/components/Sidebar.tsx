import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SchoolRes {
    name: string;
    tenantKey: string;
}

const Sidebar: React.FC = () => {

    const navigate = useNavigate();
    const [schoolName, setSchoolName] = useState<string>('MyApp');
    const [loading, setLoading] = useState<boolean>(true);

    const links = [
        { name: 'Dashboard', to: '/dashboard' },
        { name: 'Profile', to: '/profile' },
        { name: 'Settings', to: '/settings' },
    ];


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        async function loadSchool() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/me/school', {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!res.ok) {
                    throw new Error(`Status ${res.status}`);
                }

                const data: SchoolRes = await res.json();
                setSchoolName(data.name);
            } catch (err) {
                console.error('Failed to load school:', err);
            } finally {
                setLoading(false);
            }
        }

        loadSchool();
    }, []);

    return (
        <aside className="w-64 bg-gray-800 text-white h-screen flex flex-col">
            {/* Logo / App title */}
            <div className="px-6 py-4 text-2xl font-bold">
                {loading ? 'Loading…' : schoolName}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded 
               ${isActive
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-700 transition-colors'}`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-4 py-6">
                <button
                    onClick={() => handleLogout()}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 rounded transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
