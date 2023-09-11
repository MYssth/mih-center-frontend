/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';
import '../../css/index.css';

IIOSSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

function IIOSSidebar({ name, openNav, onCloseNav, notiTrigger }) {
  // let noti;
  const [noti, setNoti] = useState('');

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [tokenData, setTokenData] = useState([]);

  const [tokenViewData, setTokenViewData] = useState([]);

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));
    // setTokenData(token);

    notiTrigger = '';
    refreshNoti();

    setTokenData(token.lv_list.find((o) => o.mihapp_id === 'DMIS').lv_id);
    setTokenViewData(token.lv_list.find((o) => o.mihapp_id === 'DMIS').view_id);

    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    refreshNoti();
  }, [notiTrigger]);

  function refreshNoti() {
    const token = jwtDecode(localStorage.getItem('token'));
    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getnoti/${token.psn_id}/${
        token.lv_list.find((o) => o.mihapp_id === 'DMIS').lv_id
      }/${token.lv_list.find((o) => o.mihapp_id === 'DMIS').view_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // noti = data;
        setNoti(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === 'userdashboard' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-tools" />
            <span>หน้าหลักระบบแจ้งปัญหา</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/iiosuserdashboard">
            <i className="bi bi-tools" />
            <span>หน้าหลักระบบแจ้งปัญหา</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        {name === 'newcase' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-file-earmark-arrow-up" />
            <span>แจ้งปัญหาออนไลน์</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/iiosnewcase">
            <i className="bi bi-file-earmark-arrow-up" />
            <span>แจ้งปัญหาออนไลน์</span>
          </a>
        )}
      </li>
    </>
  );

  const ITMTDashboard = (
    <li className="nav-item">
      {name === 'itmtdashboard' ? (
        <a className="nav-link" href="#">
          <i className="bi bi-wrench-adjustable-circle" />
          <span>งานที่ได้รับ</span>
        </a>
      ) : (
        <a className="nav-link collapsed" href="/iiositmtdashboard">
          <i className="bi bi-wrench-adjustable-circle" />
          <span>งานที่ได้รับ</span>
        </a>
      )}
    </li>
  );

  const permitDashboard = (
    <li className="nav-item">
      {name === 'permit' ? (
        <a className="nav-link" href="#">
          <i className="bi bi-list-check" />
          <span>งานรอตรวจสอบ</span>
          &nbsp;
          {noti?.permit ? (
            <div className="circle" style={{ background: 'red', color: 'white' }}>
              {noti.permit}
            </div>
          ) : (
            ''
          )}
        </a>
      ) : (
        <a className="nav-link collapsed" href="/iiospermit">
          <i className="bi bi-list-check" />
          <span>งานรอตรวจสอบ</span>
          &nbsp;
          {noti?.permit ? (
            <div className="circle" style={{ background: 'red', color: 'white' }}>
              {noti.permit}
            </div>
          ) : (
            ''
          )}
        </a>
      )}
    </li>
  );

  const usrPermitDashboard = (
    <li className="nav-item">
      {name === 'usrpermit' ? (
        <a className="nav-link" href="#">
          <i className="bi bi-clipboard-check" />
          <span>งานรออนุมัติแก้ไขโปรแกรม</span>
          &nbsp;
          {noti?.usrPermit ? (
            <div className="circle" style={{ background: 'red', color: 'white' }}>
              {noti.usrPermit}
            </div>
          ) : (
            ''
          )}
        </a>
      ) : (
        <a className="nav-link collapsed" href="/iiosusrpermit">
          <i className="bi bi-clipboard-check" />
          <span>งานรออนุมัติแก้ไขโปรแกรม</span>
          &nbsp;
          {noti?.usrPermit ? (
            <div className="circle" style={{ background: 'red', color: 'white' }}>
              {noti.usrPermit}
            </div>
          ) : (
            ''
          )}
        </a>
      )}
    </li>
  );

  const defaultMenu = (
    <>
      <li className="nav-item">
        {name === 'informertask' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-person-exclamation" />
            <span>งานที่ต้องดำเนินการเอง</span>
            &nbsp;
            {noti?.informerTask ? (
              <div className="circle" style={{ background: 'red', color: 'white' }}>
                {noti.informerTask}
              </div>
            ) : (
              ''
            )}
          </a>
        ) : (
          <a className="nav-link collapsed" href="/iiosinformertask">
            <i className="bi bi-person-exclamation" />
            <span>งานที่ต้องดำเนินการเอง</span>
            &nbsp;
            {noti?.informerTask ? (
              <div className="circle" style={{ background: 'red', color: 'white' }}>
                {noti.informerTask}
              </div>
            ) : (
              ''
            )}
          </a>
        )}
      </li>

      <li className="nav-item">
        {name === 'audit' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-person-check" />
            <span>งานรอตรวจรับ</span>
            &nbsp;
            {noti?.audit ? (
              <div className="circle" style={{ background: 'red', color: 'white' }}>
                {noti.audit}
              </div>
            ) : (
              ''
            )}
          </a>
        ) : (
          <a className="nav-link collapsed" href="/iiosaudit">
            <i className="bi bi-person-check" />
            <span>งานรอตรวจรับ</span>
            &nbsp;
            {noti?.audit ? (
              <div className="circle" style={{ background: 'red', color: 'white' }}>
                {noti.audit}
              </div>
            ) : (
              ''
            )}
          </a>
        )}
      </li>

      <li className="nav-item">
        {name === 'report' ? (
          <a className="nav-link" href="#">
            <i className="bi bi-files" />
            <span>รายงาน</span>
          </a>
        ) : (
          <a className="nav-link collapsed" href="/iiosreport">
            <i className="bi bi-files" />
            <span>รายงาน</span>
          </a>
        )}
      </li>
      <li className="nav-item">
        <a className="nav-link collapsed" href="/intranet">
          <i className="bi bi-arrow-return-left" />
          <span>กลับไปหน้าเมนูหลัก</span>
        </a>
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
        {tokenData === 'DMIS_IT' ||
        tokenData === 'DMIS_MT' ||
        tokenData === 'DMIS_MER' ||
        tokenData === 'DMIS_ENV' ||
        tokenData === 'DMIS_HIT' ||
        tokenData === 'DMIS_ALL' ? (
          <>
            {ITMTDashboard}
            {tokenData === 'DMIS_ENV' || tokenData === 'DMIS_HIT' || tokenData === 'DMIS_ALL' ? (
              <>{permitDashboard}</>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
        {tokenViewData === 'HEMP' || tokenViewData === 'MGR' || tokenViewData === 'HMGR' || tokenViewData === 'ALL' ? (
          <>{usrPermitDashboard}</>
        ) : (
          ''
        )}
        {defaultMenu}
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

export default IIOSSidebar;
