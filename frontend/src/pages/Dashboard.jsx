import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  Target,
  Layers,
  Clock,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAudits: 0,
    activeAudits: 0,
    completedAudits: 0,
    pendingActions: 0
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default Mock Data for immediate visual feedback
  const mockAudits = useMemo(() => [
    { _id: '1', title: 'Quarterly Financial Review', department: 'Finance', status: 'In-Progress', auditor: { name: 'Sarah J.' }, type: 'Audit' },
    { _id: '2', title: 'Network Security Patching', department: 'IT Infrastructure', status: 'Completed', auditor: { name: 'Mark A.' }, type: 'Maintenance' },
    { _id: '3', title: 'Physical Access Audit', department: 'SecOps', status: 'Planned', auditor: { name: 'Linda K.' }, type: 'Security' },
    { _id: '4', title: 'MFA Configuration Gap', department: 'IT Ops', status: 'Critical', auditor: { name: 'Sarah J.' }, type: 'Finding' },
    { _id: '5', title: 'Annual HR Compliance', department: 'HR', status: 'Completed', auditor: { name: 'Kevin B.' }, type: 'Audit' },
    { _id: '6', title: 'Firewall Rule Cleanup', department: 'NetAdmin', status: 'In-Progress', auditor: { name: 'Alice W.' }, type: 'Action' },
    { _id: '7', title: 'Data Encryption Review', department: 'Legal', status: 'Planned', auditor: { name: 'Bob C.' }, type: 'Privacy' },
    { _id: '8', title: 'API Authentication Audit', department: 'DevOps', status: 'Critical', auditor: { name: 'Charlie D.' }, type: 'Audit' },
    { _id: '9', title: 'Database Optimization', department: 'Data Eng', status: 'Completed', auditor: { name: 'Erin F.' }, type: 'Maintenance' },
    { _id: '10', title: 'User Access Review', department: 'IAM', status: 'In-Progress', auditor: { name: 'Gary H.' }, type: 'Audit' },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: audits } = await api.get('/audits');

        if (audits && Array.isArray(audits) && audits.length > 0) {
          setRecentAudits(audits.slice(0, 10));
          const active = audits.filter(a => a.status === 'In-Progress').length;
          const completed = audits.filter(a => a.status === 'Completed').length;
          setStats({
            totalAudits: audits.length,
            activeAudits: active,
            completedAudits: completed,
            pendingActions: 12
          });
        } else {
          // Fallback to mock if no real data
          setRecentAudits(mockAudits);
          setStats({
            totalAudits: 24,
            activeAudits: 12,
            completedAudits: 18,
            pendingActions: 15
          });
        }

        setChartData([
          { name: 'Mon', audits: 4, efficiency: 85 },
          { name: 'Tue', audits: 7, efficiency: 92 },
          { name: 'Wed', audits: 5, efficiency: 88 },
          { name: 'Thu', audits: 12, efficiency: 95 },
          { name: 'Fri', audits: 9, efficiency: 90 },
          { name: 'Sat', audits: 3, efficiency: 82 },
          { name: 'Sun', audits: 2, efficiency: 80 },
        ]);

        setPieData([
          { name: 'Fully Compliant', value: 45, color: '#10b981' },
          { name: 'Minor Gaps', value: 30, color: '#3b82f6' },
          { name: 'Critical Risks', value: 15, color: '#f59e0b' },
          { name: 'Non-Compliant', value: 10, color: '#ef4444' },
        ]);

      } catch (err) {
        console.error('Dashboard Data Fetch Error:', err);
        // Ensure mock data is set even on error
        setRecentAudits(mockAudits);
        setStats({
          totalAudits: 24,
          activeAudits: 12,
          completedAudits: 18,
          pendingActions: 15
        });
        setChartData([
          { name: 'Mon', audits: 4, efficiency: 85 },
          { name: 'Tue', audits: 7, efficiency: 92 },
          { name: 'Wed', audits: 5, efficiency: 88 },
          { name: 'Thu', audits: 12, efficiency: 95 },
          { name: 'Fri', audits: 9, efficiency: 90 },
          { name: 'Sat', audits: 3, efficiency: 82 },
          { name: 'Sun', audits: 2, efficiency: 80 },
        ]);
        setPieData([
          { name: 'Fully Compliant', value: 45, color: '#10b981' },
          { name: 'Minor Gaps', value: 30, color: '#3b82f6' },
          { name: 'Critical Risks', value: 15, color: '#f59e0b' },
          { name: 'Non-Compliant', value: 10, color: '#ef4444' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mockAudits]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const Card = ({ title, value, icon: Icon, color, trend, bgGradient }) => (
    <div className={`p-8 rounded-[32px] shadow-sm border border-white/20 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white`}>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{title}</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h3>
          {trend && (
            <p className="text-sm mt-4 flex items-center font-black text-green-500 uppercase tracking-widest">
              <TrendingUp size={14} className="mr-1.5" />
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
          <Icon size={26} />
        </div>
      </div>
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgGradient} blur-[60px] opacity-20 -mr-12 -mt-12 rounded-full`}></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary font-black text-sm uppercase tracking-[0.3em] mb-2">
            <Activity size={14} />
            <span>High-Velocity Monitoring</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Greetings, {user?.name?.split(' ')[0] || 'Member'}
          </h2>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            System status is <span className="text-green-500 font-black">OPTIMAL</span>. Performance is up <span className="text-gray-900 font-bold">18.4%</span> since last cycle.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
            <Clock size={18} className="text-primary" />
            <span className="text-base font-black text-gray-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-110 active:scale-90 transition-all">
            <Zap size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card title="Audit volume" value={stats.totalAudits} icon={ClipboardList} color="bg-blue-600" trend="+12% VS LAST MONTH" bgGradient="bg-blue-400" />
        <Card title="Pulse Matrix" value={stats.activeAudits} icon={Target} color="bg-indigo-600" trend="8 CRITICAL PATHS" bgGradient="bg-indigo-400" />
        <Card title="Health Index" value="98.2" icon={ShieldCheck} color="bg-emerald-600" trend="TARGET: 100%" bgGradient="bg-emerald-400" />
        <Card title="Risk Actions" value={stats.pendingActions} icon={AlertTriangle} color="bg-rose-600" trend="ACTION REQUIRED" bgGradient="bg-rose-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Output Performance */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Output Performance</h3>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mt-1">Throughput & Efficiency Analysis</p>
            </div>
            <div className="flex bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100">
              <button className="px-6 py-2.5 bg-white text-sm font-black text-primary rounded-xl shadow-sm uppercase tracking-widest">Weekly</button>
              <button className="px-6 py-2.5 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Monthly</button>
            </div>
          </div>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="audits" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAudits)" />
                <Area type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorEff)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50/50 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        </div>

        {/* Status Mesh */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col group overflow-hidden">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Status Mesh</h3>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">System Compliance Distribution</p>
          <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Layers className="text-indigo-600 mb-2" size={24} />
              <span className="text-4xl font-black text-gray-900 tracking-tighter">98.2</span>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Overall Mesh</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {pieData.map((item, i) => (
              <div key={item.name} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-black text-gray-400 uppercase tracking-tighter truncate">{item.name}</span>
                </div>
                <span className="text-lg font-black text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity Ledger</h3>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mt-1">Live Operational Stream</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Filter stream..." className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all border-none shadow-inner bg-gray-100/50" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-sm font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-10 py-6">Operational Event</th>
                <th className="px-10 py-6">Functional Unit</th>
                <th className="px-10 py-6">Executed By</th>
                <th className="px-10 py-6 text-right pr-14">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAudits.map((audit) => (
                <tr key={audit._id} className="hover:bg-indigo-50/30 transition-all duration-300 group/row">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 shadow-sm transition-all group-hover/row:rotate-6 group-hover/row:text-primary group-hover/row:border-primary/20 group-hover/row:shadow-md">
                        {audit.type === 'Audit' ? <ClipboardList size={22} /> : audit.type === 'Finding' ? <AlertTriangle size={22} /> : <Activity size={22} />}
                      </div>
                      <div>
                        <span className="font-black text-gray-900 text-lg group-hover/row:text-primary transition-colors block leading-none mb-1">{audit.title}</span>
                        <span className="text-sm font-black uppercase text-gray-400 tracking-widest">{audit.type || 'Operational'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-gray-500 text-sm font-black uppercase tracking-widest px-3 py-1.5 bg-gray-100 rounded-lg">{audit.department}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/10 group-hover/row:scale-110 transition-transform">
                        {audit.auditor?.name?.[0] || 'A'}
                      </div>
                      <span className="text-base font-bold text-gray-700">{audit.auditor?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right pr-14">
                    <button className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-primary hover:bg-white hover:shadow-2xl rounded-2xl border border-transparent hover:border-gray-100 transition-all active:scale-90">
                      <ArrowUpRight size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
