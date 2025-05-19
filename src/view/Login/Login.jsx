import "./Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from 'react-toastify';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      const type = user.type;
      if (type == "1") navigate("/admin/dashboard");
      else if (type == "2") navigate("/");
      else if (type == "3") navigate("/pay");
      else if (type == "4") navigate("/ban");
      else navigate("/intro");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.warning("Vui lòng điền đầy đủ thông tin")
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(credentials);

      if (result.success) {
        const user = result.user;

        const type = user.type;
        // Chuyển hướng người dùng theo loại
        if (type === "1") { toast.success("Xin chào! ADMIN"); navigate("/admin/dashboard"); }
        else if (type === "2") { toast.success("Đăng nhập thành công"); navigate("/"); }
        else if (type === "3") { toast.warning("Vui lòng chọn gói để tiếp tục"); navigate("/pay"); }
        else if (type === "4") navigate("/ban");
        else navigate("/intro");
      } else {
        toast.error("Username hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else if (err.message === "Network Error") {
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-box">
          <h2 className="title">Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                placeholder="Nhập username của bạn..."
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            {/* ✅ Hiển thị lỗi nếu có */}
            {error && (
              <div className="error-box">
                <p className="error-text">{error}</p>
              </div>
            )}

            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="divider">HOẶC</div>
            <button
              type="button"
              className="code-login-btn"
              onClick={() => navigate("/gettoken")}
            >
              Sử dụng mã đăng nhập
            </button>
            <a href="/forgot-password" className="forgot-password">
              Bạn quên mật khẩu?
            </a>
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ghi nhớ tôi</label>
            </div>
            <p className="register">
              Bạn mới sử dụng DTube? |{" "}
              <NavLink to="/register">Đăng ký ngay.</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
