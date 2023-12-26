import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  Stack,
} from '@mui/material';
// import './css/index.css';

function DISProdView() {
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get('id').toLocaleUpperCase();

  const [data, setData] = useState('');
  const [inactive, setInactive] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getdruginfo/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.inactive) {
          setData(data);
          setInactive(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title> ข้อมูลยา {id} | MIH Center </title>
      </Helmet>
      <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
        <Grid item xs={5} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Box width={'100%'} sx={{ ml: 1 }}>
            <center>
              <img src="assets/img/logo white border-01.png" width={'80%'} alt="" style={{ maxWidth: '300px' }} />
              <div className="pagetitle" style={{ color: '#1771ab' }}>
                <h1 style={{ fontSize: '2.6em' }}>ข้อมูลยา</h1>
              </div>
            </center>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="subtitle1" align="right" sx={{ mr: 2 }}>
            {data.id}
          </Typography>
          <Box sx={{ backgroundColor: '#b6d9bf', p: 1, mr: 1, borderRadius: 1 }}>
            <center>
              <img
                src={
                  inactive ? '' : `${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getdrugimg/${data.id}`
                }
                width={'100%'}
                height={'auto'}
                style={{ maxHeight: '500px', maxWidth: '500px', minHeight: '150px' }}
                alt="ไม่พบรูปภาพ"
              />
            </center>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ ml: 1, mr: 1, p: 1, borderRadius: 1, backgroundColor: '#b6d9bf' }}>
            <Typography>
              <b>ยา :</b> {data.name_en}
            </Typography>
            <Typography>
              <b>ชื่อไทย :</b> {data.name_th}
            </Typography>
            <Typography>
              <b>วิธีใช้ :</b> {data.inst}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, ml: 1, mr: 1, p: 1, borderRadius: 1, backgroundColor: '#e3bbb1' }}>
            <Typography>
              <b style={{ color: '#1771ab' }}>รายละเอียดยา :</b> {data.propty}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, ml: 1, mr: 1, p: 1, borderRadius: 1, backgroundColor: '#b1d1e3' }}>
            <Typography>
              <b style={{ color: '#ed2d2d' }}>ข้อควรระวัง :</b> {data.warn}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default DISProdView;
