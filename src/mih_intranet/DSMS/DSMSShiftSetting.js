import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Typography, Stack, TextField, styled, Button } from '@mui/material';
import MainHeader from '../components/MainHeader';
import DSMSSidebar from './components/nav/DSMSSidebar';

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
  },
});

const rToken = localStorage.getItem('token');

function DSMSBookSetting() {
  const [limitDate, setLimitDate] = useState('');
  const [open, setOpen] = useState(false);

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
        <title> ระบบจองเวรแพทย์ | MIH Center </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <DSMSSidebar name="settingshift" openNav={open} onCloseNav={() => setOpen(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>จัดการสถานะการจองเวร</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/dsmsdashboard">หน้าหลักระบบจองเวรแพทย์</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการสถานะการจองเวร</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default DSMSBookSetting;
