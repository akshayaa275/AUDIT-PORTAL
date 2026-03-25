import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronRight,
    MessageSquare,
    FileText,
    X,
    ShieldAlert,
    Zap,
    Lightbulb,
    ArrowRight
} from 'lucide-react';
import api from '../services/api';

const Findings = () => {
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'Medium',
        audit: '',
        impact: '',
        recommendation: ''
    });

    const [audits, setAudits] = useState([]);

    useEffect(() => {
        fetchFindings();
        fetchAudits();
    }, []);

    const fetchFindings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/findings');
            setFindings(data);
        } catch (err) {
            console.error('Error fetching findings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAudits = async () => {
        try {
            const { data } = await api.get('/audits');
            setAudits(data.filter(a => a.status === 'In-Progress' || a.status === 'Planned'));
        } catch (err) {
            console.error('Error fetching audits:', err);
        }
    };

    const handleCreateFinding = async (e) => {
        e.preventDefault();
        try {
            await api.post('/findings', formData);
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                severity: 'Medium',
                audit: '',
                impact: '',
                recommendation: ''
            });
            fetchFindings();
        } catch (err) {
            console.error('Error creating finding:', err);
            alert('Failed to report finding. Please check your inputs.');
        }
    };

    const filteredFindings = findings.filter(finding => {
        const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            finding.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'All' || finding.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Audit Findings</h1>
                    <p className="text-gray-500 mt-1 text-lg">Detailed observations and non-compliance records.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
                >
                    <Plus className="mr-2" size={20} />
                    Report Finding
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search findings by keyword..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${severityFilter === sev
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {sev}
                        </button>
                    ))}
                </div>
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                    <ShieldAlert size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Log New Observation</h3>
                                    <p className="text-base text-gray-500">Record a finding discovered during an active audit.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-gray-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFinding} className="p-8 overflow-y-auto flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Finding Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium"
                                            placeholder="e.g., Lack of Multi-factor Authentication"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Related Audit</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium appearance-none"
                                            value={formData.audit}
                                            onChange={(e) => setFormData({ ...formData, audit: e.target.value })}
                                        >
                                            <option value="">Select Audit Cycle</option>
                                            {audits.map(a => (
                                                <option key={a._id} value={a._id}>{a.title} ({a.department})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Severity Level</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Critical', 'High', 'Medium', 'Low'].map(sev => (
                                                <button
                                                    key={sev}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, severity: sev })}
                                                    className={`py-2 rounded-xl text-sm font-black uppercase tracking-wider border transition-all ${formData.severity === sev
                                                        ? (sev === 'Critical' ? 'bg-red-50 border-red-200 text-red-600' : sev === 'High' ? 'bg-orange-50 border-orange-200 text-orange-600' : sev === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-200 text-blue-600')
                                                        : 'bg-white border-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    {sev}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1 flex items-center">
                                    <FileText size={14} className="mr-1.5" />
                                    Detailed Description
                                </label>
                                <textarea
                                    rows="3"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium resize-none text-gray-700"
                                    placeholder="What specifically was observed?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1 flex items-center">
                                        <Zap size={14} className="mr-1.5" />
                                        Impact Analysis
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium resize-none text-gray-700"
                                        placeholder="Potential consequences of this finding..."
                                        value={formData.impact}
                                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1 flex items-center">
                                        <Lightbulb size={14} className="mr-1.5" />
                                        Recommendation
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-medium resize-none text-gray-700"
                                        placeholder="Steps to remediate this issue..."
                                        value={formData.recommendation}
                                        onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end space-x-4 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
                                >
                                    Post Finding
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="bg-white p-20 rounded-3xl border border-gray-100 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="font-bold uppercase tracking-widest text-sm text-gray-400">Loading Observation Feed...</p>
                    </div>
                ) : filteredFindings.length === 0 ? (
                    <div className="bg-white p-20 rounded-3xl border border-gray-100 flex flex-col items-center">
                        <ShieldAlert size={64} className="text-gray-200 mb-4" />
                        <p className="text-xl font-bold text-gray-400">No active findings recorded</p>
                    </div>
                ) : filteredFindings.map((finding) => (
                    <div key={finding._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-widest border ${getSeverityStyle(finding.severity)}`}>
                                            {finding.severity}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-widest border ${finding.status === 'Open' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {finding.status}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{finding.title}</h3>
                                        <p className="text-gray-600 mt-2 leading-relaxed">{finding.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        {finding.impact && (
                                            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
                                                <div className="flex items-center text-red-600 mb-2">
                                                    <Zap size={16} className="mr-2" />
                                                    <span className="text-sm font-black uppercase tracking-widest">Potential Impact</span>
                                                </div>
                                                <p className="text-base text-gray-700 leading-relaxed font-medium italic">{finding.impact}</p>
                                            </div>
                                        )}
                                        {finding.recommendation && (
                                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
                                                <div className="flex items-center text-green-600 mb-2">
                                                    <Lightbulb size={16} className="mr-2" />
                                                    <span className="text-sm font-black uppercase tracking-widest">Recommended Actions</span>
                                                </div>
                                                <p className="text-base text-gray-700 leading-relaxed font-medium italic">{finding.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-64 space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 self-stretch">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-black uppercase text-gray-400 tracking-widest">Audit Title</p>
                                            <FileText size={14} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 line-clamp-2">{finding.audit?.title || 'Unknown Audit'}</p>
                                        <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-400">{finding.evidence?.length || 0} Evidence Files</span>
                                            <ArrowRight size={14} className="text-primary hover:translate-x-1 transition-transform cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center text-gray-400 group/item cursor-pointer">
                                    <MessageSquare size={16} className="mr-2 group-hover/item:text-primary transition-colors" />
                                    <span className="text-sm font-bold group-hover/item:text-gray-900 transition-colors">4 Comments</span>
                                </div>
                                <div className="flex items-center text-gray-400 group/item cursor-pointer">
                                    <Clock size={16} className="mr-2 group-hover/item:text-primary transition-colors" />
                                    <span className="text-sm font-bold group-hover/item:text-gray-900 transition-colors">Posted {new Date(finding.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button className="text-primary text-sm font-black uppercase tracking-widest hover:underline flex items-center">
                                Review Details <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Findings;
