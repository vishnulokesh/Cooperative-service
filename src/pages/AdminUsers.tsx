import { useState } from 'react';
import { mockAdminUsers } from '../services/mockData';
import { Search, UserCheck, UserX, Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        setNotification(`User "${u.full_name}" is now ${newStatus.toUpperCase()}`);
        setTimeout(() => setNotification(null), 3000);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          user.phone.includes(search);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">Platform Admin</span>;
      case 'cooperative_admin':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">Coop Manager</span>;
      case 'worker':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">Worker</span>;
      case 'customer':
      default:
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">Customer</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-8 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-primary z-50 flex items-center gap-3 animate-bounce">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-dark tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customers, verified workers, cooperative admins, and platform users.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-gray-700">
          <span>Total Users:</span>
          <span className="px-2 py-0.5 bg-primary text-dark rounded-md font-black">{users.length}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        {/* Role & Status dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
              <option value="cooperative_admin">Coop Manager</option>
              <option value="platform_admin">Platform Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-4">Contact Info</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No users matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark text-primary flex items-center justify-center font-bold text-base shadow-sm">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-dark">{user.full_name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">Joined {user.joined}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.city}, {user.state}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {user.role !== 'platform_admin' ? (
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto ${
                            user.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {user.status === 'active' ? (
                            <>
                              <UserX className="w-3.5 h-3.5" /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Activate
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
