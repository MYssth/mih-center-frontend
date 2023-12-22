import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Typography, styled, alpha } from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
// components
import MainHeader from '../components/MainHeader';
import MainSidebar from '../components/nav/MainSidebar';
import { ErrMsgDialg, SubmtComp } from '../components/dialogs/response';

let rToken = '';

function WIFIDashboard() {
  const [open, setOpen] = useState(null);
  const [version, setVersion] = useState('');
  const [cVoucher, setCVoucher] = useState(0);
  const [file, setFile] = useState({});
  const [fileSel, setFileSel] = useState(false);

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [openCompMsg, setOpenCompMsg] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_wifiPort}/getversion`, {
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

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_wifiPort}/cvoucher`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCVoucher(data.voucher);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  const handleSelectFile = (e) => {
    if (e.target.files[0] !== undefined) {
      setFileSel(true);
    } else {
      setFileSel(false);
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('userWiFi', file);
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_wifiPort}/insusr`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setOpenCompMsg(true);
        } else {
          setErrMsg(`เนื่องจาก ${data.message}`);
          setOpenErrMsg(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrMsg(`เนื่องจาก ${error}`);
        setOpenErrMsg(true);
      });
  };

  return (
    <>
      <ErrMsgDialg
        openDialg={openErrMsg}
        onCloseDialg={() => {
          setErrMsg('');
          setOpenErrMsg(false);
        }}
        msg={errMsg}
        header={'ไม่สามารถเพิ่ม User Wi-Fi ได้'}
      />

      <SubmtComp
        openDialg={openCompMsg}
        onCloseDialg={() => {
          setOpenCompMsg(false);
        }}
      />

      <Helmet>
        <title> จัดการ User Wi-Fi | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <MainSidebar name="wifidashboard" openNav={open} onCloseNav={() => setOpen(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>ระบบจัดการ User Wi-Fi version: {version}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการ User Wi-Fi</li>
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
                    เพิ่ม User Wi-Fi (ไฟล์ Excel เช่น .xlsx หรือ .xls เท่านั้น)
                  </Typography>

                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      จำนวน Voucher ที่เหลือ : {cVoucher}<br/>
                      <input type="file" onChange={handleSelectFile} />
                      <Button
                        onClick={() => {
                          handleSubmit();
                        }}
                        className="btn btn-success"
                        disabled={!fileSel}
                      >
                        เพิ่ม User Wi-Fi
                      </Button>
                    </div>
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

export default WIFIDashboard;
