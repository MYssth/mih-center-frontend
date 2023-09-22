/* eslint-disable react/prop-types */
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';

TRSSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

function TRSSidebar({ name, openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));
    // setTokenData(token);

    // setTokenData(token ? token.lv_list.find((o) => o.mihapp_id === 'TRS').lv_id : '');

    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === 'trsdashboard' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-calendar3" />
            <span>หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/trsdashboard">
            <i className="bi bi-calendar3" />
            <span>หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'trstopicres' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-chat-left-text" />
            <span>ลงทะเบียนร่วมกิจกรรม</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/trstopicres">
            <i className="bi bi-chat-left-text" />
            <span>ลงทะเบียนร่วมกิจกรรม</span>
          </a>
        )}
      </li>
    </>
  );

  const adminMenu = (
    <>
      <li className="nav-item">
        {name === 'trstopicmgr' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-journal-text" />
            <span>จัดการหัวข้อกิจกรรม</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/trstopicmgr">
            <i className="bi bi-journal-text" />
            <span>จัดการหัวข้อกิจกรรม</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'trsattdmgr' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-journal-text" />
            <span>จัดการผู้เข้าร่วมกิจกรรม</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/trsattdmgr">
            <i className="bi bi-journal-text" />
            <span>จัดการผู้เข้าร่วมกิจกรรม</span>
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
        {tokenData === 'TRS_ADMIN' ? <>{adminMenu}</> : ''}
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

export default TRSSidebar;
