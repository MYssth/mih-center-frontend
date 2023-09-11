/* eslint-disable react/prop-types */
import * as React from 'react';
import { Button, Grid, Box, Dialog, DialogTitle, DialogContent, styled, DialogActions } from '@mui/material';

function DSMSShiftEditDialg({ openDialg, onCloseDialg, focusEvent, psnRender, setMonth, rToken }) {
  const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
  }));

  const handleDeletePSN = async (id, pid) => {
    await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/deleteevent/${id}/${pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    });
    onCloseDialg();
    window.location.href = `/dsmsedit?setMonth=${setMonth}`;
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>รายละเอียดของเวรแพทย์</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เวลา:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusEvent.shift_name}</Item>
              </Grid>

              {psnRender.map((psn) => (
                <>
                  <Grid item xs={4}>
                    <Item sx={{ textAlign: 'right' }}>แพทย์ผู้เข้าเวร:</Item>
                  </Grid>
                  <Grid item xs={5} sm={3}>
                    <Item>
                      {psn.personnel_firstname} {psn.personnel_lastname}
                    </Item>
                  </Grid>
                  <Grid item xs={3} sm={5}>
                    <Item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeletePSN(focusEvent.id, psn.personnel_id)}
                      >
                        ลบ
                      </Button>
                    </Item>
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิดหน้าต่าง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DSMSShiftEditDialg;
