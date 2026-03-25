import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  AlertCircle,
  CheckSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Auditor', 'Employee'] },
    { name: 'Audits', path: '/audits', icon: ClipboardList, roles: ['Admin', 'Auditor'] },
    { name: 'Findings', path: '/findings', icon: AlertCircle, roles: ['Admin', 'Auditor'] },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, roles: ['Admin', 'Auditor', 'Employee'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['Admin'] },
    { name: 'Reports', path: '/reports', icon: FileText, roles: ['Admin', 'Auditor'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user?.role));

  return (
    <div className="bg-[#0f172a] text-slate-300 w-64 min-h-screen flex flex-col shadow-2xl transition-all duration-300">
      <div className="p-8 text-2xl font-black tracking-tight text-white flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <span>AuditPortal</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `group flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 ${isActive
                ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <link.icon className={`transition-colors duration-200 ${'group-hover:text-primary-light'
              }`} size={20} />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700/50">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">User</p>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-base font-bold text-white truncate">{user?.name}</p>
              <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3.5 w-full hover:bg-red-500/10 rounded-xl transition-all duration-200 text-red-400 group hover:text-red-300 font-medium"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
