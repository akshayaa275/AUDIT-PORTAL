import React from 'react';
import { Bell, User, Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, text: 'New audit assigned to you', time: '2 mins ago', unread: true },
    { id: 2, text: 'Security finding has been resolved', time: '1 hour ago', unread: true },
    { id: 3, text: 'Annual report is ready to download', time: '5 hours ago', unread: false },
  ];

  return (
    <div className="bg-white h-16 border-b flex items-center justify-between px-8 shadow-sm relative z-50">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search audits, findings, tasks..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl transition-all mr-2" title="Settings">
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
              }`}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white ring-2 ring-white">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <span className="text-sm font-black uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded">2 New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${n.unread ? 'border-primary bg-blue-50/30' : 'border-transparent'}`}>
                      <p className={`text-base ${n.unread ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                      <p className="text-sm text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-50 text-center">
                  <button className="text-sm font-bold text-primary hover:underline py-1">Mark all as read</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm font-black uppercase text-secondary tracking-wider">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
