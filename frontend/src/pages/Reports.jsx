import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    ArrowRight,
    CheckCircle2,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    FileDown,
    ChevronRight,
    Settings,
    X,
    ShieldCheck,
    TrendingUp,
    Layout
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
    Legend
} from 'recharts';
import api from '../services/api';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showGenerator, setShowGenerator] = useState(false);
    const [step, setStep] = useState(1);
    const [viewMode, setViewMode] = useState('Monthly'); // 'Monthly' or 'Yearly'

    // Generator State
    const [genData, setGenData] = useState({
        title: '',
        type: 'Annual',
        audit: '',
        format: 'PDF',
        includeFindings: true,
        includeActions: true,
        includeAnalytics: true
    });

    const [audits, setAudits] = useState([]);

    useEffect(() => {
        fetchReports();
        fetchAudits();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/reports');
            setReports(data);
        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAudits = async () => {
        try {
            const { data } = await api.get('/audits');
            setAudits(data);
        } catch (err) {
            console.error('Error fetching audits:', err);
        }
    };

    const handleGenerate = async () => {
        try {
            // Step 4 is Completion
            setStep(4);
            await api.post('/reports', {
                title: genData.title || `Audit Report - ${new Date().toLocaleDateString()}`,
                type: genData.type,
                audit: genData.audit
            });
            fetchReports();
        } catch (err) {
            console.error('Error generating report:', err);
        }
    };

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const analyticsData = [
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In-Progress', value: 30, color: '#3b82f6' },
        { name: 'Pending', value: 25, color: '#f59e0b' },
    ];

    const monthlyTrendData = [
        { name: 'Jan', reports: 12 },
        { name: 'Feb', reports: 19 },
        { name: 'Mar', reports: 15 },
        { name: 'Apr', reports: 22 },
        { name: 'May', reports: 30 },
    ];

    const yearlyTrendData = [
        { name: '2022', reports: 145 },
        { name: '2023', reports: 182 },
        { name: '2024', reports: 215 },
        { name: '2025', reports: 248 },
        { name: '2026', reports: 92 },
    ];

    const trendData = viewMode === 'Monthly' ? monthlyTrendData : yearlyTrendData;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Reporting Engine</h1>
                    <p className="text-gray-500 mt-1 text-lg">Generate, archive, and analyze comprehensive audit results.</p>
                </div>
                <button
                    onClick={() => { setShowGenerator(true); setStep(1); }}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
                >
                    <Plus className="mr-2" size={20} />
                    Generate New Report
                </button>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <BarChartIcon size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Trend Analysis</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Report Output volume</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                            <button
                                onClick={() => setViewMode('Monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'Monthly' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setViewMode('Yearly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'Yearly' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                    <div className="h-64 mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="reports" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-full mb-8">
                        <h3 className="font-bold text-gray-900 text-lg">System Health</h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Compliance distribution</p>
                    </div>
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analyticsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-2xl font-black text-gray-900">92%</p>
                            <p className="text-sm font-black uppercase text-gray-400">Target</p>
                        </div>
                    </div>
                    <div className="w-full mt-6 space-y-3">
                        {analyticsData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{item.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Generator Stepper Modal */}
            {showGenerator && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                    <Settings size={24} className={step === 4 ? 'animate-spin-slow' : ''} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Report Generator</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-primary' : 'w-4 bg-gray-100'}`}></div>
                                        ))}
                                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Step {step} of 3</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowGenerator(false)}
                                className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 min-h-[400px]">
                            {step === 1 && (
                                <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-400 px-1">Scope of Analysis</label>
                                            <select
                                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                                value={genData.audit}
                                                onChange={(e) => setGenData({ ...genData, audit: e.target.value })}
                                            >
                                                <option value="">Full System Audit</option>
                                                {audits.map(a => (
                                                    <option key={a._id} value={a._id}>{a.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-400 px-1">Report Cadence</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Annual', 'Quarterly'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setGenData({ ...genData, type })}
                                                        className={`p-4 rounded-2xl font-bold text-base transition-all border-2 ${genData.type === type ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400 hover:border-gray-100'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 px-1">Compilation Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700"
                                            placeholder="e.g., Q1 Infrastructure Security Review"
                                            value={genData.title}
                                            onChange={(e) => setGenData({ ...genData, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 px-1">Content Parameters</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'includeFindings', label: 'Detailed Observations', info: 'List all non-compliance hits in full depth', icon: ShieldCheck },
                                            { id: 'includeActions', label: 'Remediation Roadmap', info: 'Include corrective action plans and status', icon: TrendingUp },
                                            { id: 'includeAnalytics', label: 'Visual Analytics', info: 'Embed charts and comparative data views', icon: BarChartIcon }
                                        ].map(param => (
                                            <button
                                                key={param.id}
                                                onClick={() => setGenData({ ...genData, [param.id]: !genData[param.id] })}
                                                className={`flex items-center p-6 rounded-3xl transition-all border-2 overflow-hidden relative group ${genData[param.id] ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 ${genData[param.id] ? 'bg-primary text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-400'}`}>
                                                    <param.icon size={22} />
                                                </div>
                                                <div className="text-left">
                                                    <p className={`font-bold text-lg ${genData[param.id] ? 'text-gray-900' : 'text-gray-500'}`}>{param.label}</p>
                                                    <p className="text-sm text-gray-400 font-medium">{param.info}</p>
                                                </div>
                                                {genData[param.id] && <div className="absolute right-6"><CheckCircle2 className="text-primary" size={24} /></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="flex flex-col items-center justify-center py-10 animate-in slide-in-from-right-8 duration-300">
                                    <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mb-6 border-4 border-indigo-100/50">
                                        <FileDown size={40} className="animate-bounce" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-2">Ready for Assembly</h4>
                                    <p className="text-gray-500 text-center max-w-sm mb-10 font-medium">The system is ready to compile your 42-page comprehensive audit documentation.</p>

                                    <div className="bg-gray-50 p-6 rounded-3xl w-full flex items-center justify-between border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <Layout className="text-gray-400" size={20} />
                                            <span className="font-bold text-gray-700">Export Format</span>
                                        </div>
                                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                            {['PDF', 'XLSX'].map(fmt => (
                                                <button
                                                    key={fmt}
                                                    onClick={() => setGenData({ ...genData, format: fmt })}
                                                    className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${genData.format === fmt ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {fmt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center mb-6 border-4 border-green-100/50">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-2">Generation Triggered</h4>
                                    <p className="text-gray-500 text-center max-w-sm mb-10 font-medium">Your report is being compiled. It will appear in your ledger shortly.</p>
                                    <button
                                        onClick={() => setShowGenerator(false)}
                                        className="px-12 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>

                        {step < 4 && (
                            <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    disabled={step === 1}
                                    onClick={() => setStep(step - 1)}
                                    className={`px-6 py-2 font-bold text-gray-400 transition-all ${step === 1 ? 'opacity-0' : 'hover:text-gray-900'}`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={step === 3 ? handleGenerate : () => setStep(step + 1)}
                                    className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all"
                                >
                                    {step === 3 ? 'Generate Report' : 'Continue'}
                                    <ArrowRight size={18} className="ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reports Ledger */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <Search size={22} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search archived reports..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-[20px] text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/20">
                        <Settings size={22} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-sm font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <th className="px-10 py-6">Documentation Identity</th>
                                <th className="px-10 py-6">Classification</th>
                                <th className="px-10 py-6">Timestamp</th>
                                <th className="px-10 py-6 text-right pr-14">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-10 py-24 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
                                            <div className="w-1/2 h-full bg-primary animate-slide-infinite"></div>
                                        </div>
                                        <p className="text-sm font-black uppercase text-gray-300 tracking-[0.3em]">Accessing Repositories...</p>
                                    </div>
                                </td></tr>
                            ) : filteredReports.length === 0 ? (
                                <tr><td colSpan="4" className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center opacity-20 group cursor-default">
                                        <FileText size={64} className="mb-4 group-hover:scale-110 transition-transform duration-500" />
                                        <p className="text-xl font-black text-gray-900">Archives Empty</p>
                                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">No documentation matches your request</p>
                                    </div>
                                </td></tr>
                            ) : filteredReports.map((report) => (
                                <tr key={report._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-[22px] flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/20 shadow-sm transition-all group-hover:rotate-6">
                                                <FileText size={30} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors">{report.title}</p>
                                                <div className="flex items-center text-sm text-gray-400 mt-1 font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={12} className="mr-1.5 text-green-500" />
                                                    Validated Package
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black uppercase tracking-widest border border-indigo-100/50">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            <span className="text-sm font-black uppercase text-gray-400 tracking-tighter mt-1">Archived {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right pr-14">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-3 text-gray-400 hover:text-primary hover:bg-white hover:shadow-xl rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                                <Download size={22} />
                                            </button>
                                            <button className="p-3 text-gray-400 hover:text-primary hover:bg-white hover:shadow-xl rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                                <ChevronRight size={22} />
                                            </button>
                                        </div>
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

export default Reports;
