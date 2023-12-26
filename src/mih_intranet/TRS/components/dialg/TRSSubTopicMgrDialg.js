import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  alpha,
  styled,
  Grid,
  Typography,
  TextField,
  Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import thLocale from 'date-fns/locale/th';
import { ErrMsgDialg } from '../../../components/dialogs/response';

const moment = require('moment');

moment.locale('en');

function TRSSubTopicMgrDialg({ openDialg, onCloseDialg, onRefresh, data, mode, rToken }) {
  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [topicId, setTopicId] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [lmt, setLmt] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [remark, setRemark] = useState('');

  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  useEffect(() => {
    if (openDialg) {
      setTopicId('');
      setId('');
      setName('');
      setLmt(0);
      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      setRemark('');

      setOpenStartTime(false);
      setOpenEndDate(false);
      setOpenEndTime(false);

      setTopicId(data.topic_id);
      if (mode === 'edit') {
        setId(data.id);
        setName(data.name);
        setLmt(data.lmt);
        setStartDate(moment.utc(data.start_date));
        setStartTime(moment.utc(data.start_date));
        setEndDate(moment.utc(data.end_date));
        setEndTime(moment.utc(data.end_date));
        setRemark(data.remark);
      }
    }
  }, [openDialg]);

  const handleSubmit = (isactive) => {
    const jsonData = {
      topic_id: topicId,
      id,
      name,
      lmt,
      start_date: `${moment(startDate).format('YYYY-MM-DD')}T${moment(startTime).format('HH:mm')}:00.000Z`,
      end_date: `${moment(endDate).format('YYYY-MM-DD')}T${moment(endTime).format('HH:mm')}:00.000Z`,
      isactive,
      remark,
    };
    if (mode === 'new') {
      Object.assign(jsonData, { create_by: jwtDecode(localStorage.getItem('token')).psn_id });
    } else {
      Object.assign(jsonData, { last_edit_by: jwtDecode(localStorage.getItem('token')).psn_id });
    }

    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/${
        mode === 'new' ? 'addsubtopic' : 'updatesubtopic'
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
        body: JSON.stringify(jsonData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          onCloseDialg();
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
        header={mode === 'new' ? 'ไม่สามารถเพิ่มรุ่นกิจกรรม' : 'ไม่สามารถแก้ไขข้อมูลได้'}
      />
      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>{mode === 'new' ? 'เพิ่มรุ่นกิจกรรม' : `แก้ไขข้อมูลรุ่นกิจกรรม ${id}`}</DialogTitle>
        <DialogContent>
          <h5 className="card-title">รายละเอียด</h5>

          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <Typography>ชื่อรุ่นกิจกรรม</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 200 ตัวอักษร"
                value={name}
                inputProps={{ maxLength: 200 }}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                sx={{
                  '& input:valid + fieldset': {
                    borderColor: name ? 'green' : 'red',
                  },
                  mt: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>โควต้าผู้เข้าร่วม</Typography>
              <TextField
                fullWidth
                label="จำนวนผู้เข้าร่วมได้สูงสุดในรุ่นนี้"
                value={lmt}
                onChange={(event) => {
                  setLmt(event.target.value);
                }}
                sx={{
                  '& input:valid + fieldset': {
                    borderColor: lmt ? 'green' : 'red',
                  },
                  mt: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>วันที่เริ่ม</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                <DatePicker
                  onAccept={() => {
                    setOpenStartTime(true);
                  }}
                  maxDate={endDate}
                  label="เลือกวันที่เริ่ม"
                  format="DD/MM/YYYY"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: startDate ? 'green' : 'red',
                    },
                    mt: 1,
                    mr: 1,
                  }}
                />
                <TimePicker
                  label="เลือกเวลาที่เริ่ม"
                  open={openStartTime}
                  onOpen={() => setOpenStartTime(true)}
                  onClose={() => setOpenStartTime(false)}
                  onAccept={() => {
                    setOpenEndDate(true);
                  }}
                  ampm={false}
                  // minutesStep="15"
                  value={startTime ?? ''}
                  onChange={(newValue) => setStartTime(newValue)}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: startTime ? 'green' : 'red',
                    },
                    mt: 1,
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography>วันที่เสร็จสิ้น</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                <DatePicker
                  open={openEndDate}
                  onOpen={() => setOpenEndDate(true)}
                  onClose={() => setOpenEndDate(false)}
                  onAccept={() => {
                    setOpenEndTime(true);
                  }}
                  minDate={startDate}
                  label="เลือกวันที่เสร็จสิ้น"
                  format="DD/MM/YYYY"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: endDate ? 'green' : 'red',
                    },
                    mt: 1,
                    mr: 1,
                  }}
                />
                <TimePicker
                  label="เลือกเวลาที่เสร็จสิ้น"
                  open={openEndTime}
                  onOpen={() => setOpenEndTime(true)}
                  onClose={() => setOpenEndTime(false)}
                  ampm={false}
                  // minutesStep="15"
                  value={endTime ?? ''}
                  onChange={(newValue) => setEndTime(newValue)}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: endTime ? 'green' : 'red',
                    },
                    mt: 1,
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography>หมายเหตุ (เห็นเฉพาะ Admin ระบบ)</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 100 ตัวอักษร"
                value={remark}
                inputProps={{ maxLength: 100 }}
                onChange={(event) => {
                  setRemark(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {mode === 'new' ? (
            ''
          ) : !data?.isactive ? (
            <Button
              onClick={() => {
                handleSubmit(1);
              }}
              className="btn btn-success"
            >
              Active
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleSubmit(0);
              }}
              className="btn btn-danger"
            >
              Inactive
            </Button>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              handleSubmit(data.isactive ? 1 : 0);
            }}
            className="btn btn-success"
            disabled={
              name === '' ||
              lmt === 0 ||
              startDate === null ||
              startTime === null ||
              endDate === null ||
              endTime === null
            }
          >
            {mode === 'new' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}
          </Button>
          <Button onClick={onCloseDialg} color="error">
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSSubTopicMgrDialg;
