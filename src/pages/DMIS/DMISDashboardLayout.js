import jwtDecode from "jwt-decode";
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from '../../layouts/dashboard/header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DMISDashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const tokenData = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < tokenData.level_list.length; i += 1) {
      if (tokenData.level_list[i].level_id === "DMIS_IT" || tokenData.level_list[i].level_id === "DMIS_MT") {
        console.log("it page");
        navigate('/dmis/itmtdashboard', { replace: true });
        break;
      }
      else if (tokenData.level_list[i].level_id === "DMIS_U1" || tokenData.level_list[i].level_id === "DMIS_U2" || tokenData.level_list[i].level_id === "DMIS_U3" || tokenData.level_list[i].level_id === "DMIS_U4") {
        console.log("user page");
        navigate('/dmis/UserDashboard', { replace: true });
        break;
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
