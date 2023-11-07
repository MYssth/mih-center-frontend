/* eslint-disable react/prop-types */
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';

PRPOSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

function PRPOSidebar({ name, openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === 'prpodashboard' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-clipboard-check" />
            <span>หน้าหลักระบบอนุมัติออนไลน์</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/prpodashboard">
            <i className="bi bi-clipboard-check" />
            <span>หน้าหลักระบบอนุมัติออนไลน์</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'prporeport' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-clipboard-check" />
            <span>รายงาน PR/PO ที่อนุมัติแล้ว</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/prporeport">
            <i className="bi bi-clipboard-check" />
            <span>รายงาน PR/PO ที่อนุมัติแล้ว</span>
          </a>
        )}
      </li>
    </>
  );

  const renderContent = (
    <>
      {isDesktop ? (
        ''
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <a href="/intranet" className="logo d-flex align-items-center">
            <img src="assets/img/logo_sticky.png" alt="" />
          </a>
        </div>
      )}

      {/* <!-- ======= Sidebar ======= --> */}

      <ul className="sidebar-nav" id="sidebar-nav">
        {mainMenu}
        <li className="nav-item">
          <a className="nav-link collapsed" href="/intranet">
            <i className="bi bi-arrow-return-left" />
            <span>กลับไปหน้าเมนูหลัก</span>
          </a>
        </li>
      </ul>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer open variant="permanent">
          <aside id="sidebar" className="sidebar">
            {renderContent}
          </aside>
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

export default PRPOSidebar;
