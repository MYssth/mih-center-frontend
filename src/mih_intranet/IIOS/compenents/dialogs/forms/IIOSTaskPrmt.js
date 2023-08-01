/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmtERR, SubmtINC } from '../../../../components/dialogs/response';

function IIOSTaskPrmt({ openDialg, onCloseDialg, data, permitId }) {
  const [levelId, setLevelId] = useState('');
  const [statusIdRequest, setStatusIdRequest] = useState('');
  const [pChange, setPChange] = useState(false);
  const [isOSC, setIsOSC] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [submitINC, setSubmitINC] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);

  const isSkip = (value) => value !== '';

  function clearData() {
    setLevelId('');
    setStatusIdRequest('');
    setPChange(false);
    setIsOSC(false);
    setCategories([]);
    setCategoryId('');
    setCategoryName('');
  }

  useEffect(() => {
    if (openDialg) {
      // console.log(data);

      // setTaskId(data.task_id);
      setLevelId(data.level_id);
      setStatusIdRequest(data.status_id_request);
      setPChange(data.status_id_request === 5 && (data.category_id === 1 || data.category_id === 16));
      setIsOSC(data.status_id_request === 5 && data.status_id === 4);

      setCategoryId(data.category_id);
      setCategoryName(data.category_name);

      fetch(
        `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcategories/${data.level_id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [openDialg]);

  const handlePermitTask = (permitCase) => {
    const jsonData = {
      task_id: data.task_id,
      level_id: data.level_id,
      permit_id: permitId,
      status_id_request: statusIdRequest,
      taskCase: permitCase,
      category_id: categoryId,
    };

    if (
      (jsonData.category_id === '' || jsonData.category_id === null) &&
      (permitCase === 'pConfirm' || permitCase === 'permit') &&
      statusIdRequest !== 0
    ) {
      // alert("กรุณาเลือกหมวดหมู่งาน");
      setSubmitINC(true);
      return;
    }

    // console.log(jsonData);

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/processtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          clearData();
          onCloseDialg();
        } else {
          // alert('ไม่สามารถยืนยันการตรวจสอบงานได้');
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // alert('เกิดข้อผิดพลาดในการยืนยันตรวจสอบงาน');
        setSubmitERR(true);
      });
  };

  return (
    <>
      <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>
          อนุมัติงาน -{' '}
          {`${
            data.status_id_request === 2 && data.category_id === 1
              ? 'กำลังดำเนินการ (HIMS)'
              : data.status_id_request === 5 && (data.category_id === 1 || data.category_id === 16)
              ? 'ดำเนินการเสร็จสิ้น (ขอวางโปรแกรม)'
              : data.status_id_request === 2 && data.category_id === 16
              ? 'กำลังดำเนินการ (HIMS Change)'
              : data.status_id_request === 5 && data.status_id === 4
              ? 'ส่งซ่อมภายนอก (ปิดงาน)'
              : data.status_name_request
          }`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>คุณต้องการอนุมัติงานนี้ใช่หรือไม่</DialogContentText>
          <br />
          {statusIdRequest === 0 ? (
            ''
          ) : (
            <Autocomplete
              value={categoryName === null ? '' : categoryName}
              onChange={(event, newValue) => {
                setCategoryName(newValue);
                if (newValue !== null) {
                  setCategoryId(categories.find((o) => o.category_name === newValue).category_id);
                } else {
                  setCategoryId('');
                }
              }}
              id="controllable-states-categories-id"
              options={
                levelId === 'DMIS_IT'
                  ? Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_IT' ? option.category_name : ''))
                      .filter(isSkip)
                  : levelId === 'DMIS_MT'
                  ? Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_MT' ? option.category_name : ''))
                      .filter(isSkip)
                  : Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_MER' ? option.category_name : ''))
                      .filter(isSkip)
              }
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="หมวดหมู่งาน" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: categoryName ? 'green' : 'red',
                  },
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {statusIdRequest === 3 || statusIdRequest === 4 || statusIdRequest === 6 ? (
            <Box alignItems="flex-start">
              <Button variant="contained" onClick={() => handlePermitTask('permitEnd')}>
                ส่งมอบให้ผู้แจ้งดำเนินการ
              </Button>
            </Box>
          ) : (
            <></>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              clearData();
              onCloseDialg();
            }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={() => handlePermitTask(pChange ? 'pConfirm' : isOSC ? 'osConfirm' : 'permit')}
          >
            อนุมัติ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handlePermitTask(pChange ? 'pReject' : isOSC ? 'osReject' : 'reject')}
          >
            ไม่อนุมัติ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default IIOSTaskPrmt;
