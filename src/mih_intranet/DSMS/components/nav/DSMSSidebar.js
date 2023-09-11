/* eslint-disable react/prop-types */
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';

DSMSSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

function DSMSSidebar({ name, openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));
    // setTokenData(token);

    setTokenData(token.lv_list.find((o) => o.mihapp_id === 'DSMS').lv_id);

    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === 'main' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-table" />
            <span>หน้าหลักระบบจองเวรแพทย์</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/dsmsdashboard">
            <i className="bi bi-table" />
            <span>หน้าหลักระบบจองเวรแพทย์</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'book' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-calendar-plus" />
            <span>จองเวร</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/dsmsbook">
            <i className="bi bi-calendar-plus" />
            <span>จองเวร</span>
          </a>
        )}
      </li>
    </>
  );

  const admin = (
    <>
      <li className="nav-item">
        {name === 'settingshift' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-calendar-week" />
            <span>จัดการสถานะการจองเวร</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/dsmssetting">
            <i className="bi bi-calendar-week" />
            <span>จัดการสถานะการจองเวร</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'editshift' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-tools" />
            <span>แก้ไขเวร</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/dsmsedit">
            <i className="bi bi-tools" />
            <span>แก้ไขเวร</span>
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
        {tokenData === 'DSMS_ADMIN' ? <>{admin}</> : ''}
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

export default DSMSSidebar;
