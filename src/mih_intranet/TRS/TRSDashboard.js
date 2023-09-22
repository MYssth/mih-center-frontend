/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Typography, styled, alpha } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import TRSSidebar from './components/nav/TRSSidebar';
import './css/index.css';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

const headSname = `MIH Center`;
let psnId;

function TRSDashboard() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [pageSize, setPageSize] = useState(25);

  const [attdList, setAttdList] = useState('');

  const rToken = localStorage.getItem('token');

  const columns = [
    {
      field: 'topic_id',
      headerName: 'เลขที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'sub_id',
      headerName: 'รุ่น',
      maxWidth: 60,
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'วันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
    },
    {
      field: 'start_time',
      headerName: 'จากเวลา',
      maxWidth: 70,
      minWidth: 70,
      flex: 1,
      valueGetter: (params) =>
        `${String(new Date(params.row.start_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.start_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'end_time',
      headerName: 'ถึงเวลา',
      maxWidth: 70,
      minWidth: 70,
      flex: 1,
      valueGetter: (params) =>
        `${String(new Date(params.row.end_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.end_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'name',
      headerName: 'เรื่อง',
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => `${params.row.topic_name} ${params.row.name}`,
    },
  ];

  useEffect(() => {
    psnId = jwtDecode(localStorage.getItem('token')).psn_id;

    refreshTable();

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getversion`, {
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
  }, []);

  const refreshTable = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getattd/${psnId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttdList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title> ระบบลงทะเบียนร่วมกิจกรรม | {headSname} </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <TRSSidebar name="trsdashboard" openNav={open} onCloseNav={() => setOpen(false)} />

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
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowId={(row) => row.topic_id}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={columns}
                        rows={attdList}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        componentsProps={{
                          toolbar: {
                            printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
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

export default TRSDashboard;
