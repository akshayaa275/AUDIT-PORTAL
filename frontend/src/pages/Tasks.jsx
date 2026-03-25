import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    ChevronRight,
    Filter,
    Search,
    MoreVertical,
    Calendar,
    User,
    Zap,
    ArrowUpRight,
    Check,
    RotateCcw,
    Flag
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/actions');
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/actions/${taskId}`, { status: newStatus, comment: comment || `Status updated to ${newStatus}` });
            setComment('');
            fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (task.finding?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case 'Immediate': return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
            case 'High': return 'bg-orange-500 text-white shadow-lg shadow-orange-500/20';
            case 'Medium': return 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';
            case 'Low': return 'bg-blue-500 text-white shadow-lg shadow-blue-500/20';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Overdue': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Action Registry</h1>
                    <p className="text-gray-500 mt-1 text-lg font-medium">Track and resolve assigned corrective tasks.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    {['All', 'Pending', 'Completed', 'Overdue'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${statusFilter === status
                                ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                            <Search size={22} />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter tasks by summary or observation..."
                            className="w-full pl-14 pr-5 py-5 bg-white border border-gray-100 rounded-[24px] text-base font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-50 animate-pulse flex items-center space-x-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-gray-50 rounded-full w-1/3"></div>
                                        <div className="h-3 bg-gray-50 rounded-full w-2/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredTasks.length === 0 ? (
                            <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 flex flex-col items-center justify-center opacity-50">
                                <CheckCircle2 size={64} className="text-gray-200 mb-4" />
                                <p className="text-xl font-black text-gray-400 italic">Clear Skies • No Pending Actions</p>
                            </div>
                        ) : filteredTasks.map((task) => (
                            <div
                                key={task._id}
                                onClick={() => setSelectedTask(task)}
                                className={`bg-white rounded-[32px] p-8 border transition-all cursor-pointer group hover:shadow-2xl hover:-translate-y-1 ${selectedTask?._id === task._id ? 'border-primary shadow-xl ring-4 ring-primary/5' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start space-x-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-12 ${getUrgencyStyle(task.urgency)}`}>
                                            <Zap size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-black uppercase tracking-widest border ${getStatusStyle(task.status)}`}>
                                                    {task.status}
                                                </span>
                                                <span className="text-sm font-black text-gray-400 uppercase tracking-tighter flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    Due {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors">{task.title || 'Corrective Action Required'}</h3>
                                            <p className="text-base text-gray-500 font-medium line-clamp-1 italic">Observed in: {task.finding?.title || 'Unknown Finding'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-4">
                                        <button className="p-3 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                                            <ArrowUpRight size={22} />
                                        </button>
                                    </div>
                                </div>

                                {task.status === 'Pending' && (
                                    <div className="mt-8 flex items-center space-x-3 pt-6 border-t border-gray-50">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task._id, 'Completed'); }}
                                            className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                                        >
                                            <Check size={16} className="mr-2" />
                                            Mark Resolved
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                                        >
                                            Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                                    <Flag size={20} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Focus Point</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white/5 backdrop-blur-sm p-5 rounded-3xl border border-white/10">
                                    <p className="text-sm font-black text-blue-400 uppercase tracking-widest mb-1">Highest Priority</p>
                                    <p className="text-base font-bold text-gray-100 leading-relaxed">Ensure all "Immediate" urgency tasks are addressed within 24 hours.</p>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        <p className="text-3xl font-black">{tasks.filter(t => t.status === 'Pending').length}</p>
                                        <p className="text-sm font-black uppercase text-gray-500 tracking-widest">Active Tasks</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div>
                                        <p className="text-3xl font-black text-red-400">{tasks.filter(t => t.urgency === 'Immediate').length}</p>
                                        <p className="text-sm font-black uppercase text-gray-500 tracking-widest">Immediate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm min-h-[400px]">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center tracking-tight">
                            <MessageSquare size={20} className="mr-3 text-primary" />
                            Collaborate
                        </h3>

                        {selectedTask ? (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="bg-gray-50/80 p-6 rounded-[28px] border border-gray-100/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-black uppercase text-gray-400 tracking-widest">Team Matrix</p>
                                        <div className="flex -space-x-2">
                                            {['JD', 'MS', 'AK'].map((init, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-xs font-black text-primary shadow-sm">
                                                    {init}
                                                </div>
                                            ))}
                                            <div className="w-7 h-7 rounded-full bg-primary text-white border-2 border-slate-50 flex items-center justify-center text-xs font-black shadow-sm">+2</div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black uppercase text-gray-400 mb-2 mt-4 tracking-widest">Context Strategy</p>
                                    <p className="text-sm font-bold text-gray-700 leading-relaxed italic border-l-2 border-primary/20 pl-4">{selectedTask.actionPlan}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Quick Responses</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Blocked', 'In Review', 'Need Info', 'Urgent'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setComment(`${tag}: `)}
                                                className="py-2.5 px-3 bg-white border border-gray-100 rounded-xl text-sm font-black uppercase tracking-tighter text-gray-500 hover:border-primary/30 hover:text-primary transition-all hover:shadow-sm"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Engagement Log</label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-700 text-base placeholder:text-gray-300 resize-none"
                                        placeholder="Add a comment or update note..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedTask._id, selectedTask.status)}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                                    >
                                        Post Update
                                    </button>
                                </div>

                                <div className="pt-4 space-y-4">
                                    {selectedTask.comments?.map((c, i) => (
                                        <div key={i} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black">
                                                {c.user?.name?.[0] || 'U'}
                                            </div>
                                            <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm ring-1 ring-gray-100/50">
                                                <p className="text-sm font-medium text-gray-800">{c.text}</p>
                                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest mt-2">{new Date(c.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <Clock size={48} className="text-gray-200 mb-4" />
                                <p className="text-base font-black text-gray-400 uppercase tracking-widest">Select a task to sync</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
