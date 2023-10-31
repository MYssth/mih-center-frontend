import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Typography, styled, alpha, Button, TextField, Divider } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import MainHeader from '../components/MainHeader';
import PRPOSidebar from './compenents/nav/PRPOSidebar';
import PRPOApprvPRDialg from './compenents/dialogs/PRPOApprvPRDialg';
import PRPOApprvPODialg from './compenents/dialogs/PRPOApprvPODialg';
import { ErrMsgDialg } from '../components/dialogs/response';
import './css/index.css';

const moment = require('moment');

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

function PRReport() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [PRHeadList, setPRHeadList] = useState([]);
  const [POHeadList, setPOHeadList] = useState([]);

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [openPRApprv, setOpenPRApprv] = useState(false);
  const [PRHeader, setPRHeader] = useState('');
  const [PRDetail, setPRDetail] = useState([]);

  const [openPOApprv, setOpenPOApprv] = useState(false);
  const [POHeader, setPOHeader] = useState('');
  const [PODeatail, setPODetail] = useState([]);

  const [usrReqTmp, setUserReqTmp] = useState('');
  const [usrReq, setUsrReq] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [usrNam, setUsrNam] = useState('');

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
          handlePRApprove(params.row);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            ดำเนินการ
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
      minWidth: 100,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getversion`, {
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

  const handlePRPOQry = () => {
    setIsShow(true);
    // console.log(usrReq);
    setUsrNam('');

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

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/getprheader/${usrReq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPRHeadList(data);
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

  const handlePRApprove = (PRHeader) => {
    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/checkapprovestatuspr/${PRHeader.PGM}/${PRHeader.RQODTE}/${PRHeader.RQONO}`,
      // `${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/checkapprovestatuspr/${PRHeader.PGM}/${
      //   parseInt(moment().format('YYYYMMDD'), 10) + 5430000
      // }/${PRHeader.RQONO}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setErrMsg(data.msg);
        if (data.msg === '') {
          // if (1) {
          setPRHeader(PRHeader);
          setOpenPRApprv(true);
        } else {
          setOpenErrMsg(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const onPasswordChange = (val) => {
    const usrVal = val;
    const tmp = usrReq;

    const showLength = 1;

    const offset = usrVal.length - tmp.length;
    // console.log(`offset = ${offset}`);

    if (offset > 0) {
      // console.log(usrReq + usrVal.substring(tmp.length, tmp.length + offset));
      setUsrReq((usrReq + usrVal.substring(tmp.length, tmp.length + offset)).toUpperCase());
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
      <PRPOSidebar name="prpodashboard" openNav={open} onCloseNav={() => setOpen(false)} />

      <PRPOApprvPRDialg
        openDialg={openPRApprv}
        onCloseDialg={() => {
          setPRHeader('');
          handlePRPOQry();
          setOpenPRApprv(false);
        }}
        PRHeader={PRHeader}
        PRDetail={PRDetail.filter((data) => data.RQONO === PRHeader.RQONO)}
        usrChk={usrReq}
        usrName={usrReqList.name}
        rToken={rToken}
      />

      <PRPOApprvPODialg
        openDialg={openPOApprv}
        onCloseDialg={() => {
          setPOHeader('');
          handlePRPOQry();
          setOpenPOApprv(false);
        }}
        POHeader={POHeader}
        PODetail={PODeatail.filter((data) => data.PONO === POHeader.PONO)}
        usrChk={usrReq}
        usrName={usrReqList.name}
        rToken={rToken}
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
          <h1>ระบบอนุมัติออนไลน์ - Online Approve Service (OAS) version: {version}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">หน้าหลักระบบอนุมัติออนไลน์</li>
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
                      <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                        PR | ใบเสนอซื้อรออนุมัติ
                      </Typography>
                      <Divider className="greendivider" sx={{ border: 7 }} />
                      <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ flexGrow: 1 }}>
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
                            rows={PRHeadList}
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

export default PRReport;
