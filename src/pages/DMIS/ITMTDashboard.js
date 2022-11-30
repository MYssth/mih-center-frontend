import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

export default function ITMTDashboard() {

  const navigate = useNavigate();

  // =========================================================
  const [taskList, setTaskList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [operatorName, setOperatorName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [acceptTaskDialogOpen, setAcceptTaskDialogOpen] = useState(false);
  const [tempTaskId, setTempTaskId] = useState('');
  const [tempLevelId, setTempLevelId] = useState('');
  const [tempRecvId, setTempRecvId] = useState('');


  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT") {
        fetch(`http://localhost:5003/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        fetch(`http://localhost:5003/api/dmis/getoperator/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setOperatorList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }

    setTempRecvId(token.personnel_id);

  }, []);
  // ========================================================

  const handleOpenAcceptTaskDialog = (taskId, levelId, statusId) => {

    setTempTaskId(taskId);
    setTempLevelId(levelId);
    if (statusId === 1) {
      setAcceptTaskDialogOpen(true);
    }
    else if (statusId === 2) {
      // go to complete task page
    }
  };

  const handleCloseAcceptTaskDialog = () => {
    setTempTaskId("");
    setTempLevelId("");
    setAcceptTaskDialogOpen(false);
  };

  const handleAcceptTask = () => {

    const jsonData = {
      task_id: tempTaskId,
      level_id: tempLevelId,
      receiver_id: tempRecvId,
      operator_id: operatorId,
    };

    fetch(`http://localhost:5003/api/dmis/accepttask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('รับเรื่องสำเร็จ');
          navigate('/dmis', { replace: true });
        }
        else {
          alert('ไม่สามารถทำการรับเรื่องได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการรับเรื่อง');
      });

  }

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งซ่อมอุปกรณ์ | MIH Center </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งซ่อมอุปกรณ์ - Device Maintenance Inform Service(DMIS)
        </Typography>
        <Card>
          <TableContainer component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              รายการงานแจ้งซ่อมอุปกรณ์
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>รายละเอียด</TableCell>
                  <TableCell>แผนก</TableCell>
                  <TableCell>ผู้แจ้ง</TableCell>
                  <TableCell>วันที่แจ้ง</TableCell>
                  <TableCell>ผู้รับผิดชอบ</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskList.map((row) => (
                  <TableRow
                    key={row.task_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 300 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell>{row.department_name}</TableCell>
                    <TableCell>{row.informer_name}</TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>{(row.task_date_start).replace("T", " ")}</TableCell>
                    <TableCell>{row.operator_name}</TableCell>
                    <TableCell>{row.status_name}</TableCell>
                    <TableCell><Button variant="contained" onClick={() => { handleOpenAcceptTaskDialog(row.task_id, row.level_id, row.status_id) }}>ดำเนินการ</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      <Dialog open={acceptTaskDialogOpen} onClose={handleCloseAcceptTaskDialog}>
        <DialogTitle>รับเรื่อง</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาระบุผู้รับผิดชอบงาน
          </DialogContentText>
          <Autocomplete
            value={operatorName}
            onChange={(event, newValue) => {
              setOperatorName(newValue);
              if (newValue !== null) {
                setOperatorId(operatorList.find(o => o.personnel_name === newValue).personnel_id);
              }
              else {
                setOperatorId("");
              }
            }}
            id="controllable-states-operator-id"
            options={Object.values(operatorList).map((option) => option.personnel_name)}
            fullWidth
            required
            renderInput={(params) => <TextField {...params} label="ผู้รับผิดชอบงาน" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptTaskDialog}>ยกเลิก</Button>
          <Button onClick={handleAcceptTask}>รับเรื่อง</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
