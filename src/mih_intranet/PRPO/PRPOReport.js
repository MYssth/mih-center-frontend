import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography, styled, alpha, Button, TextField, Divider, Box, Stack } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import MainHeader from '../components/MainHeader';
import PRPOSidebar from './compenents/nav/PRPOSidebar';
import PRRprtDialg from './compenents/dialogs/PRRprtDialg';
import PORprtDialg from './compenents/dialogs/PORprtDialg';
import { ErrMsgDialg } from '../components/dialogs/response';
import './css/index.css';

const moment = require('moment');
const dateFns = require('date-fns');

moment.locale('th');

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

let rToken = '';
let hideAll = setTimeout(() => {}, 0);
let usrReqList = {};

function PRPOReport() {
  const [open, setOpen] = useState(false);
  const [PRHeadList, setPRHeadList] = useState([]);
  const [POHeadList, setPOHeadList] = useState([]);
  const [filterPRHeadList, setFilterPRHeadList] = useState([]);
  const [filterPOHeadList, setFilterPOHeadList] = useState([]);

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [openPRData, setOpenPRData] = useState(false);
  const [PRHeader, setPRHeader] = useState('');
  const [PRDetail, setPRDetail] = useState([]);

  const [openPOData, setOpenPOData] = useState(false);
  const [POHeader, setPOHeader] = useState('');
  const [PODeatail, setPODetail] = useState([]);

  const [usrReqTmp, setUserReqTmp] = useState('');
  const [usrReq, setUsrReq] = useState('');
  const [isShow, setIsShow] = useState(false);

  const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState(dateFns.format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(new Date());

  const PRColumns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 110,
      minWidth: 110,

      renderCell: (params) => {
        const handleBttn = () => {
          setPRHeader(params.row);
          setOpenPRData(true);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            ดูข้อมูล
          </Button>
        );
      },
    },
    {
      field: 'RQONO',
      headerName: 'เลขที่เอกสาร',
      maxWidth: 110,
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'DIVNAM',
      headerName: 'แผนกที่ขอซื้อ',
      //   maxWidth: 100,
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'NETAMT',
      headerName: 'ราคาสุทธิ',
      //   maxWidth: 100,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.NETAMT.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
    {
      field: 'REMARK',
      headerName: 'หมายเหตุ',
      //   maxWidth: 100,
      minWidth: 200,
      flex: 1,
    },
  ];

  const POColumns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 110,
      minWidth: 110,

      renderCell: (params) => {
        const handleBttn = () => {
          setPOHeader(params.row);
          setOpenPOData(true);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            ดูข้อมูล
          </Button>
        );
      },

      // renderCell: (params) => <button className="btn btn-danger" onClick={}>ลบ</button>,
    },
    {
      field: 'PONO',
      headerName: 'เลขที่เอกสาร',
      maxWidth: 110,
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'DIVNAM',
      headerName: 'แผนกที่ขอซื้อ',
      //   maxWidth: 100,
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'NETAMT',
      headerName: 'ราคาสุทธิ',
      //   maxWidth: 100,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.NETAMT.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
    {
      field: 'STATUS_PO',
      headerName: 'สถานะ',
      //   maxWidth: 100,
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'REMARK',
      headerName: 'หมายเหตุ',
      //   maxWidth: 100,
      minWidth: 200,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
    }
  }, []);

  const handlePRPOQry = () => {
    setIsShow(true);
    // console.log(usrReq);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_himsPort}/getusrreqlist/${usrReq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        usrReqList = data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getprdetail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPRDetail(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getpodetail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPODetail(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getcompprheader/${usrReq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPRHeadList(data);
        setFilterPRHeadList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getcomppoheader/${usrReq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPOHeadList(data);
        setFilterPOHeadList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleKeypress = (e) => {
    // it triggers by pressing the enter key
    if (e.key === 'Enter') {
      handlePRPOQry();
    }
  };

  const handleFindDate = () => {
    const tmpFromDate = dateFns.format(fromDate, 'yyyy-MM-dd');

    setFilterPRHeadList(
      PRHeadList.filter(
        (dt) =>
          dt.RQODTE - 5430000 >= moment(fromDate).format('YYYYMMDD') &&
          dt.RQODTE - 5430000 <= moment(toDate).format('YYYYMMDD')
      )
    );
    setFilterPOHeadList(
      POHeadList.filter(
        (dt) =>
          dt.PODTE - 5430000 >= moment(fromDate).format('YYYYMMDD') &&
          dt.PODTE - 5430000 <= moment(toDate).format('YYYYMMDD')
      )
    );
  };

  const onPasswordChange = (val) => {
    const usrVal = val;
    const tmp = usrReq;

    const showLength = 1;

    const offset = usrVal.length - tmp.length;
    // console.log(`offset = ${offset}`);
    // console.log(`usrVal = ${usrVal}`);
    // console.log(`usrReq = ${usrReq}`);

    if (offset > 0) {
      // console.log(usrReq + usrVal.substring(tmp.length, tmp.length + offset));
      setUsrReq((usrReq + usrVal.substring(tmp.length, tmp.length + offset)).toUpperCase());
    } else if (offset < -1 && usrVal.length === 1) {
      // console.log('reset!');
      setUsrReq(usrVal);
    } else if (offset < 0) {
      // console.log(tmp.substring(0, tmp.length + offset));
      setUsrReq(tmp.substring(0, tmp.length + offset).toUpperCase());
    }

    // Change the visible string
    // if (passwordValue.length > showLength) {
    setUserReqTmp(
      usrVal.substring(0, usrVal.length - showLength).replace(/./g, '•') +
        usrVal.substring(usrVal.length - showLength, usrVal.length)
    );

    // }

    // Set the timer
    clearTimeout(hideAll);
    hideAll = setTimeout(() => {
      setUserReqTmp(usrVal.replace(/./g, '•'));
    }, 1000);
    // }
    // else{
    //   setUserReqTmp('');
    //   setUsrReq('');
    //   console.log("reset")
    // }
  };

  return (
    <>
      <Helmet>
        <title> ระบบอนุมัติออนไลน์ | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <PRPOSidebar name="prporeport" openNav={open} onCloseNav={() => setOpen(false)} />

      <PRRprtDialg
        openDialg={openPRData}
        onCloseDialg={() => {
          setPRHeader('');
          setOpenPRData(false);
        }}
        PRHeader={PRHeader}
        PRDetail={PRDetail.filter((data) => data.RQONO === PRHeader.RQONO)}
      />

      <PORprtDialg
        openDialg={openPOData}
        onCloseDialg={() => {
          setPOHeader('');
          setOpenPOData(false);
        }}
        POHeader={POHeader}
        PODetail={PODeatail.filter((data) => data.PONO === POHeader.PONO)}
      />
      <ErrMsgDialg
        openDialg={openErrMsg}
        onCloseDialg={() => {
          setErrMsg('');
          setOpenErrMsg(false);
        }}
        msg={errMsg}
        header={'ไม่สามารถอนุมัติได้'}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>รายงาน PR/PO ที่อนุมัติแล้ว</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/prpodashboard">หน้าหลักระบบอนุมัติออนไลน์</a>
              </li>
              <li className="breadcrumb-item my-2">รายงาน PR/PO ที่อนุมัติแล้ว</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <TextField
                    label="กรุณากรอกUser request"
                    value={usrReqTmp}
                    onKeyPress={handleKeypress}
                    onChange={(event) => {
                      // setUsrReq(event.target.value);
                      onPasswordChange(event.target.value);
                      usrReqList = {};
                      setIsShow(false);
                      setFromDate('');
                      setToDate(new Date());
                    }}
                    sx={{
                      '& input:valid + fieldset': {
                        borderColor: usrReq ? 'green' : 'red',
                      },
                      mr: 1,
                    }}
                  />
                  <Button
                    variant="contained"
                    disabled={usrReq === ''}
                    style={{ maxHeight: '56px', minHeight: '56px' }}
                    onClick={handlePRPOQry}
                  >
                    ค้นหา
                  </Button>
                  {usrReqList.name !== undefined ? (
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      User Request: {usrReqList.name}
                    </Typography>
                  ) : usrReqList.msg !== undefined ? (
                    <Typography variant="subtitle1" color={'error'} sx={{ mt: 1 }}>
                      {usrReqList.msg}
                    </Typography>
                  ) : (
                    ''
                  )}

                  {usrReq && isShow ? (
                    <>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                          ค้นหาตามวันเวลาที่อนุมัติ
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack direction="row" spacing={1}>
                            <DatePicker
                              disableFuture
                              format="dd-MM-yyyy"
                              maxDate={toDate}
                              label="จากวันที่"
                              value={fromDate}
                              onChange={(newValue) => {
                                setFromDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                              disableFuture
                              format="dd-MM-yyyy"
                              minDate={fromDate}
                              label="ถึงวันที่"
                              value={toDate}
                              onChange={(newValue) => {
                                setToDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            <Button
                              variant="contained"
                              onClick={handleFindDate}
                              sx={{ width: 100 }}
                              disabled={fromDate === ''}
                            >
                              ค้นหา
                            </Button>
                          </Stack>
                        </LocalizationProvider>
                      </Box>
                      <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                        PR | ใบเสนอซื้อรออนุมัติ
                      </Typography>
                      <Divider className="greendivider" sx={{ border: 7 }} />
                      <div style={{ display: 'flex', height: '100%' }}>
                        <StripedDataGrid
                          getRowId={(row) => row.RQONO}
                          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          disableSelectionOnClick
                          columns={PRColumns}
                          rows={filterPRHeadList}
                          pageSize={10}
                          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                          componentsProps={{
                            toolbar: {
                              printOptions: { hideFooter: true, hideToolbar: true },
                              csvOptions: { utf8WithBom: true },
                            },
                          }}
                        />
                      </div>
                      <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                        PO | ใบสั่งซื้อรออนุมัติ
                      </Typography>
                      <Divider className="reddivider" sx={{ border: 7 }} />
                      <div style={{ display: 'flex', height: '100%' }}>
                        <StripedDataGrid
                          getRowId={(row) => row.PONO}
                          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          disableSelectionOnClick
                          columns={POColumns}
                          rows={filterPOHeadList}
                          pageSize={10}
                          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                          componentsProps={{
                            toolbar: {
                              printOptions: { hideFooter: true, hideToolbar: true },
                              csvOptions: { utf8WithBom: true },
                            },
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default PRPOReport;
