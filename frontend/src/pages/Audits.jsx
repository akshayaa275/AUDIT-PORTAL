import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    User,
    Building2,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    Shield,
    Users as UsersIcon,
    Flag,
    ChevronDown
} from 'lucide-react';
import api from '../services/api';

const Audits = () => {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        auditor: '',
        startDate: '',
        endDate: '',
        scope: '',
        riskLevel: 'Medium',
        team: ''
    });

    const [auditors, setAuditors] = useState([]);

    // Fallback Mock Auditors for robust select experience
    const mockAuditors = [
        { _id: '65ae4df762f276c8a14321b1', name: 'Sarah Jenkins', role: 'Auditor' },
        { _id: '65ae4df762f276c8a14321b2', name: 'Marcus Aurelius', role: 'Auditor' },
        { _id: '65ae4df762f276c8a14321b3', name: 'Linda Kawasaki', role: 'Auditor' },
        { _id: '65ae4df762f276c8a14321b4', name: 'Kevin Baxter', role: 'Auditor' },
        { _id: '65ae4df762f276c8a14321b5', name: 'Natcha (Admin)', role: 'Admin' }
    ];

    useEffect(() => {
        fetchAudits();
        fetchAuditors();
    }, []);

    const fetchAudits = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/audits');
            setAudits(data);
        } catch (err) {
            console.error('Error fetching audits:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditors = async () => {
        try {
            const { data } = await api.get('/users');
            if (data && data.length > 0) {
                const filtered = data.filter(u => u.role === 'Auditor' || u.role === 'Admin');
                setAuditors(filtered.length > 0 ? filtered : mockAuditors);
            } else {
                setAuditors(mockAuditors);
            }
        } catch (err) {
            console.error('Error fetching auditors:', err);
            setAuditors(mockAuditors);
        }
    };

    const handleCreateAudit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                team: formData.team.split(',').map(item => item.trim()).filter(item => item !== '')
            };
            await api.post('/audits', payload);
            setShowModal(false);
            setFormData({
                title: '',
                department: '',
                auditor: '',
                startDate: '',
                endDate: '',
                scope: '',
                riskLevel: 'Medium',
                team: ''
            });
            fetchAudits();
        } catch (err) {
            console.error('Error creating audit:', err);
            const msg = err.response?.data?.message || err.message;
            alert(`Failed to create audit: ${msg}`);
        }
    };

    const filteredAudits = audits.filter(audit => {
        const titleMatch = (audit.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const deptMatch = (audit.department || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = titleMatch || deptMatch;
        const matchesStatus = statusFilter === 'All' || audit.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
            case 'In-Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Planned': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getRiskStyle = (level) => {
        switch (level) {
            case 'High': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-amber-600 bg-amber-50';
            case 'Low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Audit Management</h1>
                    <p className="text-gray-500 mt-1 text-lg font-medium">Schedule, monitor, and manage your internal audit cycles.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
                >
                    <Plus className="mr-2" size={20} />
                    New Audit Plan
                </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Audits', value: audits.filter(a => a.status === 'In-Progress').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Completed', value: audits.filter(a => a.status === 'Completed').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Upcoming', value: audits.filter(a => a.status === 'Planned').length, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Planned', value: audits.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">Initiate New Audit</h3>
                                    <p className="text-sm text-gray-500 font-medium">Define the scope and ownership for the next cycle.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-3 hover:bg-white hover:shadow-sm rounded-2xl transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAudit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Audit Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[18px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-bold shadow-inner"
                                            placeholder="e.g., Annual IT Infrastructure Audit"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Department</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[18px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-bold shadow-inner"
                                            placeholder="e.g., IT Operations"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Start Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-4 py-4 bg-gray-50 border-transparent rounded-[18px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold shadow-inner"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-4 bg-gray-50 border-transparent rounded-[18px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold shadow-inner"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Lead Auditor</label>
                                        <div className="relative">
                                            <select
                                                required
                                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[20px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-bold shadow-inner appearance-none cursor-pointer pr-12"
                                                value={formData.auditor}
                                                onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                                            >
                                                <option value="">Select Lead Auditor</option>
                                                {auditors.map(a => (
                                                    <option key={a._id} value={a._id}>{a.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Criticality / Risk</label>
                                        <div className="flex space-x-2">
                                            {['Low', 'Medium', 'High'].map(level => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, riskLevel: level })}
                                                    className={`flex-1 py-3 rounded-[16px] text-sm font-black uppercase tracking-widest transition-all border ${formData.riskLevel === level
                                                        ? (level === 'High' ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' : level === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-green-50 border-green-200 text-green-600 shadow-sm')
                                                        : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Extended Team (CSV)</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[18px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-bold shadow-inner"
                                            placeholder="e.g., Alice, Bob, Charlie"
                                            value={formData.team}
                                            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Audit Scope & Objectives</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[20px] focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-bold shadow-inner resize-none text-gray-700 placeholder:italic"
                                    placeholder="Summarize the core focus and target objectives of this audit..."
                                    value={formData.scope}
                                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="mt-10 flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Discard Plan
                                </button>
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-primary text-white rounded-[20px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
                                >
                                    Activate Audit Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/20">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400">
                            <Search size={22} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by title or department..."
                            className="block w-full pl-14 pr-5 py-4 border-none bg-white rounded-2xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                            {['All', 'Planned', 'In-Progress', 'Completed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${statusFilter === status
                                        ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                                        : 'text-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-sm font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-10 py-6">Audit Identity</th>
                                <th className="px-10 py-6">Leadership</th>
                                <th className="px-10 py-6">Risk Level</th>
                                <th className="px-10 py-6">Timeline</th>
                                <th className="px-10 py-6 text-center">Involvement</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right pr-14">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
                                        <p className="font-black uppercase tracking-[0.3em] text-sm text-gray-300">Synchronizing Cycles...</p>
                                    </div>
                                </td></tr>
                            ) : filteredAudits.length === 0 ? (
                                <tr><td colSpan="7" className="px-10 py-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center opacity-30">
                                        <FileText size={64} className="mb-4" />
                                        <p className="text-2xl font-black text-gray-900">Registry Entry Empty</p>
                                        <p className="text-base font-medium mt-1 uppercase tracking-widest">Initiate a new audit plan to populate the ledger.</p>
                                    </div>
                                </td></tr>
                            ) : filteredAudits.map((audit) => (
                                <tr key={audit._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center space-x-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${audit.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-white border border-gray-100 text-slate-300 shadow-sm group-hover:rotate-6 group-hover:text-primary'
                                                }`}>
                                                <FileText size={24} />
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors truncate tracking-tight">{audit.title}</p>
                                                <div className="flex items-center text-sm text-gray-400 mt-1 font-black uppercase tracking-widest">
                                                    <Building2 size={12} className="mr-1.5" />
                                                    {audit.department}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mr-3 text-sm font-black shadow-sm ring-1 ring-indigo-100">
                                                {audit.auditor?.name?.[0] || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-700">{audit.auditor?.name || 'Lead'}</p>
                                                <p className="text-sm text-gray-400 uppercase font-black tracking-widest">Principal</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center w-fit border shadow-sm ${getRiskStyle(audit.riskLevel)}`}>
                                            <Flag size={10} className="mr-2" />
                                            {audit.riskLevel || 'Medium'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-gray-900 leading-none mb-1">{new Date(audit.startDate).toLocaleDateString()}</span>
                                            <span className="text-sm text-gray-400 font-black uppercase tracking-tighter">To: {audit.endDate ? new Date(audit.endDate).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex -space-x-2 justify-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm font-black text-slate-500 shadow-sm">
                                                {audit.team?.length || 0}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-sm font-black text-primary shadow-sm">
                                                <UsersIcon size={12} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-sm font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(audit.status)}`}>
                                            {audit.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right pr-14">
                                        <button className="text-gray-300 hover:text-primary p-3 hover:bg-white hover:shadow-2xl rounded-2xl border border-transparent hover:border-gray-100 transition-all active:scale-90">
                                            <MoreVertical size={22} />
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

export default Audits;
