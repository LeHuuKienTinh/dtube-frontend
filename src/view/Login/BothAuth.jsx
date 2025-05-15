import { Outlet } from "react-router-dom";
import FooterHomePage from "../../components/home/HomePage/FooterHomePage/FooterHomePage";
import './BothAuth.scss';

const BothAuth = () => {
  return (
    <>
      <div className="background-container">
        <div className="navbar">
          <div className="navbar-container">
            <a className="navbar-brand" href="/">DTube</a>
          </div>
        </div>

        <div className="outlet-content">
          <Outlet />
        </div>
      </div>

      <div className="footer">
        <FooterHomePage />
      </div>
    </>
  );
};

export default BothAuth;
