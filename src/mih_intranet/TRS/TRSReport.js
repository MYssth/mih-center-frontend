import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Button, Typography, styled, alpha, Radio } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import TRSSidebar from './components/nav/TRSSidebar';
import TRSPsnListExcel from './components/excelgen/TRSPsnListExcel';

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

function TRSReport() {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(25);

  const [topicList, setTopicList] = useState([]);
  const [attdList, setAttdList] = useState([]);
  const [selTopicRes, setSelTopicRes] = useState('');

  let rToken = '';

  const topicListCol = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 50,
      minWidth: 50,
      renderCell: (params) => <Radio checked={selTopicRes === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      maxWidth: 120,
      minWidth: 120,
      flex: 1,
    },
    // {
    //   field: 'start_date',
    //   headerName: 'วันเวลา',
    //   maxWidth: 200,
    //   minWidth: 200,
    //   flex: 1,
    // },
    {
      field: 'name',
      headerName: 'ชื่อเรื่อง',
      minWidth: 200,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      refreshTable();
    }
  }, []);

  async function refreshTable() {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/gettopiclist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTopicList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getattdpsn`, {
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
  }

  return (
    <>
      <Helmet>
        <title> รายงาน | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <TRSSidebar name="trsreport" openNav={open} onCloseNav={() => setOpen(false)} />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>รายงาน</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/trsdashboard">หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</a>
              </li>
              <li className="breadcrumb-item my-2">รายงาน</li>
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
                    เลือกหัวข้อกิจกรรม
                  </Typography>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={topicListCol}
                        rows={topicList}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        selectionModel={selTopicRes}
                        onSelectionModelChange={(newSelectionModel) => {
                          //   disBtn = true;
                          // setIsAttd(attd?.find((data) => data.topic_id === newSelectionModel[0]));
                          setSelTopicRes(newSelectionModel[0]);
                          // setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                          // setSubTopicFilter(subTopicList.filter((data) => data.topic_id === newSelectionModel[0]));
                        }}
                        hideFooterSelectedRowCount
                        componentsProps={{
                          toolbar: {
                            printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={selTopicRes === '' || selTopicRes === undefined}
                        onClick={() => {
                          TRSPsnListExcel(
                            attdList.filter((data) => data.topic_id === selTopicRes),
                            selTopicRes,
                            rToken
                          );
                          //   setFocusTopic(subTopicFilter.find((data) => data.sub_id === selSubTopicRes));
                          //   setOpenAttd(true);
                        }}
                      >
                        ดาวน์โหลดรายชื่อผู้เข้าร่วมกิจกรรม
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

export default TRSReport;
