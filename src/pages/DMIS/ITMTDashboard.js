/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import InputMask from "react-input-mask";
// @mui
import {
  Card,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Autocomplete,
  Stack,
  Divider,
  CardActionArea,
  TablePagination,
  CardMedia,
  Grid,
} from '@mui/material';
import dmisCheckinBtn from 'src/img/DMIS/DMIS_checkin.jpg';
import dmisCompleteBtn from 'src/img/DMIS/DMIS_complete.jpg';
import dmisOutSourceBtn from 'src/img/DMIS/DMIS_outsource.jpg';
import dmisSpareBtn from 'src/img/DMIS/DMIS_spare.jpg';
import dmisWorkingBtn from 'src/img/DMIS/DMIS_working.jpg';
// ----------------------------------------------------------------------

export default function ITMTDashboard() {

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
  const [recvName, setRecvName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [taskNote, setTaskNote] = useState('');
  const [status, setStatus] = useState([]);
  const [statusId, setStatusId] = useState('');
  const [statusName, setStatusName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [solution, setSolution] = useState('');
  const [serialnumber, setSerialnumber] = useState('');
  const [taskCost, setTaskCost] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [taskCount, setTaskCount] = useState([]);
  const [disableProcessTaskButton, setDisableProcessTaskButton] = useState(false);

  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  useEffect(() => {

    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const signal = controller.signal;
    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT" || token.level_list[i].level_id === "DMIS_MER") {

        setLevelId(token.level_list[i].level_id);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getoperator/${token.level_list[i].level_id}`, { signal })
          .then((response) => response.json())
          .then((data) => {
            setOperatorList(data);
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              console.log("cancelled")
            }
            else {
              console.error('Error:', error);
            }
          })

          .then(

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${false}`, { signal })
              .then((response) => response.json())
              .then((data) => {
                setTaskList(data);
                setFilterTaskList(data);
              })
              .catch((error) => {
                if (error.name === "AbortError") {
                  console.log("cancelled")
                }
                else {
                  console.error('Error:', error);
                }
              })

          ).then(

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/counttask/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${false}`, { signal })
              .then((response) => response.json())
              .then((data) => {
                setTaskCount(data);
              })
              .catch((error) => {
                if (error.name === "AbortError") {
                  console.log("cancelled")
                }
                else {
                  console.error('Error:', error);
                }
              })

          ).then(

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcompletetasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${false}`, { signal })
              .then((response) => response.json())
              .then((data) => {
                setCompleteTaskList(data);
              })
              .catch((error) => {
                if (error.name === "AbortError") {
                  console.log("cancelled")
                }
                else {
                  console.error('Error:', error);
                }
              })

          )

        break;
      }
    }

    setRecvId(token.personnel_id);

    return () => {
      controller.abort();
    }

  }, []);

  useEffect(() => {
    if (filterStatusId === 5) {
      setDisableProcessTaskButton(true);
      setFilterTaskList(completeTaskList);
    }
    else {
      setDisableProcessTaskButton(false);
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter(dt => dt.status_id === filterStatusId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId])

  // ========================================================

  const setTempTask = (taskId) => {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettask/${taskId}/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(`data receiveeee = ${data.task}`);
        setDeviceId(data.task_device_id);
        setSerialnumber(data.task_serialnumber);
        setPhoneNo(data.task_phone_no);
        setTaskNote(data.task_note);
        setStatusId(data.status_id);
        setStatusName(data.status_name);
        setTaskCost(data.task_cost);
        setCategoryId(data.category_id);
        setCategoryName(data.category_name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcategories/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getstatus`)
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleOpenTaskDialog = (taskId, statusId, operatorId) => {

    setTaskId(taskId);
    // setLevelId(levelId);
    // console.log(`statusID = ${statusId} levelID = ${levelId}`);
    if (statusId === 1) {
      setRecvName(`${operatorList.find(o => o.personnel_id === recvId).personnel_firstname} ${operatorList.find(o => o.personnel_id === recvId).personnel_lastname}`);
      setAcceptTaskDialogOpen(true);
    }
    else if (statusId === 2 || statusId === 3 || statusId === 4) {
      if (operatorId !== '' && operatorId !== null) {
        setOperatorName(`${operatorList.find(o => o.personnel_id === operatorId).personnel_firstname} ${operatorList.find(o => o.personnel_id === operatorId).personnel_lastname}`);
        setOperatorId(operatorId);
      }
      setTempTask(taskId);
      // setCategories(levelId);
      setProcessTaskDialogOpen(true);
    }
  };

  const handleCloseAcceptTaskDialog = () => {
    setTaskId("");
    setOperatorId("");
    setOperatorName("");
    setAcceptTaskDialogOpen(false);
  };

  const handleCloseProcessTaskDialog = () => {
    setTaskId("");
    setOperatorId("");
    setOperatorName("");
    setPhoneNo("");
    setDeviceId("");
    setSolution("");
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
      receiver_name: recvName,
      operator_id: operatorId,
      operator_name: operatorName,
    };

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/accepttask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('?????????????????????????????????????????????');
          handleCloseAcceptTaskDialog();
          window.location.reload(false);
        }
        else {
          alert('??????????????????????????????????????????????????????????????????????????????');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('????????????????????????????????????????????????????????????????????????????????????');
      });

  }

  const handleProcessTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      task_solution: solution,
      task_cost: document.getElementById('cost').value,
      task_serialnumber: serialnumber,
      task_device_id: deviceId,
      status_id: statusId,
      operator_id: operatorId,
      category_id: categoryId,
      task_phone_no: phoneNo,
      task_note: taskNote,
    }

    // console.log(`task_id ${jsonData.task_id}`);
    // console.log(`level_id ${jsonData.level_id}`);
    // console.log(`task_solution ${jsonData.task_solution}`);
    // console.log(`task_cost ${jsonData.task_cost}`);
    // console.log(`task_serialnumber ${jsonData.task_serialnumber}`);
    // console.log(`task_device_id ${jsonData.task_device_id}`);
    // console.log(`status_id ${jsonData.status_id}`);
    // console.log(`operator_id ${jsonData.operator_id}`);
    // console.log(`category_id ${jsonData.category_id}`);
    // console.log(`task_phone_no ${jsonData.task_phone_no}`);
    // console.log(`task_note ${jsonData.task_note}`);

    if (jsonData.status_id === "" || jsonData.status_id === null) {
      alert("????????????????????????????????????????????????????????????");
    }

    if (jsonData.operator_id === "") {
      alert("???????????????????????????????????????????????????????????????????????????");
      return;
    }

    if (jsonData.category_id === "" || jsonData.category_id === null) {
      alert("???????????????????????????????????????????????????????????????");
      return;
    }

    if (jsonData.task_device_id !== "" && jsonData.task_device_id.length !== 18) {
      alert("?????????????????????????????????????????????????????????????????????????????????????????????");
      return;
    }

    if (jsonData.status_id === 5 && jsonData.task_solution === "") {
      alert("?????????????????????????????????????????????????????????????????????????????????????????? ");
      return;
    }

    if (jsonData.status_id === 3 || jsonData.status_id === 4) {
      if (jsonData.task_note === "" || jsonData.task_note === null) {
        alert("???????????????????????????????????????????????????????????????????????????");
        return;
      }
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/processtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('??????????????????????????????????????????????????????');
          handleCloseProcessTaskDialog();
          window.location.reload(false);
        }
        else {
          alert('???????????????????????????????????????????????????????????????');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('????????????????????????????????????????????????????????????????????????????????????');
      });

  };

  return (
    <>
      <Helmet>
        <title> ????????????????????????????????????????????????????????? | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ????????????????????????????????????????????????????????? - Device Maintenance Inform Service(DMIS)
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent='center'>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'error.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(1)}>

              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={dmisCheckinBtn}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.inform}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(2)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={dmisWorkingBtn}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.accept}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(3)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={dmisSpareBtn}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.wait}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(4)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={dmisOutSourceBtn}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.outside}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, backgroundColor: 'success.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(5)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={dmisCompleteBtn}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.complete}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>
        </Grid>

        <Card>
          <TableContainer component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%', p: 1 }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              ????????????????????????????????????????????????????????????????????????
            </Typography>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>??????????????????</TableCell>
                  <TableCell>??????????????????????????????</TableCell>
                  <TableCell>????????????</TableCell>
                  <TableCell>?????????????????????</TableCell>
                  <TableCell>??????????????????????????????</TableCell>
                  <TableCell>????????????????????????????????????</TableCell>
                  <TableCell>????????????????????????</TableCell>
                  <TableCell>???????????????</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(filterTaskList).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow
                    key={row.task_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 100 }}>{row.task_id}</TableCell>
                    <TableCell sx={{ maxWidth: 250 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 130 }} >{row.issue_department_name}</TableCell>
                    <TableCell sx={{ maxWidth: 100 }} >{row.informer_firstname}</TableCell>
                    <TableCell sx={{ maxWidth: 110 }}>{(row.task_date_start).replace("T", " ").replace(".000Z", " ???.")}</TableCell>
                    <TableCell sx={{ maxWidth: 50 }} >{row.operator_firstname}</TableCell>
                    <TableCell sx={{ maxWidth: 150 }} >
                      {row.task_note}
                    </TableCell>
                    <TableCell>{row.status_name}</TableCell>
                    <TableCell><Button variant="contained" disabled={disableProcessTaskButton} onClick={() => { handleOpenTaskDialog(row.task_id, row.status_id, row.operator_id) }}>???????????????????????????</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 25, 100]}
            count={filterTaskList.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


      {/* ==================================???????????????????????????============================================= */}
      <Dialog fullWidth maxWidth="md" open={acceptTaskDialogOpen} onClose={handleCloseAcceptTaskDialog}>
        <DialogTitle>???????????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ????????????????????????????????????????????????????????????????????????
          </DialogContentText>
          <Autocomplete
            value={operatorName}
            onChange={(event, newValue) => {
              setOperatorName(newValue);
              if (newValue !== null && newValue !== "") {
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
          <Button onClick={handleCloseAcceptTaskDialog}>??????????????????</Button>
          <Button variant="contained" onClick={handleAcceptTask}>???????????????????????????</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ====================================???????????????????????????========================================= */}
      <Dialog fullWidth maxWidth="md" open={processTaskDialogOpen} onClose={handleCloseProcessTaskDialog}>
        <DialogTitle>???????????????????????????????????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ??????????????????????????????????????????????????????????????????
          </DialogContentText>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Autocomplete
              value={statusName}
              onChange={(event, newValue) => {
                setStatusName(newValue);
                if (newValue !== null) {
                  setStatusId(status.find(o => o.status_name === newValue).status_id);
                  if (status.find(o => o.status_name === newValue).status_id !== 5) {
                    setSolution('');
                  }
                }
                else {
                  setStatusId("");
                }
              }}
              id="controllable-states-status-id"
              options={Object.values(status).map((option) => option.status_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="?????????????????????????????????" />}
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: statusName ? 'green' : 'red'
                  }
                }
              }}
            />
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <TextField id="phoneNo" name="phoneNo" value={phoneNo === null ? "" : phoneNo} onChange={(event) => { setPhoneNo(event.target.value) }} label="??????????????????????????????????????????" />
            <InputMask
              value={(deviceId === null ? '' : deviceId)}
              onChange={(event) => { setDeviceId(event.target.value) }}
              mask="99-99-999-999-9999"
              disabled={false}
              maskChar=""
            >
              {() => <TextField id="deviceId" name="deviceId" label="???????????????????????????????????????" placeholder='xx-xx-xxx-xxx-xxxx' />}
            </InputMask>
            <TextField
              id="solution"
              name="solution"
              label="????????????????????????????????????????????????????????????????????????"
              value={solution === null ? "" : solution}
              onChange={(event) => { setSolution(event.target.value) }}
              inputProps={{ maxLength: 140 }}
              disabled={!(statusId === 5)}
              sx={{
                '& input:valid + fieldset': {
                  borderColor: solution ? 'green' : 'red'
                },
              }}
            />
            <TextField id="serialnumber" name="serialnumber" value={serialnumber === null ? "" : serialnumber} onChange={(event) => { setSerialnumber(event.target.value) }} label="Serial Number" />
            <TextField id="cost" name="cost" value={taskCost === null ? "" : taskCost} onChange={(event) => { setTaskCost(event.target.value) }} label="??????????????????????????????????????????" />
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
              renderInput={(params) => <TextField {...params} label="?????????????????????????????????????????????" />}
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: operatorName ? 'green' : 'red'
                  }
                }
              }}
            />
            <Autocomplete
              value={categoryName === null ? "" : categoryName}
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
              renderInput={(params) => <TextField {...params} label="?????????????????????????????????" />}
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: categoryName ? 'green' : 'red'
                  }
                }
              }}
            />
            <TextField
              id="taskNote"
              name="taskNote"
              label="????????????????????????"
              value={taskNote === null ? "" : taskNote}
              onChange={(event) => { setTaskNote(event.target.value) }}
              inputProps={{ maxLength: 140 }}
              sx={{
                '& input:valid + fieldset': {
                  borderColor: statusId === 3 || statusId === 4 ? (taskNote ? 'green' : 'red') : ''
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessTaskDialog}>??????????????????</Button>
          <Button variant="contained" onClick={handleProcessTask}>???????????????????????????</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
