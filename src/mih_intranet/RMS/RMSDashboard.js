import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Typography, styled, alpha } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import RMSSidebar from './components/nav/RMSSidebar';

let rToken = '';

function RMSDashboard() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_rmsPort}/getversion`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVersion(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> ระบบลงทะเบียนร่วมกิจกรรม | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <RMSSidebar name="rmsdashboard" openNav={open} onCloseNav={() => setOpen(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>ระบบลงทะเบียนร่วมกิจกรรม - Activity Register Service (ARS) version: {version}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                    รายการกิจกรรมที่ได้ลงทะเบียนไว้
                  </Typography>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>ssss</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default RMSDashboard;
