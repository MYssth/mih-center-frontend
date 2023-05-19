import React from 'react'

function MainHeader() {
    return (
        <>
            {/* <!-- ======= Heade ======= --> */}
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <a href="/dashboard" className="logo d-flex align-items-center">
                        <img src="assets/img/logo_sticky.png" alt="" />
                    </a>
                    <i className="bi bi-list toggle-sidebar-btn" />
                </div>
                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item dropdown pe-3">
                            <a
                                className="nav-link nav-profile d-flex align-items-center pe-0"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    className="rounded-circle"
                                    src="assets/img/user profile.webp"
                                    alt="User Profile"
                                />
                                <span className="d-none d-md-block dropdown-toggle ps-2"
                                >Karnanan Purimanuruk</span
                                >
                            </a>
                            <ul
                                className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
                            >
                                <li className="dropdown-header">
                                    <h6>Karnanan Purimanuruk</h6>
                                    <span>Information Technology Dep.</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item d-flex align-items-center"
                                        href="users-profile.html"
                                    >
                                        <i className="bi bi-person" />
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item d-flex align-items-center"
                                        href="users-profile.html"
                                    >
                                        <i className="bi bi-gear" />
                                        <span>Account Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <i className="bi bi-box-arrow-right" />
                                        <span>Sign Out</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default MainHeader