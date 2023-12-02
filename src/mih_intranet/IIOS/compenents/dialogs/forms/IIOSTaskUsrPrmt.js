/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { SubmtERR, SubmtINC } from '../../../../components/dialogs/response';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

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
      category_id: data.category_id
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
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>{data?.issue_department_name}</Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>{data?.task_issue}</Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>
                {data?.informer_firstname} {data?.informer_lastname}
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>{data?.task_cost}</Item>
            </Grid>
          </Grid>
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
