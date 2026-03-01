import { useState, useEffect } from 'react';
import { adminApi, api } from '../../api/axios';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        pendingApprovals: 0,
        totalRegistrations: 0,
        activeVenues: 0
    });
    const [chartData, setChartData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminApi.get('/api/admin/stats');
                setStats({
                    totalEvents: res.data.totalEvents,
                    pendingApprovals: res.data.pendingApprovals,
                    totalRegistrations: res.data.totalRegistrations,
                    activeVenues: res.data.activeVenues
                });
                setChartData(res.data.chartData);
                setStatusData(res.data.statusData);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
                <p className="text-slate-500">Here's what's happening across EventSphere today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="text-primary" />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color="text-amber-500" trend="+2 since yesterday" />
                <StatCard title="Total Students" value={stats.totalRegistrations} icon={Users} color="text-accent-pink" />
                <StatCard title="Active Venues" value={stats.activeVenues} icon={CheckCircle} color="text-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Engagement by Event</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Bar dataKey="registrations" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Status Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {statusData.map(item => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-500">{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
