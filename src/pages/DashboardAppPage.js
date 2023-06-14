import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
// ----------------------------------------------------------------------

const headSname = `${localStorage.getItem('sname')} Center`;

export default function DashboardAppPage() {



  const navigate = useNavigate();
  const [showDMIS, setShowDMIS] = useState(false);
  const [showDSMS, setShowDSMS] = useState(false);


  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    if (token !== null) {
      for (let i = 0; i < token.level_list.length; i += 1) {
        if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT"
          || token.level_list[i].level_id === "DMIS_MER" || token.level_list[i].level_id === "DMIS_ENV"
          || token.level_list[i].level_id === "DMIS_HIT" || token.level_list[i].level_id === "DMIS_ALL"
          || token.level_list[i].level_id === "DMIS_USER") {
          setShowDMIS(!showDMIS);
        }
        else if (token.level_list[i].level_id === "DSMS_ADMIN" || token.level_list[i].level_id === "DSMS_USER") {
          setShowDSMS(!showDSMS);
        }
      }
    }

  }, []);

  const handleDMIS = () => {
    navigate('/dmis', { replace: true });
  }

  const handleDSMS = () => {
    navigate('/dsms', { replace: true });
  }

  const handleIntranet = () => {
    navigate('/intranet', { replace: true });
  }

  return (
    <>
      <Helmet>
        <title> หน้าหลัก | {headSname} </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ยินดีต้อนรับเข้าสู่ระบบ {headSname}
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3, }} columns={{ xs: 4, sm: 8, md: 12 }} >
          {/* <Grid container spacing={1}> */}
          {showDMIS ? (
            <>
              <Grid item xs={4}>
                <Button variant="contained" onClick={handleDMIS}> <Icon icon="ic:baseline-settings-suggest" width="50" height="50" />ระบบแจ้งปัญหาออนไลน์</Button>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {showDSMS ? (
            <>
              <Grid item xs={4}>
                <Button variant="contained" onClick={handleDSMS}><Icon icon="fa6-solid:user-doctor" width="50" height="50" />ระบบจองเวรแพทย์</Button>
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleIntranet}><Icon icon="material-symbols:fiber-new-outline" width="50" height="50" />หน้าระบบภายในใหม่</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
