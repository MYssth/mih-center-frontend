/* eslint-disable react/prop-types */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function SubmtERR({ openDialg, onCloseDialg }) {
  return (
    <>
      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>เกิดข้อผิดพลาดในการดำเนินการ</DialogTitle>
        <DialogContent>
          <DialogContentText>กรุณาลองใหม่อีกครั้งในภายหลัง</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubmtERR;
