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
      setTokenData(token.lv_list.find((o) => o.mihapp_id === 'RMS').lv_id);

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
}