/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from '@mui/material';
import { SubmtERR } from '../../../components/dialogs/response';

function TRSAttdSubmtDialg({ openDialg, onCloseDialg, topic, psnId, rToken }) {
  // const rToken = localStorage.getItem('token');

  const [submitERR, setSubmitERR] = useState(false);

  const handleTopicAttd = () => {
    const jsonData = {
      topic_id: topic?.topic_id,
      sub_id: topic?.sub_id,
      psn_id: psnId,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/topicattd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
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
        <DialogTitle>ลงชื่ออบรม</DialogTitle>
        <DialogContent>
          <DialogContentText>คุณต้องการลงชื่ออบรม {topic?.topic_name} {topic?.name} หรือไม่</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleTopicAttd}>
            ยืนยันการลงชื่อ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSAttdSubmtDialg;
