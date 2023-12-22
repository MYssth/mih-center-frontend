/* eslint-disable react/prop-types */
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';
// import '../../css/index.css';

RMSSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

export default function RMSSidebar({ name, openNav, onCloseNav, notiTrigger }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      const token = jwtDecode(localStorage.getItem('token'));
      setTokenData(token ? token.lv_list.find((o) => o.mihapp_id === 'RMS')?.lv_id : '');

      if (openNav) {
        onCloseNav();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === 'dashboard' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-car-front" />
            <span>หน้าหลักระบบจัดการความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmsdashboard">
            <i className="bi bi-car-front" />
            <span>หน้าหลักระบบจัดการความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'newtask' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-chat-left-text" />
            <span>บันทึกความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmsnewtask">
            <i className="bi bi-chat-left-text" />
            <span>บันทึกความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'taskhistory' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-chat-left-text" />
            <span>ประวัติการบันทึกความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmstaskhistory">
            <i className="bi bi-chat-left-text" />
            <span>ประวัติการบันทึกความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'taskreview' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-chat-left-text" />
            <span>ทบทวนความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmstaskreview">
            <i className="bi bi-chat-left-text" />
            <span>ทบทวนความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'tasklist' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-chat-left-text" />
            <span>รายการความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmstasklist">
            <i className="bi bi-chat-left-text" />
            <span>รายการความเสี่ยง</span>
          </a>
        )}
      </li>
    </>
  );

  const refMenu = (
    <>
      <li className="nav-item">
        {name === 'rmsexam' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-person-gear" />
            <span>วิเคราะห์ความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmsexam">
            <i className="bi bi-person-gear" />
            <span>วิเคราะห์ความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'rmscnsdr' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-person-gear" />
            <span>พิจารณาความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmscnsdr">
            <i className="bi bi-person-gear" />
            <span>พิจารณาความเสี่ยง</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'rmsest' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-person-gear" />
            <span>ประเมินความเสี่ยง</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/rmsest">
            <i className="bi bi-person-gear" />
            <span>ประเมินความเสี่ยง</span>
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
        {tokenData === 'RMS_REF' ? <>{refMenu}</> : ''}
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
