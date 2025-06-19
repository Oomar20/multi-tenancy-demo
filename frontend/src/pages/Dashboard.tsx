import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';
import GradeCard from '../components/GradeCard';

interface Grade {
    level: string;
    section: string;
}

const Dashboard: React.FC = () => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGrades() {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/', { replace: true });
                return;
            }

            try {
                const res = await fetch('/api/users/me/grades', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data: Grade[] = await res.json();
                setGrades(data);
                console.log(data);
            } catch (err) {
                console.error('Failed to load grades:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchGrades();
    }, [navigate]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 bg-gray-100 p-6">
                <h1 className="text-3xl font-semibold mb-6">
                    Welcome to your dashboard!
                </h1>

                {loading ? (
                    <p>Loading grades…</p>
                ) : grades.length > 0 ? (
                    <div className="text-center grid grid-cols-12 gap-4">
                        {grades.map((g) => (
                            <GradeCard
                                key={g.level}
                                level={g.level}
                                section={g.section}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No grades assigned yet.</p>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
