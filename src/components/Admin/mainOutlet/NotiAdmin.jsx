import React, { useState } from 'react';
import './NotiAdmin.scss';

const NotiAdmin = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bảo trì hệ thống', content: 'Hệ thống sẽ bảo trì lúc 22h.', date: '2025-05-19' },
    { id: 2, title: 'Cập nhật tính năng', content: 'Thêm chức năng.....', date: '2025-05-18' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNoti, setNewNoti] = useState({ title: '', content: '' });

  const handleAddNotification = () => {
    if (!newNoti.title || !newNoti.content) return;
    const newItem = {
      id: Date.now(),
      title: newNoti.title,
      content: newNoti.content,
      date: new Date().toISOString().split('T')[0]
    };
    setNotifications([newItem, ...notifications]);
    setNewNoti({ title: '', content: '' });
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotis = notifications.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='noti-wrapper'>
      <h2>Quản lý Thông báo</h2>

      <div className='noti-actions'>
        <input
          type='text'
          placeholder='Tìm kiếm tiêu đề...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='noti-form'>
        <input
          type='text'
          placeholder='Tiêu đề thông báo'
          value={newNoti.title}
          onChange={(e) => setNewNoti({ ...newNoti, title: e.target.value })}
        />
        <textarea
          placeholder='Nội dung thông báo'
          value={newNoti.content}
          onChange={(e) => setNewNoti({ ...newNoti, content: e.target.value })}
        />
        <button onClick={handleAddNotification}>Thêm thông báo</button>
      </div>

      <div className='noti-list'>
        {filteredNotis.length > 0 ? (
          filteredNotis.map(noti => (
            <div className='noti-item' key={noti.id}>
              <div className='noti-header'>
                <h4>{noti.title}</h4>
                <span>{noti.date}</span>
              </div>
              <p>{noti.content}</p>
              <button onClick={() => handleDelete(noti.id)}>Xóa</button>
              <button onClick={() => handleDelete(noti.id)}>Sửa</button>
            </div>
          ))
        ) : (
          <p>Không có thông báo nào.</p>
        )}
      </div>
    </div>
  );
};

export default NotiAdmin;
