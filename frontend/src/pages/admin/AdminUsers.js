import React, { useEffect, useState } from 'react';
import { FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete user'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Users</h1>
          <p>{users.length} registered users</p>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-card">
          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="admin-user-avatar">
                            {user.role === 'admin' ? <FiShield size={16} /> : <FiUser size={16} />}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <span className="admin-status" style={{
                          color: user.role === 'admin' ? '#8e44ad' : '#2980b9',
                          background: user.role === 'admin' ? '#8e44ad18' : '#2980b918',
                          textTransform: 'capitalize',
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {user.role !== 'admin' && (
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(user._id, user.name)}>
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
