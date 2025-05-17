import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./contexts/ProtectedRoute";

import Login from "./view/Login/Login";
import Register from "./view/Login/Register";
import Introduction from "./view/Introduction";
import Home from "./view/user/Home";
import Admin from "./view/admin/Admin";
import BothAuth from "./view/Login/BothAuth";
import Trailer from "./components/user/outlet/Trailer";
import Typefilm from "./components/user/outlet/Typefilm";
import Banned from "./view/banned/Banned";
import PayPage from "./view/pay/PayPage";
import Account from "./components/user/profile/Account";
import Profile from "./components/user/profile/outlet/Profile";
import Index from "./components/user/profile/outlet/Index";
import Time from "./components/user/profile/outlet/Time";
import Security from "./components/user/profile/outlet/Security";
import Devices from "./components/user/profile/outlet/Devices";
import Dashbord from "./components/Admin/mainOutlet/Dashbord";
import CommentManage from "./components/Admin/mainOutlet/CommentManage";
import HistoryAdmin from "./components/Admin/mainOutlet/HistoryAdmin";
import MovieAdmin from "./components/Admin/mainOutlet/MovieAdmin";
import NotiAdmin from "./components/Admin/mainOutlet/NotiAdmin";
import PackageAdmin from "./components/Admin/mainOutlet/PackageAdmin";
import ReportAdmin from "./components/Admin/mainOutlet/ReportAdmin";
import UserAdmin from "./components/Admin/mainOutlet/UserAdmin";
import VnpayAdmin from "./components/Admin/mainOutlet/VnpayAdmin";
import ListQR from "./components/pay/ListQR";
import MainQR from "./components/pay/MainQR";
import Watchfilm from "./components/user/outlet/Watchfilm";
import SearchPage from "./components/user/outlet/SearchPage";
import Alltype from "./components/user/outlet/Alltype";
import Countrytype from "./components/user/outlet/Countrytype";
import HistoryPage from "./components/user/outlet/HistoryPage";
import Country from "./components/user/outlet/Country";
import Checktoken from "./view/Login/Checktoken";
import Token from "./view/Login/Token";
import Gettoken from "./view/Login/Gettoken";
import NewPage from "./components/user/outlet/ListFilm";
import Main from "./components/Admin/movieManage/outletMovie/Main";
import Banfilm from "./components/Admin/movieManage/outletMovie/Banfilm";
import ForgetPassword from "./view/Login/Forgetpassword";
import OTP from "./view/Login/OTP";
import ResetPassword from "./view/Login/ReserPassword";
import HomePage from "./components/home/HomePage/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import IndexHome from "./view/user/IndexHome";
import Support from "./components/home/HomePage/Support/Support";
import Like from "./components/Admin/movieManage/outletMovie/Like";
import LikePage from "./components/user/outlet/LikePage";
import ListFilm from "./components/user/outlet/ListFilm";
import ViewCount from "./components/Admin/movieManage/outletMovie/ViewCount";
import MovieReport from "./components/Admin/reportManage/outletReport/MovieReport";
import EpisodeReport from "./components/Admin/reportManage/outletReport/EpisodeReport";
import CommentReport from "./components/Admin/reportManage/outletReport/CommentReport";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/intro" index element={<HomePage />} />
            <Route path="/support" element={<Support />} />
            <Route element={<BothAuth />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/token/:token" element={<Checktoken />} />
              <Route path="/gettoken" element={<Gettoken />} />
              <Route path="/token" element={<Token />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/verify-otp" element={<OTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route
              path="/ban"
              element={
                <ProtectedRoute blockBanned={false}>
                  <Banned />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pay"
              element={
                <ProtectedRoute payOnly>
                  <PayPage />
                </ProtectedRoute>
              }
            >
              <Route index element={<ListQR />} />
              <Route path=":id" element={<MainQR />} />{" "}
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashbord />} />
              <Route path="package" element={<PackageAdmin />} />
              <Route path="history" element={<HistoryAdmin />} />
              <Route path="notification" element={<NotiAdmin />} />
              <Route path="movie" element={<MovieAdmin />}>
                <Route index element={<Navigate to="list" replace />} />
                <Route path="list" element={<Main />} />
                <Route path="banfilm" element={<Banfilm />} />
                <Route path="view" element={<ViewCount />} />
                <Route path="like" element={<Like />} />
                <Route path="watchlast" element={<Like />} />
                <Route path="watchreport" element={<Like />} />
              </Route>
              <Route path="report" element={<ReportAdmin />} >
                <Route index element={<Navigate to="movie" replace />} />
                <Route path="movie" element={<MovieReport />} />
                <Route path="episode" element={<EpisodeReport />} />
                <Route path="comment" element={<CommentReport />} />
              </Route>
              <Route path="comment" element={<CommentManage />} />
              <Route path="vnpay" element={<VnpayAdmin />} />
              <Route path="user" element={<UserAdmin />} />
            </Route>

            <Route
              path="/"
              element={
                <ProtectedRoute userOnly>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route index element={<IndexHome />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="like" element={<LikePage />} />
              <Route path="mylist" element={<SearchPage />} />
              <Route path="trailer/:movieName" element={<Trailer />} />
              <Route path="history" element={<HistoryPage />} />
              {/* <Route path="new/:page" element={<NewPage />} /> */}
              <Route path="category/list/:type/:page" element={<ListFilm />} />
              <Route path="type/:kind/:page" element={<Typefilm />} />
              <Route path="country/:slug/:page" element={<Country />} />
              <Route path="alltype" element={<Alltype />} />
              <Route path="allcontry" element={<Countrytype />} />
            </Route>
            <Route
              path="/watch/:movieName/:episodeSlug"
              element={
                <ProtectedRoute userOnly>
                  <Watchfilm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute userOnly>
                  <Account />
                </ProtectedRoute>
              }
            >
              <Route path="time" element={<Time />} />
              <Route path="security" element={<Security />} />
              <Route path="devices" element={<Devices />} />
              <Route path="profiles" element={<Profile />} />
            </Route>
            <Route path="*" element={<Introduction />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" // hoặc 'dark', 'colored'
          />
        </Router>
      </AuthProvider >
    </>
  );
}

export default App;
