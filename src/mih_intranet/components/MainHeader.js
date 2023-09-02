import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

MainHeader.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function MainHeader({ onOpenNav }) {
  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      setTokenData(jwtDecode(token));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // navigate('/login', { replace: true });
  };

  return (
    <>
      {/* <!-- ======= Head ======= --> */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="/intranet" className="logo d-flex align-items-center">
            <img src="assets/img/logo_sticky.png" alt="" />
          </a>
          {/* <i className="bi bi-list toggle-sidebar-btn" /> */}
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: 'text.primary',
              display: { lg: 'none' },
            }}
          >
            <Icon icon="eva:menu-2-fill" />
          </IconButton>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              version: {process.env.REACT_APP_version ? `${process.env.REACT_APP_version}` : `Unknown`}
            </Typography>
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <img className="rounded-circle" src="assets/img/user profile.webp" alt="User Profile" />
                <span className="d-none d-md-block dropdown-toggle ps-2">{tokenData.psn_name}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{tokenData.psn_name}</h6>
                  <span>Coming soon.</span>
                  {/* <span>Information Technology Dep.</span> */}
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-person" />
                    <span>My Profile (Coming soon)</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    // href="/dashboard/profilesetting"
                  >
                    <i className="bi bi-gear" />
                    <span>Account Settings (Coming soon)</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="/login" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" />
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
