/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  styled,
  alpha,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { SubmtERR, ErrMsgDialg, SubmtComp } from '../../../components/dialogs/response';

const moment = require('moment');

moment.locale('th');

let hideAll = setTimeout(() => {}, 0);

function PRPOApprvPRDialg({ openDialg, onCloseDialg, PRHeader, PRDetail, usrChk, usrName, rToken }) {
  const [submitERR, setSubmitERR] = useState(false);
  const [submitComp, setSubmitComp] = useState(false);

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [usrReq, setUsrReq] = useState('');
  const [usrReqTmp, setUserReqTmp] = useState('');

  const col = [
    {
      field: 'id',
      headerName: 'ลำดับ',
      maxWidth: 60,
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => PRDetail.findIndex((data) => data.ITMNO === params.row.ITMNO) + 1,
    },
    {
      field: 'PRDNAM',
      headerName: 'รายการ',
      // maxWidth: 110,
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <div>{params.row.PRDNAM}</div>
            {params.row.REMARK ? <div>หมายเหตุ : {params.row.REMARK}</div> : ''}
          </div>
        );
      },
    },
    {
      field: 'QTY',
      headerName: 'Qty',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.QTY.toLocaleString(),
    },
    {
      field: 'CVF',
      headerName: 'Cvf',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.CVF.toLocaleString(),
    },
    {
      field: 'PRDUP',
      headerName: 'ราคา',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.PRDUP.toLocaleString(),
    },
    {
      field: 'TOTAL',
      headerName: 'ราคารวม',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.TOTAL.toLocaleString(),
    },
  ];

  useEffect(() => {
    if (openDialg) {
      setUsrReq('');
      setUserReqTmp('');
    }
  }, [openDialg]);

  const handlePRApprove = () => {
    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/checkautapproveamountpr/${usrReq}/${PRHeader.NETAMT}`,
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
          const jsonData = {
            PGM: PRHeader.PGM,
            date: PRHeader.RQODTE,
            // date: parseInt(moment().format('YYYYMMDD'), 10) + 5430000,
            RQONO: PRHeader.RQONO,
            usr_req: usrReq,
          };
          // console.log(jsonData);
          fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_prpoPort}/approvepr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${rToken}`,
            },
            body: JSON.stringify(jsonData),
          })
            // .then((response) => response.json())
            .then((result) => {
              onCloseDialg();
            })
            .catch((error) => {
              console.error('Error:', error);
              setSubmitERR(true);
            });
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

  if (PRDetail.length === 0 || PRDetail === null) {
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>อนุมัติ PR</DialogTitle>
        <DialogContent>
          <DialogContentText>Loading...</DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <SubmtComp
        openDialg={submitComp}
        onCloseDialg={() => {
          setSubmitComp(false);
          onCloseDialg();
        }}
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
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>อนุมัติ PR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={5} sm={3} md={2}>
                เลขที่เอกสาร :
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.RQONO}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                วันที่:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {moment(PRDetail[0].RQODTE, 'YYYYMMDD').format('DD MMMM YYYY')}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                หน่วยงานที่ขอ:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.DIVNAM}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                ผู้สอบทาน:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.ISTNAM}
              </Grid>
              <Grid item xs={12}>
                จำนวนรายการทั้งหมด {PRDetail.length} รายการ ดังนี้
              </Grid>
              <Grid item xs={12}>
                <DataGrid
                  getRowId={(row) => row.ITMNO}
                  getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                  autoHeight
                  getRowHeight={() => 'auto'}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      py: 1,
                    },
                  }}
                  disableSelectionOnClick
                  columns={col}
                  rows={PRDetail}
                  pageSize={10}
                  componentsProps={{
                    toolbar: {
                      printOptions: { hideFooter: true, hideToolbar: true },
                      csvOptions: { utf8WithBom: true },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" color={'error'} sx={{ justifyContent: 'flex-end' }}>
                    รวม {PRHeader.NETAMT.toLocaleString()} บาท
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                หมายเหตุ :
              </Grid>
              <Grid item xs={12}>
                {PRHeader.REMARK}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography color={'error'}>
                    User request ผู้อนุมัติ
                    <br />
                    {usrName}
                  </Typography>
                  <TextField
                    label="กรุณาใส่ User request"
                    value={usrReqTmp === null ? '' : usrReqTmp}
                    onChange={(event) => {
                      onPasswordChange(event.target.value);
                      // setUsrReq(event.target.value.toUpperCase());
                    }}
                    sx={{
                      '& input:valid + fieldset': {
                        borderColor: usrReq === usrChk ? 'green' : 'red',
                      },
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handlePRApprove} color="success" disabled={usrReq !== usrChk}>
            ยืนยันการอนุมัติ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PRPOApprvPRDialg;
