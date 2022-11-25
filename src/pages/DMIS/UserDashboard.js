import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ITMTDashboard() {
  const theme = useTheme();
  const [tokenData, setTokenData] = useState([]);

    const navigate = useNavigate();
  
    useEffect(() => {

      const token = localStorage.getItem('token');
      setTokenData(jwtDecode(token));
      console.log(tokenData);

    }, []);



  return (
    <>
      <Helmet>
        <title> หน้าหลัก | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ยินดีต้อนรับเข้าสู่ระบบ MIH Center คุณ{tokenData.personnel_name} (หน้าสำหรับ User)
        </Typography>
        
      </Container>
    </>
  );
}
