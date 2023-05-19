import React from 'react'

function CBSSidebar(props) {
    return (
        <>
            {/* <!-- ======= Sidebar ======= --> */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="intranet">
                            <i className="bi bi-house" />
                            <span>หน้าหลัก</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        {props.name === "dashboard" ?
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
                        {props.name === "booking" ?
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
            </aside>
        </>
    )
}

export default CBSSidebar