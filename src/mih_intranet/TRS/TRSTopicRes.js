/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Button, Typography, styled, alpha, Radio } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import TRSSidebar from './components/nav/TRSSidebar';
import TRSAttdSubmtDialg from './components/dialg/TRSAttdSubmtDialg';
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

let psnId;
let disBtn = true;

function TRSTopicRes() {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(25);

  const [attd, setAttd] = useState([]);
  const [isAttd, setIsAttd] = useState('');
  const [topicList, setTopicList] = useState([]);
  const [subTopicList, setSubTopicList] = useState([]);
  const [subTopicFilter, setSubTopicFilter] = useState([]);
  const [focusTopic, setFocusTopic] = useState('');
  const [selTopicRes, setSelTopicRes] = useState('');
  const [selTopicName, setSelTopicName] = useState('');
  const [selSubTopicRes, setSelSubTopicRes] = useState('');

  const [openAttd, setOpenAttd] = useState(false);

  const rToken = localStorage.getItem('token');

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

  const topicSubListCol = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 50,
      minWidth: 50,
      renderCell: (params) => <Radio disabled={isAttd} checked={selSubTopicRes === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      maxWidth: 50,
      minWidth: 50,
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
      headerName: 'ชื่อเรื่อง',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'attd',
      headerName: 'จำนวนผู้ร่วมกิจกรรม',
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
      valueGetter: (params) => `${params.row.attd ?? 0}/${params.row.lmt}`,
    },
  ];

  useEffect(() => {
    psnId = jwtDecode(localStorage.getItem('token')).psn_id;
    refreshTable();
  }, []);

  useEffect(() => {
    disBtn = false;
  }, [selSubTopicRes]);

  const refreshTable = () => {
    setSelTopicRes('');
    setSelTopicName('');
    setSelSubTopicRes('');
    setSubTopicFilter([]);
    setIsAttd('');

    disBtn = true;

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

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getsubtopiclist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubTopicList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getattd/${psnId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttd(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title> ลงทะเบียนร่วมกิจกรรม | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <TRSSidebar name="trstopicres" openNav={open} onCloseNav={() => setOpen(false)} />
      <TRSAttdSubmtDialg
        openDialg={openAttd}
        onCloseDialg={() => {
          refreshTable();
          setOpenAttd(false);
        }}
        topic={focusTopic}
        psnId={psnId}
        rToken={rToken}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>ลงทะเบียนร่วมกิจกรรม</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/trsdashboard">หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</a>
              </li>
              <li className="breadcrumb-item my-2">ลงทะเบียนร่วมกิจกรรม</li>
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
                          disBtn = true;
                          // setIsAttd(attd?.find((data) => data.topic_id === newSelectionModel[0]));
                          setSelTopicRes(newSelectionModel[0]);
                          // setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                          // setSubTopicFilter(subTopicList.filter((data) => data.topic_id === newSelectionModel[0]));

                          // =====temp=====
                          const minDate = attd?.find((data) => data.topic_id === 'TRS000002');
                          if (newSelectionModel[0] === 'TRS000003') {
                            const isPreReq = attd.find((data) => data.topic_id === 'TRS000002');
                            if (isPreReq) {
                              setIsAttd(attd?.find((data) => data.topic_id === newSelectionModel[0]));
                              setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                              setSubTopicFilter(
                                subTopicList.filter(
                                  (data) =>
                                    data.topic_id === newSelectionModel[0] && data.start_date >= minDate.start_date
                                )
                              );
                            } else {
                              setIsAttd(attd?.find((data) => data.topic_id === newSelectionModel[0]));
                              setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                              setSubTopicFilter('');
                            }
                          } else {
                            setIsAttd(attd?.find((data) => data.topic_id === newSelectionModel[0]));
                            setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                            setSubTopicFilter(subTopicList.filter((data) => data.topic_id === newSelectionModel[0]));
                          }
                          // =====end of temp=====
                        }}
                        hideFooterSelectedRowCount
                        componentsProps={{
                          toolbar: {
                            printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                    เลือกรุ่นของหัวข้อกิจกรรม {selTopicName}
                  </Typography>
                  <div className="attd">{isAttd ? `คุณได้ลงชื่อกิจกรรมที่ ${isAttd?.name} แล้ว` : ''}</div>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={topicSubListCol}
                        rows={subTopicFilter}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        selectionModel={selTopicRes}
                        onSelectionModelChange={(newSelectionModel) => {
                          if (!isAttd && selTopicName !== '' && selTopicName !== undefined) {
                            setSelSubTopicRes(newSelectionModel[0]);
                          }
                        }}
                        hideFooterSelectedRowCount
                        componentsProps={{
                          toolbar: {
                            printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={disBtn}
                    onClick={() => {
                      setFocusTopic(subTopicFilter.find((data) => data.sub_id === selSubTopicRes));
                      setOpenAttd(true);
                    }}
                  >
                    ลงทะเบียนร่วมกิจกรรม
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TRSTopicRes;
