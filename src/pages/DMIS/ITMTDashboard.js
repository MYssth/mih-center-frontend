import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Autocomplete, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function ITMTDashboard() {

  const navigate = useNavigate();

  // =========================================================
  const [taskList, setTaskList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [operatorName, setOperatorName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [acceptTaskDialogOpen, setAcceptTaskDialogOpen] = useState(false);
  const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false);
  const [tempTaskId, setTempTaskId] = useState('');
  const [tempLevelId, setTempLevelId] = useState('');
  const [tempRecvId, setTempRecvId] = useState('');

  const [tempDeviceId, setTempDeviceId] = useState('');
  const [tempSerialnumber, setTempSerialnumber] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

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

  const setTempTask = (taskId, levelId) => {
    fetch(`http://localhost:5003/api/dmis/gettask/${taskId}/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        setTempDeviceId(data.task_device_id);
        setTempSerialnumber(data.task_serialnumber)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`http://localhost:5003/api/dmis/getcategories/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleOpenTaskDialog = (taskId, levelId, statusId, operatorId) => {

    setTempTaskId(taskId);
    setTempLevelId(levelId);
    if (statusId === 1) {
      setOperatorName(`${operatorList.find(o => o.personnel_id === tempRecvId).personnel_firstname} ${operatorList.find(o => o.personnel_id === tempRecvId).personnel_lastname}`);
      setOperatorId(tempRecvId);
      setAcceptTaskDialogOpen(true);
    }
    else if (statusId === 2) {
      setOperatorName(`${operatorList.find(o => o.personnel_id === operatorId).personnel_firstname} ${operatorList.find(o => o.personnel_id === operatorId).personnel_lastname}`);
      setOperatorId(operatorId);
      setTempTask(taskId, levelId);
      setCategories(levelId);
      setCompleteTaskDialogOpen(true);
    }
  };

  const handleCloseAcceptTaskDialog = () => {
    setTempTaskId("");
    setTempLevelId("");
    setAcceptTaskDialogOpen(false);
  };

  const handleCloseCompleteTaskDialog = () => {
    setCategoryName("");
    setCategoryId("");
    setCompleteTaskDialogOpen(false);
  };

  const handleAcceptTask = () => {

    const jsonData = {
      task_id: tempTaskId,
      level_id: tempLevelId,
      receiver_id: tempRecvId,
      operator_id: operatorId,
    };

    if(jsonData.operator_id === ""){
      alert("กรุณาเลือกผู้รับผิดชอบงาน");
      return;
    }

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

  const handleCompleteTask = () => {

    const jsonData = {
      task_id: tempTaskId,
      level_id: tempLevelId,
      task_solution: document.getElementById('solution').value,
      task_cost: document.getElementById('cost').value,
      task_serialnumber: tempSerialnumber,
      task_device_id: tempDeviceId,
      operator_id: operatorId,
      category_id: categoryId,
    }

    if(jsonData.task_solution === ""){
      alert("กรุณาระบุรายละเอียดการแก้ปัญหา");
      return;
    }

    if(jsonData.operator_id === ""){
      alert("กรุณาเลือกผู้รับผิดชอบงาน");
      return;
    }

    if(jsonData.category_id === ""){
      alert("กรุณาเลือกประเภทของงาน");
      return;
    }

    fetch(`http://localhost:5003/api/dmis/completetask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('จบงานเรียบร้อย');
          navigate('/dmis', { replace: true });
        }
        else {
          alert('ไม่สามารถทำการจบงานได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการจบงาน');
      });
    
  };

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
                    <TableCell sx={{ maxWidth: 100 }}>{(row.task_date_start).replace("T", " ").replace(".000Z", " น.")}</TableCell>
                    <TableCell>{row.operator_name}</TableCell>
                    <TableCell>{row.status_name}</TableCell>
                    <TableCell><Button variant="contained" onClick={() => { handleOpenTaskDialog(row.task_id, row.level_id, row.status_id, row.operator_id) }}>ดำเนินการ</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>


      {/* ==================================รับเรื่อง============================================= */}
      <Dialog fullWidth={120} open={acceptTaskDialogOpen} onClose={handleCloseAcceptTaskDialog}>
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
                setOperatorId(operatorList.find(o => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id);
              }
              else {
                setOperatorId("");
              }
            }}
            id="controllable-states-operator-id"
            options={Object.values(operatorList).map((option) => `${option.personnel_firstname} ${option.personnel_lastname}`)}
            fullWidth
            required
            renderInput={(params) => <TextField {...params} label="" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptTaskDialog}>ยกเลิก</Button>
          <Button onClick={handleAcceptTask}>รับเรื่อง</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ====================================จบงาน========================================= */}
      <Dialog fullWidth={120} open={completeTaskDialogOpen} onClose={handleCloseCompleteTaskDialog}>
        <DialogTitle>จบงานแจ้งซ่อม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาระบุรายละเอียดงาน
          </DialogContentText>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <TextField id="deviceId" name="deviceId" value={tempDeviceId} onChange={(event, newValue) => {setTempDeviceId(newValue)}} label="รหัสทรัพย์สิน" />
            <TextField
              required
              id="solution"
              name="solution"
              label="รายละเอียดของการแก้ปัญหา"
              multiline
            />
            <TextField id="serialnumber" name="serialnumber" value={tempSerialnumber} onChange={(event, newValue) => {setTempSerialnumber(newValue)}} label="Serial Number" />
            <TextField id="cost" name="cost" label="งบประมาณที่ใช้ในงาน" />
            <Autocomplete
              value={operatorName}
              onChange={(event, newValue) => {
                setOperatorName(newValue);
                if (newValue !== null) {
                  setOperatorId(operatorList.find(o => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id);
                }
                else {
                  setOperatorId("");
                }
              }}
              id="controllable-states-operator-id"
              options={Object.values(operatorList).map((option) => `${option.personnel_firstname} ${option.personnel_lastname}`)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ผู้รับผิดชอบงาน" />}
            />
            <Autocomplete
              value={categoryName}
              onChange={(event, newValue) => {
                setCategoryName(newValue);
                if (newValue !== null) {
                  setCategoryId(categories.find(o => o.category_name === newValue).category_id);
                }
                else {
                  setCategoryId("");
                }
              }}
              id="controllable-states-categories-id"
              options={Object.values(categories).map((option) => option.category_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ประเภทงาน" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteTaskDialog}>ยกเลิก</Button>
          <Button onClick={handleCompleteTask}>จบงาน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
