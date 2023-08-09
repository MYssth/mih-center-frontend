/* eslint-disable react/prop-types */
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useState } from 'react';
import { SubmtERR, SubmtINC } from '../../../../components/dialogs/response';

function IIOSTaskUsrPrmt({ openDialg, onCloseDialg, data, permitId }) {
  const [submitINC, setSubmitINC] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);

  const rToken = localStorage.getItem('token');

  const handlePermitTask = (permitCase) => {
    const jsonData = {
      task_id: data.task_id,
      level_id: data.level_id,
      permit_id: permitId,
      taskCase: permitCase,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/processtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
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
        <DialogTitle>อนุมัติงานรออนุมัติแก้ไขโปรแกรม</DialogTitle>
        <DialogContent>
          <DialogContentText>คุณต้องการอนุมัติงานนี้ใช่หรือไม่</DialogContentText>
          <br />
        </DialogContent>
        <DialogActions>
          <div style={{ flex: '1 0 0' }} />
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={() => handlePermitTask('usrPermit')}>
            อนุมัติ
          </Button>
          <Button variant="contained" color="error" onClick={() => handlePermitTask('reject')}>
            ไม่อนุมัติ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default IIOSTaskUsrPrmt;
