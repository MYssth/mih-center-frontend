import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography, Button } from '@mui/material';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const navigate = useNavigate();

  const handleDMIS = () => {
    navigate('/dmis', { replace: true });
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
