import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function ErrMsgDialg({ openDialg, onCloseDialg, header, msg }) {
  return (
    <>
      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <DialogContentText>{msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ErrMsgDialg;
