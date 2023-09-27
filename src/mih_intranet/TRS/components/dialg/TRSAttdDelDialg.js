import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { SubmtERR } from '../../../components/dialogs/response';

function TRSAttdDelDialg({ openDialg, onCloseDialg, topic, psnId, rToken }) {
  const [submitERR, setSubmitERR] = useState(false);

  const handleAttdDel = () => {
    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/topicattddel/${topic?.topic_id}/${topic?.sub_id}/${topic?.psn_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'ok') {
          onCloseDialg();
        } else {
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitERR(true);
      });
  };

  return (
    <>
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>ลบผู้ร่วมกิจกรรม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบ {topic?.psn_name} ออกจากกิจกรรม {topic?.topic_name} {topic?.name} หรือไม่
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleAttdDel} color='error'>
            ยืนยันการลบ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSAttdDelDialg;
