/* eslint-disable react/prop-types */
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function DSMSShiftDelDialg({ openDialg, onCloseDialg, focusEvent, pid, rToken }) {
  const handleDeletePSN = async () => {
    await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/deleteevent/${focusEvent.id}/${pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    });
    window.location.reload(false);
    onCloseDialg();
  };

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('th-TH', { month: 'long' });
  }

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>ยืนยันการลบเวร</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Typography>
              ไม่สามารถเลือกวันดังกล่าวได้เนื่องจากมีเวลาจากเวรอื่นทับซ้อนหรือได้ลงเวรในวันนี้ไปแล้ว
              <br />
              เวรที่ลงไว้ : วันที่ {focusEvent?.day} {getMonthName(focusEvent?.month)} {focusEvent?.year} เวลา{' '}
              {focusEvent?.name}น.
              <br />
              ต้องการยกเลิกเวรที่ลงไว้หรือไม่
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleDeletePSN}>
            ยกเลิกเวร
          </Button>
          <Button
            onClick={() => {
              window.location.reload(false);
              onCloseDialg();
            }}
          >
            ปิดหน้าต่าง
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DSMSShiftDelDialg;
