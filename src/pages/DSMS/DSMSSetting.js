import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Container, Typography, Card, Stack, TextField, Box, styled, Button } from '@mui/material';

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
  },
});

const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

export default function DSMSSetting() {
  const [limitDate, setLimitDate] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getsetting`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.limit_date);
        setLimitDate(data.limit_date);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleEdit = () => {
    if (limitDate === '') {
      alert('กรุณาระบุวันที่สิ้นสุดการจองเวร (1-31)');
      return;
    }

    const jsonData = {
      limit_date: limitDate,
    };

    // console.log(`limit_date: ${jsonData.limit_date}`);
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/updatesetting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          window.location.reload(false);
        } else {
          alert('ไม่สามารถแก้ไขวันที่สิ้นสุดการจองเวรได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขวันที่สิ้นสุดการจองเวร');
      });
  };

  return (
    <>
      <Helmet>
        <title> ระบบจองเวรแพทย์ | {headSname} </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
        </Typography>
        <Card>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
              จัดการสถานะการจองเวร
            </Typography>
            <ValidationTextField
              id="limitDate"
              name="limitDate"
              value={limitDate}
              onChange={(event) => {
                setLimitDate(event.target.value);
              }}
              label="กำหนดวันที่สิ้นสุดการจองเวร"
            />
            <Button variant="contained" onClick={handleEdit}>
              แก้ไขข้อมูล
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
