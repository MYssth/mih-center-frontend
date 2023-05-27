import React from 'react'
import { Icon } from '@iconify/react';
import { IconButton, AppBar, Toolbar, } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { bgBlur } from '../../utils/cssStyles';

MainHeader.propTypes = {
    onOpenNav: PropTypes.func,
};

// const NAV_WIDTH = 280;

// const HEADER_MOBILE = 64;

// const HEADER_DESKTOP = 92;

// const StyledRoot = styled(AppBar)(({ theme }) => ({
//     ...bgBlur({ color: theme.palette.background.default }),
//     boxShadow: 'none',
//     [theme.breakpoints.up('lg')]: {
//         width: `calc(100% - ${NAV_WIDTH + 1}px)`,
//     },
// }));

// const StyledToolbar = styled(Toolbar)(({ theme }) => ({
//     minHeight: HEADER_MOBILE,
//     [theme.breakpoints.up('lg')]: {
//         minHeight: HEADER_DESKTOP,
//         padding: theme.spacing(0, 5),
//     },
// }));

export default function MainHeader({ onOpenNav }) {
    return (
        <>
            {/*  <StyledRoot>
             <StyledToolbar> */}

            {/* <!-- ======= Heade ======= --> */}
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <a href="/dashboard" className="logo d-flex align-items-center">
                        <img src="assets/img/logo_sticky.png" alt="" />
                    </a>
                    {/* <i className="bi bi-list toggle-sidebar-btn" /> */}
                    <IconButton
                        onClick={onOpenNav}
                        sx={{
                            mr: 1,
                            color: 'text.primary',
                            display: { lg: 'none' },
                        }}
                    >
                        <Icon icon="eva:menu-2-fill" />
                    </IconButton>
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

            {/* </StyledToolbar>
        </StyledRoot> */}
        </>
    )
}