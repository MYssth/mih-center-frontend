import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Drawer } from '@mui/material';

import useResponsive from '../../../hooks/useResponsive';

CBSSidebar.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

const NAV_WIDTH = 280;

export default function CBSSidebar({ name, openNav, onCloseNav }) {
    const { pathname } = useLocation();

    const isDesktop = useResponsive('up', 'lg');

    useEffect(() => {

        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <>

            {isDesktop ?
                ""
                :
                <div className="d-flex align-items-center justify-content-between">
                    <a href="/dashboard" className="logo d-flex align-items-center">
                        <img src="assets/img/logo_sticky.png" alt="" />
                    </a>
                </div>
            }

            {/* <!-- ======= Sidebar ======= --> */}
            
                <ul className="sidebar-nav" id="sidebar-nav">
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
                                <i className="bi bi-graph-up" />
                                <span>ขอใช้รถ</span>
                            </a>
                            :
                            <a className="nav-link collapsed" href="/cbsbooking">
                                <i className="bi bi-graph-up" />
                                <span>ขอใช้รถ</span>
                            </a>
                        }
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-book" />
                            <span>อนุมัติขอใช้รถ</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-calendar3" />
                            <span>บันทึกการใช้รถ</span>
                        </a>
                    </li>
                    <li className="nav-heading">การซ่อมบำรุง</li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-bookmark" />
                            <span>ขออนุมัติซ่อมบำรุง</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-bookmark" />
                            <span>อนุมัติซ่อมบำรุง</span>
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