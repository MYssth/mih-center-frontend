/* eslint-disable react/prop-types */
import jwtDecode from "jwt-decode";
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';

IIOSSidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

function IIOSSidebar({ name, openNav, onCloseNav }) {

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [tokenData, setTokenData] = useState([]);

  const [tokenViewData, setTokenViewData] = useState([]);

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));
    // setTokenData(token);

    setTokenData(token.level_list.find(o => o.mihapp_id === "DMIS").level_id);
    setTokenViewData(token.level_list.find(o => o.mihapp_id === "DMIS").view_id);

    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const mainMenu = (
    <>
      <li className="nav-item">
        {name === "userdashboard" ?
          <a className="nav-link" href="#">
            <i className="bi bi-tools" />
            <span>หน้าหลักระบบแจ้งปัญหา</span>
          </a>
          :
          <a className="nav-link collapsed" href="/iiosuserdashboard">
            <i className="bi bi-tools" />
            <span>หน้าหลักระบบแจ้งปัญหา</span>
          </a>}
      </li>
      <li className="nav-item">
        {name === "newcase" ?
          <a className="nav-link" href="#">
            <i className="bi bi-file-earmark-arrow-up" />
            <span>แจ้งปัญหาออนไลน์</span>
          </a>
          :
          <a className="nav-link collapsed" href="/iiosnewcase">
            <i className="bi bi-file-earmark-arrow-up" />
            <span>แจ้งปัญหาออนไลน์</span>
          </a>}

      </li>
    </>
  );

  const ITMTDashboard = (
    <li className="nav-item">
      {name === "itmtdashboard" ?
        <a className="nav-link" href="#">
          <i className="bi bi-wrench-adjustable-circle" />
          <span>งานที่ได้รับ</span>
        </a>
        :
        <a className="nav-link collapsed" href="/iiositmtdashboard">
          <i className="bi bi-wrench-adjustable-circle" />
          <span>งานที่ได้รับ</span>
        </a>}
    </li>
  );

  const permitDashboard = (
    <li className="nav-item">
      {name === "permit" ?
        <a className="nav-link" href="#">
          <i className="bi bi-list-check" />
          <span>งานรอตรวจสอบ</span>
        </a>
        :
        <a className="nav-link collapsed" href="/iiospermit">
          <i className="bi bi-list-check" />
          <span>งานรอตรวจสอบ</span>
        </a>}
    </li>
  );

  const usrPermitDashboard = (
    <li className="nav-item">
      {name === "usrpermit" ?
        <a className="nav-link" href="#">
          <i className="bi bi-clipboard-check" />
          <span>งานรออนุมัติแก้ไขโปรแกรม</span>
        </a>
        :
        <a className="nav-link collapsed" href="/iiosusrpermit">
          <i className="bi bi-clipboard-check" />
          <span>งานรออนุมัติแก้ไขโปรแกรม</span>
        </a>}
    </li>
  );

  const defaultMenu = (
    <>
      <li className="nav-item">
        {name === "informertask" ?
          <a className="nav-link" href="#">
            <i className="bi bi-person-exclamation" />
            <span>งานที่ต้องดำเนินการเอง</span>
          </a>
          :
          <a className="nav-link collapsed" href="/iiosinformertask">
            <i className="bi bi-person-exclamation" />
            <span>งานที่ต้องดำเนินการเอง</span>
          </a>}
      </li>

      <li className="nav-item">
        {name === "audit" ?
          <a className="nav-link" href="#">
            <i className="bi bi-person-check" />
            <span>งานรอตรวจรับ</span>
          </a>
          :
          <a className="nav-link collapsed" href="/iiosaudit">
            <i className="bi bi-person-check" />
            <span>งานรอตรวจรับ</span>
          </a>}
      </li>

      <li className="nav-item">
        {name === "report" ?
          <a className="nav-link" href="#">
            <i className="bi bi-files" />
            <span>รายงาน</span>
          </a>
          :
          <a className="nav-link collapsed" href="/iiosreport">
            <i className="bi bi-files" />
            <span>รายงาน</span>
          </a>}
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
      {isDesktop ?
        ""
        :
        <div className="d-flex align-items-center justify-content-between">
          <a href="/intranet" className="logo d-flex align-items-center">
            <img src="assets/img/logo_sticky.png" alt="" />
          </a>
        </div>
      }

      {/* <!-- ======= Sidebar ======= --> */}
      <ul className="sidebar-nav" id="sidebar-nav">

        {mainMenu}
        {tokenData === "DMIS_IT" || tokenData === "DMIS_MT" || tokenData === "DMIS_MER" ||
          tokenData === "DMIS_ENV" || tokenData === "DMIS_HIT" || tokenData === "DMIS_ALL" ?
          <>
            {ITMTDashboard}
            {tokenData === "DMIS_ENV" || tokenData === "DMIS_HIT" || tokenData === "DMIS_ALL" ?
              <>{permitDashboard}</>
              :
              ""}
          </>
          :
          ""
        }
        {tokenViewData === "VDMIS_DPMH" || tokenViewData === "VDMIS_FAC" || tokenViewData === "VDMIS_FLD" || tokenViewData === "VDMIS_ALL" ?
          <>
            {usrPermitDashboard}
          </>
          :
          ""
        }
        {defaultMenu}
      </ul>

    </>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
        >
          <aside id="sidebar" className="sidebar">
            {renderContent}
          </aside>
        </Drawer >
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
      )
      }
    </>
  )
}

export default IIOSSidebar