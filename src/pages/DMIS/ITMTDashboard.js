import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Autocomplete, Stack, Divider, CardActionArea, CardContent } from '@mui/material';

// ----------------------------------------------------------------------

export default function ITMTDashboard() {

  const navigate = useNavigate();

  // =========================================================
  const [taskList, setTaskList] = useState([]);
  const [completeTaskList, setCompleteTaskList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [operatorName, setOperatorName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [acceptTaskDialogOpen, setAcceptTaskDialogOpen] = useState(false);
  const [processTaskDialogOpen, setProcessTaskDialogOpen] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [recvId, setRecvId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [taskNote, setTaskNote] = useState('');
  const [status, setStatus] = useState([]);
  const [statusId, setStatusId] = useState('');
  const [statusName, setStatusName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [serialnumber, setSerialnumber] = useState('');
  const [taskCost, setTaskCost] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [taskCount, setTaskCount] = useState([]);
  const [processTaskButton, setProcessTaskButton] = useState(false);

  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT") {
        fetch(`http://localhost:5003/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskList(data);
            setFilterTaskList(data);
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

        fetch(`http://localhost:5003/api/dmis/counttask/${token.personnel_id}/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskCount(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        fetch(`http://localhost:5003/api/dmis/getcompletetasklist/${token.personnel_id}/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setCompleteTaskList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }

    setRecvId(token.personnel_id);

  }, []);

  useEffect(() => {
    if (filterStatusId === 5) {
      setProcessTaskButton(true);
      setFilterTaskList(completeTaskList);
    }
    else {
      setProcessTaskButton(false);
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter(dt => dt.status_id === filterStatusId));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId])
  // ========================================================

  const setTempTask = (taskId, levelId) => {
    fetch(`http://localhost:5003/api/dmis/gettask/${taskId}/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        setDeviceId(data.task_device_id);
        setSerialnumber(data.task_serialnumber);
        setPhoneNo(data.task_phone_no);
        setTaskNote(data.task_note);
        setStatusId(data.status_id);
        setStatusName(data.status_name);
        setTaskCost(data.task_cost);
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

    fetch(`http://localhost:5003/api/dmis/getstatus`)
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleOpenTaskDialog = (taskId, levelId, statusId, operatorId) => {

    setTaskId(taskId);
    setLevelId(levelId);
    if (statusId === 1) {
      setOperatorName(`${operatorList.find(o => o.personnel_id === recvId).personnel_firstname} ${operatorList.find(o => o.personnel_id === recvId).personnel_lastname}`);
      setOperatorId(recvId);
      setAcceptTaskDialogOpen(true);
    }
    else if (statusId === 2 || statusId === 3 || statusId === 4) {
      setOperatorName(`${operatorList.find(o => o.personnel_id === operatorId).personnel_firstname} ${operatorList.find(o => o.personnel_id === operatorId).personnel_lastname}`);
      setOperatorId(operatorId);
      setTempTask(taskId, levelId);
      setCategories(levelId);
      setProcessTaskDialogOpen(true);
    }
  };

  const handleCloseAcceptTaskDialog = () => {
    setTaskId("");
    setLevelId("");
    setAcceptTaskDialogOpen(false);
  };

  const handleCloseProcessTaskDialog = () => {
    setPhoneNo("");
    setDeviceId("");
    setTaskCost("");
    setSerialnumber("");
    setCategoryName("");
    setCategoryId("");
    setTaskNote("");
    setProcessTaskDialogOpen(false);
  };

  const handleAcceptTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      receiver_id: recvId,
      operator_id: operatorId,
    };

    if (jsonData.operator_id === "") {
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

  const handleProcessTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      task_solution: document.getElementById('solution').value,
      task_cost: document.getElementById('cost').value,
      task_serialnumber: serialnumber,
      task_device_id: deviceId,
      status_id: statusId,
      operator_id: operatorId,
      category_id: categoryId,
      task_phone_no: phoneNo,
      task_note: taskNote,
    }

    console.log(`task_id ${jsonData.task_id}`);
    console.log(`level_id ${jsonData.level_id}`);
    console.log(`task_solution ${jsonData.task_solution}`);
    console.log(`task_cost ${jsonData.task_cost}`);
    console.log(`task_serialnumber ${jsonData.task_serialnumber}`);
    console.log(`task_device_id ${jsonData.task_device_id}`);
    console.log(`status_id ${jsonData.status_id}`);
    console.log(`operator_id ${jsonData.operator_id}`);
    console.log(`category_id ${jsonData.category_id}`);
    console.log(`task_phone_no ${jsonData.task_phone_no}`);
    console.log(`task_note ${jsonData.task_note}`);

    if (jsonData.status_id === 5 && jsonData.task_solution === "") {
      alert("กรุณาระบุรายละเอียดการแก้ปัญหา ");
      return;
    }

    if (jsonData.operator_id === "") {
      alert("กรุณาเลือกผู้รับผิดชอบงาน");
      return;
    }

    if (jsonData.category_id === "") {
      alert("กรุณาเลือกประเภทของงาน");
      return;
    }

    if (jsonData.status_id === 3 || jsonData.status_id === 4) {
      if (jsonData.task_note === "") {
        alert("กรุณาระบุข้อมูลในหมายเหตุ");
        return;
      }
    }

    fetch(`http://localhost:5003/api/dmis/processtask`, {
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

        <Stack direction="row" align="center" sx={{ margin: 1, maxHeight: 100 }}>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'error.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(1)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  รอรับเรื่อง
                </Typography>
                <Typography variant="body1">
                  {taskCount.inform} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(2)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  กำลังดำเนินการ
                </Typography>
                <Typography variant="body1">
                  {taskCount.accept} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(3)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  รออะไหล่
                </Typography>
                <Typography variant="body1">
                  {taskCount.wait} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(4)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  ส่งซ่อมภายนอก
                </Typography>
                <Typography variant="body1">
                  {taskCount.outside} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, backgroundColor: 'success.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(5)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  เสร็จสิ้น
                </Typography>
                <Typography variant="body1">
                  {taskCount.complete} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>

        <Card>
          <TableContainer component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%', p: 1 }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              รายการงานแจ้งซ่อมอุปกรณ์
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>เลขที่</TableCell>
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
                {filterTaskList.map((row) => (
                  <TableRow
                    key={row.task_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.task_id}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell>{row.department_name}</TableCell>
                    <TableCell>{row.informer_name}</TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>{(row.task_date_start).replace("T", " ").replace(".000Z", " น.")}</TableCell>
                    <TableCell>{row.operator_name}</TableCell>
                    <TableCell>{row.status_name}</TableCell>
                    <TableCell><Button variant="contained" disabled={processTaskButton} onClick={() => { handleOpenTaskDialog(row.task_id, row.level_id, row.status_id, row.operator_id) }}>ดำเนินการ</Button></TableCell>
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

      {/* ====================================ดำเนินงาน========================================= */}
      <Dialog fullWidth={120} open={processTaskDialogOpen} onClose={handleCloseProcessTaskDialog}>
        <DialogTitle>บันทึกงานแจ้งซ่อม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาระบุรายละเอียดงาน
          </DialogContentText>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Autocomplete
              value={statusName}
              onChange={(event, newValue) => {
                setStatusName(newValue);
                if (newValue !== null) {
                  setStatusId(status.find(o => o.status_name === newValue).status_id);
                }
                else {
                  setStatusId("");
                }
              }}
              id="controllable-states-status-id"
              options={Object.values(status).map((option) => option.status_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="สถานะของงาน" />}
            />
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <TextField id="phoneNo" name="phoneNo" defaultValue={phoneNo} onChange={(event) => { setPhoneNo(event.target.value) }} label="เบอร์โทรติดต่อ" />
            <TextField id="deviceId" name="deviceId" defaultValue={deviceId} onChange={(event) => { setDeviceId(event.target.value) }} label="รหัสทรัพย์สิน" />
            <TextField
              id="solution"
              name="solution"
              label="รายละเอียดของการแก้ปัญหา"
              multiline
            />
            <TextField id="serialnumber" name="serialnumber" defaultValue={serialnumber} onChange={(event) => { setSerialnumber(event.target.value) }} label="Serial Number" />
            <TextField id="cost" name="cost" defaultValue={taskCost} onChange={(event) => { setTaskCost(event.target.value) }} label="งบประมาณที่ใช้ในงาน" />
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
            <TextField
              id="taskNote"
              name="taskNote"
              label="หมายเหตุ"
              defaultValue={taskNote}
              onChange={(event) => { setTaskNote(event.target.value) }}
              multiline
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessTaskDialog}>ยกเลิก</Button>
          <Button onClick={handleProcessTask}>ดำเนินการ</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
