import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../service/axiosInstance';
import './UserAdmin.scss';

const API_URL = 'api/admin/users';

const typeMap = {
  '1': 'Admin',
  '2': 'Đang dùng',
  '3': 'Hết hạn',
  '4': 'Bị cấm',
};

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [deviceCounts, setDeviceCounts] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '2',
    expiry_time: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axiosInstance.get(API_URL)
      .then(res => {
        setUsers(res.data.users);
        fetchDeviceCounts(res.data.users);
      })
      .catch(err => console.error(err));
  };

  const fetchDeviceCounts = async (usersList) => {
    const counts = {};
    await Promise.all(usersList.map(async (user) => {
      try {
        const res = await axiosInstance.get(`/api/device/${user.id}`);
        counts[user.id] = res.data.count || 0;
      } catch (err) {
        console.error(`Lỗi khi lấy thiết bị cho user ${user.id}:`, err);
        counts[user.id] = 0;
      }
    }));
    setDeviceCounts(counts);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openEditModal = (user) => {
    setForm({
      name: user.name,
      email: user.mail,
      type: user.type,
      expiry_time: user.expiry_time ? user.expiry_time.slice(0, 16) : ''
    });
    setEditingUser(user);
    setShowModal(true);
    console.log(user)

  };
  useEffect(() => {
    console.log("showModal changed to:", showModal);
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: '', email: '', type: '2', expiry_time: '' });
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      axiosInstance.put(`${API_URL}/${editingUser.id}`, {
        ...form,
        mail: form.email
      })
        .then(() => {
          fetchUsers();
          closeModal();
        })
        .catch(err => console.error('Lỗi khi cập nhật người dùng:', err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      axiosInstance.delete(`${API_URL}/${id}`)
        .then(() => fetchUsers())
        .catch(err => console.error('Lỗi khi xóa người dùng:', err));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.mail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-admin-container">
      <h2>Quản lý Tài khoản người dùng</h2>

      <input
        type="text"
        placeholder="Tìm kiếm tên hoặc email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th className='text-center'>STT</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Loại</th>
              <th>Hết hạn</th>
              <th>Thiết bị</th>
              <th className='text-center'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="7">Không tìm thấy người dùng nào.</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className='text-center'>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.mail}</td>
                  <td>{typeMap[user.type]}</td>
                  <td>{user.expiry_time ? new Date(user.expiry_time).toLocaleString() : 'Không có'}</td>
                  <td className='text-center'>{deviceCounts[user.id] ?? '...'}/6</td>
                  <td >
                    <button className="edit-btn" onClick={() => openEditModal(user)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
          <div className="modal-user">
            <h2>Cập nhật người dùng</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Tên người dùng"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled
              />
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="1">Admin</option>
                <option value="2">Người dùng</option>
                <option value="3">Hết hạn</option>
                <option value="4">Bị cấm</option>
              </select>
              <input
                type="datetime-local"
                name="expiry_time"
                placeholder="Thời gian hết hạn"
                value={form.expiry_time}
                onChange={handleChange}
              />
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Hủy</button>
                <button type="submit">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
