/* eslint-disable react/prop-types */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function SubmtINC({ openDialg, onCloseDialg }) {
  return (
    <>
      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>ดำเนินการไม่สำเร็จ</DialogTitle>
        <DialogContent>
          <DialogContentText>กรุณากรอกข้อมูลในกรอบสีแดงให้ครบถ้วน</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubmtINC;
