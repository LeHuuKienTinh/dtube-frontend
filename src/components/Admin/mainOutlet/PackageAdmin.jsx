import React, { useEffect, useState } from "react";
import axiosInstance from "../../../service/axiosInstance";
import './PackageAdmin.scss'; // nếu có dùng SCSS
import { toast } from 'react-toastify';

const PackageAdmin = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    id: "",
    ten_pakage: "",
    gia_truoc_khi_giam: "",
    gia_chinh: "",
    kieu_thoi_gian: "", // Lưu trữ lựa chọn của kiểu thời gian
  });
  const [isEdit, setIsEdit] = useState(false);

  // Fetch all packages when component mounts
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("/api/pakage/"); // Call to get all packages
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      ten_pakage,
      gia_truoc_khi_giam,
      gia_chinh,
      kieu_thoi_gian,
    } = form;

    // Ép kiểu thành số để so sánh
    const giaGoc = parseFloat(gia_truoc_khi_giam);
    const giaChinh = parseFloat(gia_chinh);
    const thoiGian = kieu_thoi_gian;

    // Kiểm tra hợp lệ
    if (!ten_pakage.trim()) {
      toast.error("Tên gói không được để trống.");
      return;
    }
    if (isNaN(giaGoc) || giaGoc <= 0) {
      toast.error("Giá trước khi giảm phải là số > 0.");
      return;
    }
    if (isNaN(giaChinh) || giaChinh <= 0) {
      toast.error("Giá chính phải là số > 0.");
      return;
    }
    if (giaChinh >= giaGoc) {
      toast.error("Giá chính phải nhỏ hơn giá trước khi giảm.");
      return;
    }
    if (!thoiGian) {
      toast.error("Vui lòng chọn kiểu thời gian.");
      return;
    }
    const tenTrung = packages.some(
      (pkg) =>
        pkg.ten_pakage.trim().toLowerCase() === ten_pakage.trim().toLowerCase() &&
        (!isEdit || pkg.id !== form.id) // Nếu đang sửa, bỏ qua gói đang sửa
    );
    if (tenTrung) {
      toast.error("Tên gói không được trùng.");
      return;
    }

    // Nếu hợp lệ thì tiếp tục gửi lên server
    try {
      if (isEdit) {
        await axiosInstance.put(`/api/pakage/update/put/${form.id}`, form);
      } else {
        await axiosInstance.post("/api/pakage/create", form);
      }
      setForm({
        id: "",
        ten_pakage: "",
        gia_truoc_khi_giam: "",
        gia_chinh: "",
        kieu_thoi_gian: "",
      });
      setIsEdit(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axiosInstance.delete(`/api/pakage/delete/${id}`);
        fetchPackages(); // Re-fetch after delete
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="package-admin">
      <h2>Quản lý Gói Dịch Vụ</h2>

      <form onSubmit={handleSubmit} className="package-form">
        <input name="ten_pakage" value={form.ten_pakage} onChange={handleChange} placeholder="Tên gói" />
        <input name="gia_truoc_khi_giam" value={form.gia_truoc_khi_giam} onChange={handleChange} placeholder="Giá trước khi giảm" />
        <input name="gia_chinh" value={form.gia_chinh} onChange={handleChange} placeholder="Giá chính" />

        {/* Chọn kiểu thời gian */}
        <select
          name="kieu_thoi_gian"
          value={form.kieu_thoi_gian}
          onChange={handleChange}
          className="select-time"
          placeholder="Chọn kiểu thời gian"
        >s
          <option className="option-time" value="">Chọn kiểu thời gian</option>
          <option value="1">1 Tháng</option>
          <option value="3">3 Tháng</option>
          <option value="6">6 Tháng</option>
          <option value="9">9 Tháng</option>
          <option value="12">1 Năm</option>
        </select>

        <button type="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</button>
        {isEdit && <button onClick={() => { setForm({ id: "", ten_pakage: "", gia_truoc_khi_giam: "", gia_chinh: "", kieu_thoi_gian: "" }); setIsEdit(false); }}>Hủy</button>}
      </form>

      <table className="package-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên gói</th>
            <th>Giá gốc</th>
            <th>Giá chính</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.ten_pakage}</td>
              <td>{parseFloat(item.gia_truoc_khi_giam).toLocaleString()} VND</td>
              <td>{parseFloat(item.gia_chinh).toLocaleString()} VND</td>
              <td>{item.kieu_thoi_gian} tháng</td>
              <td>
                <button onClick={() => handleEdit(item)}>Sửa</button>
                <button onClick={() => handleDelete(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageAdmin;
