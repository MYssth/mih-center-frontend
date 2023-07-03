import jwtDecode from "jwt-decode";
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../../hooks/useResponsive';

CBSSidebar.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

export default function CBSSidebar({ name, openNav, onCloseNav }) {
    const { pathname } = useLocation();

    const isDesktop = useResponsive('up', 'lg');

    const [tokenData, setTokenData] = useState([]);

    useEffect(() => {

        const token = jwtDecode(localStorage.getItem('token'));
        // setTokenData(token);

        setTokenData(token.level_list.find(
            o => o.mihapp_id === "CBS").level_id);

        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const mainMenu = (
        <>
            <li className="nav-item">
                <a className="nav-link collapsed" href="intranet">
                    <i className="bi bi-house" />
                    <span>หน้าหลัก</span>
                </a>
            </li>
            <li className="nav-item">
                {name === "dashboard" ?
                    <a className="nav-link" href="#">
                        <i className="bi bi-car-front" />
                        <span>หน้าหลักระบบขอใช้รถ</span>
                    </a>
                    :
                    <a className="nav-link collapsed" href="/cbsdashboard">
                        <i className="bi bi-car-front" />
                        <span>หน้าหลักระบบขอใช้รถ</span>
                    </a>
                }
            </li>
            <li className="nav-item">
                {name === "booking" ?
                    <a className="nav-link" href="#">
                        <i className="bi bi-chat-left-text" />
                        <span>ขอใช้รถ</span>
                    </a>
                    :
                    <a className="nav-link collapsed" href="/cbsbooking">
                        <i className="bi bi-chat-left-text" />
                        <span>ขอใช้รถ</span>
                    </a>
                }
            </li>
        </>
    );

    const permitReq = (
        <li className="nav-item">
            {name === "permitReq" ?
                <a className="nav-link" href="#">
                    <i className="bi bi-journal-text" />
                    <span>จัดการคำขอ</span>
                </a>
                :
                <a className="nav-link collapsed" href="/cbspermitreq">
                    <i className="bi bi-journal-text" />
                    <span>จัดการคำขอ</span>
                </a>
            }
        </li>
    );

    const permit = (
        <li className="nav-item">
            {name === "permit" ?
                <a className="nav-link" href="#">
                    <i className="bi bi-journal-check" />
                    <span>อนุมัติคำขอ</span>
                </a>
                :
                <a className="nav-link collapsed" href="/cbspermit">
                    <i className="bi bi-journal-check" />
                    <span>อนุมัติคำขอ</span>
                </a>
            }
        </li>
    );

    const useRec = (
        <li className="nav-item">

            {name === "userec" ?
                <a className="nav-link" href="#">
                    <i className="bi bi-pencil-square" />
                    <span>บันทึกการใช้รถ</span>
                </a>
                :
                <a className="nav-link collapsed" href="/cbsuserec">
                    <i className="bi bi-pencil-square" />
                    <span>บันทึกการใช้รถ</span>
                </a>
            }
        </li>
    );

    const bookRprt = (
        <li className="nav-item">
            {name === "bookrprt" ?
                <a className="nav-link" href="#">
                    <i className="bi bi-bar-chart" />
                    <span>รายงานการใช้รถ</span>
                </a>
                :
                <a className="nav-link collapsed" href="/cbsbookrprt">
                    {/* <a className="nav-link collapsed" href="#"> */}
                    <i className="bi bi-bar-chart" />
                    <span>รายงานการใช้รถ</span>
                </a>
            }
        </li>
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
                {tokenData === "CBS_ADMIN" || tokenData === "CBS_MGR" || tokenData === "CBS_RCV" || tokenData === "CBS_DRV" ?
                    <>
                        {tokenData === "CBS_ADMIN" || tokenData === "CBS_MGR" || tokenData === "CBS_RCV" ?
                            <>
                                {permitReq}
                                {tokenData === "CBS_ADMIN" || tokenData === "CBS_MGR" ?
                                    <>
                                        {permit}
                                    </>
                                    : ""
                                }
                            </>
                            :
                            ""}
                    </>
                    :
                    ""}
                {useRec}

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-folder-plus" />
                        <span>การจัดการข้อมูลรถยนต์ (WIP)</span>
                    </a>
                </li>
                <li className="nav-heading">การเติมน้ำมันเชื้อเพลิง</li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-fuel-pump" />
                        <span>บันทึกการเติมน้ำมัน (WIP)</span>
                    </a>
                </li>
                <li className="nav-heading">การซ่อมบำรุง</li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-chat-left-text" />
                        <span>ขออนุมัติซ่อมบำรุง (Coming soon)</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-journal-check" />
                        <span>อนุมัติซ่อมบำรุง (Coming soon)</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-pencil-square" />
                        <span>บันทึกผลการซ่อมบำรุง (Coming soon)</span>
                    </a>
                </li>
                <li className="nav-heading">รายงาน</li>
                {bookRprt}
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-bar-chart" />
                        <span>รายงานการซ่อมบำรุง (Coming soon)</span>
                    </a>
                </li>
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