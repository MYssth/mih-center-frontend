import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [tokenData, setTokenData] = useState([]);

    const navigate = useNavigate();
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        setTokenData(jwtDecode(token));
      
      // if(tokenData[0].level_id === "DMISIT"){
      //   navigate('/dmis', { replace: true });
      // }
    }, []);

    const handleDMIS = () => {
      console.log(tokenData);
      console.log(tokenData.level_list[0].level_id);
      for(let i=0;i<tokenData.level_list.length;i+=1){
        if(tokenData.level_list[i].level_id === "DMIS_IT"){
          navigate('/dmis/itmtindex', { replace: true });
        }
      }
    }

  return (
    <>
      <Helmet>
        <title> หน้าหลัก | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ยินดีต้อนรับเข้าสู่ระบบ MIH Center
        </Typography>

        <Button variant="contained" onClick={handleDMIS}><Icon icon="ic:baseline-settings-suggest" width="50" height="50" />ระบบแจ้งซ่อม</Button>
      </Container>
    </>
  );
}
