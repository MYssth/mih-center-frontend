/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    colors,
  } from '@mui/material';
import { SubmtERR } from '../../../components/dialogs/response';

function TRSVoteSubmtDialg({ openDialg, onCloseDialg, data, psnId, rToken }) {
  // const rToken = localStorage.getItem('token');

  const [submitERR, setSubmitERR] = useState(false);

  const handleVote = () => {
    const jsonData = {
      vote: data.psn_id,
      id: psnId,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/vote`, {
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
        <DialogTitle>ยืนยันการโหวต</DialogTitle>
        <DialogContent>
          <DialogContentText>คุณต้องการโหวตให้ {data?.pname}{data?.fname} {data?.lname} {data?.dept_name} หรือไม่<br/>
          <div style={{"color":"red"}}>หากยืนยันการโหวตแล้วจะไม่สามารถแก้ไขได้ทุกกรณี กรุณาตรวจสอบรายชื่อให้ถูกต้อง</div></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleVote}>
            ยืนยันการโหวต
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSVoteSubmtDialg;
