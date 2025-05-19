import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../service/axiosInstance';
import './CommentManage.scss';
import { toast } from 'react-toastify';

const CommentManage = () => {
  const [badWords, setBadWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [editingWordId, setEditingWordId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Fetch all bad words
  const fetchBadWords = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/badwords');
      setBadWords(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách từ cấm:', error);
    }
  };

  // Add new word
  const addBadWord = async () => {
    if (!newWord.trim()) return;
    try {
      await axiosInstance.post('/api/admin/badwords', { word: newWord });
      setNewWord('');
      fetchBadWords();
      toast.success("Thêm từ cấm thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra!")

    }
  };

  // Delete word
  const deleteBadWord = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/badwords/${id}`);
      fetchBadWords();
      toast.success("Xóa từ cấm thành công!")
    } catch (error) {
      console.error('Lỗi khi xóa từ cấm:', error);
    }
  };

  // Update word
  const updateBadWord = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axiosInstance.put(`/api/admin/badwords/${id}`, { word: editValue });
      setEditingWordId(null);
      setEditValue('');
      fetchBadWords();
      toast.success("Sửa từ cấm thành công!")
    } catch (error) {
      console.error('Lỗi khi cập nhật từ cấm:', error);
    }
  };

  useEffect(() => {
    fetchBadWords();
  }, []);

  return (
    <div className="comment-manage-wrapper">
      <h2 className='title-comment-manage'>Quản lý Bình luận</h2>
      <div className='control-wrapper'>
        <h2 className="comment-manage-title">Danh sách từ cấm</h2>

        <div className="add-word">
          <input
            className="input-badword"
            type="text"
            placeholder="Nhập từ cần cấm..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
          <button className="add-word-btn" onClick={addBadWord}>Thêm</button>
        </div>

        <table className="table-bad-word">
          <tbody>
            {badWords.length > 0 ? (
              badWords.map((item, index) => (
                <tr key={item.id} >
                  <td className='text-start'>
                    {editingWordId === item.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      item.word
                    )}
                  </td>
                  <td className='text-end'>
                    {editingWordId === item.id ? (
                      <>
                        <button className='me-2' onClick={() => updateBadWord(item.id)}>Lưu</button>
                        <button className='me-2' onClick={() => setEditingWordId(null)}>Hủy</button>
                      </>
                    ) : (
                      <>
                        <button className='me-2' onClick={() => {
                          setEditingWordId(item.id);
                          setEditValue(item.word);
                        }}>
                          Sửa
                        </button>
                        <button onClick={() => deleteBadWord(item.id)}>Xoá</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="3">Không có từ cấm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentManage;
