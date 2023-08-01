/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { SubmtERR } from '../../../../components/dialogs/response';

let pname = '';

function CBSDelGrpSchedSubm({ openDialg, onCloseDialg, data }) {
  const [id, setId] = useState('');
  const [grpId, setGrpId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setTodate] = useState('');
  const [submitERR, setSubmitERR] = useState(false);

  useEffect(() => {
    pname = jwtDecode(localStorage.getItem('token')).personnel_name;
  }, []);

  useEffect(() => {
    if (openDialg) {
      setId(data.id);
      setGrpId(data.grp_id);
    }
  }, [openDialg]);

  const handleDel = () => {
    const jsonData = {
      id: id,
      grp_id: grpId,
      req_name: pname,
    };

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/delgrpsched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
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

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>
          ลบคำขอใช้รถเลขที่ {data?.id} ออกจากกลุ่มงานเลขที่ {data?.grp_id}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1"> กรุณายืนยันการลบคำขอใช้รถออกจากกลุ่มงาน</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDel} className="btn btn-danger">
            ลบคำขอใช้รถออกจากกลุ่มงาน
          </Button>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CBSDelGrpSchedSubm;