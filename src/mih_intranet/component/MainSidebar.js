import React from 'react'

function MainSidebar() {

    return (
        <>
            {/* <!-- ======= Sidebar ======= --> */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="intranet">
                            <i className="bi bi-house" />
                            <span>หน้าหลัก</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/dmis">
                            <i className="bi bi-tools" />
                            <span>ระบบแจ้งปัญหา/แจ้งซ่อม</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-people" />
                            <span>ระบบขอใช้ห้องประชุม</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/cbsdashboard">
                            <i className="bi bi-car-front" />
                            <span>ระบบขอใช้รถ</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-graph-up" />
                            <span>ระบบบริหารความเสี่ยง</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#">
                            <i className="bi bi-book" />
                            <span>ระบบการจัดการความรู้</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/dsms">
                            <i className="bi bi-calendar3" />
                            <span>ระบบตารางการทำงานแพทย์</span>
                        </a>
                    </li>
                    <li className="nav-heading">เอกสารเผยแพร่</li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="mihdocuments/announce.html">
                            <i className="bi bi-bookmark" />
                            <span>ใบสื่อสารองค์กร</span>
                        </a>
                    </li>

                    <li className="nav-heading">Download</li>
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-target="#hims-manual-nav"
                            data-bs-toggle="collapse"
                            href="#"
                        >
                            <i className="bi bi-journal-text" />
                            <span>คู่มือการใช้งานระบบ HIMS</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </a>
                        <ul
                            id="hims-manual-nav"
                            className="nav-content collapse"
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <a href="#">
                                    <i className="bi bi-circle" /><span>Front Office</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="bi bi-circle" /><span>Back Office</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-target="#form-nav"
                            data-bs-toggle="collapse"
                            href="#"
                        >
                            <i className="bi bi-file-pdf" /><span>แบบฟอร์ม</span
                            ><i className="bi bi-chevron-down ms-auto" />
                        </a>
                        <ul
                            id="form-nav"
                            className="nav-content collapse"
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <a href="#">
                                    <i className="bi bi-circle" /><span>ฝ่ายเทคโนโลยีสารสนเทศ</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="bi bi-circle" /><span>ฝ่ายการพยาบาล</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i className="bi bi-circle" /><span>ฝ่ายเทคนิคบริการ</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default MainSidebar