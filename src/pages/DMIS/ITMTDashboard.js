/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import InputMask from "react-input-mask";
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
// @mui
import {
  Card,
  Container,
  Typography,
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
  CardMedia,
  Grid,
  styled,
  alpha,
  Box,
} from '@mui/material';

import reportPDF from './components/report-pdf'
import showDetail from './components/task-detail/ShowDetail';

// ----------------------------------------------------------------------

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
      <Button variant="outlined" sx={{ ml: 1 }} startIcon={<Icon icon="ic:baseline-refresh" width="24" height="24" />} onClick={() => { window.location.reload(false); }} >แสดงทั้งหมด</Button>
    </Box>
  );
}

let pId = "";
let lvId = "";
let vId = "";
const headSname = `${localStorage.getItem('sname')} Center`;

export default function ITMTDashboard() {

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          handleOpenTaskDialog(params.row.task_id, params.row.status_id, params.row.operator_id, params.row.level_id);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return <Button variant="contained" disabled={disableProcessTaskButton || params.row.status_id_request !== null} onClick={onClick}>ดำเนินการ</Button>;
      },
    },
    {
      field: 'id',
      headerName: 'ลำดับที่',
      width: 50,
    },
    {
      field: 'task_id',
      headerName: 'เลขที่เอกสาร',
    },
    {
      field: 'level_id',
      headerName: 'ประเภทงาน',
      width: 100,
      valueGetter: (params) =>
        `${params.row.level_id === "DMIS_IT" ? "IT" : (params.row.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}`,
    },
    {
      field: 'task_issue',
      headerName: 'รายละเอียด',
      width: 210,
    },
    {
      field: 'issue_department_name',
      headerName: 'แผนก',
      width: 130,
    },
    {
      field: 'informer_firstname',
      headerName: 'ผู้แจ้ง',
      width: 100,
    },
    {
      field: 'task_date_start',
      headerName: 'วันที่แจ้ง',
      width: 110,
      valueGetter: (params) =>
        `${(params.row.task_date_start).replace("T", " ").replace(".000Z", " น.")}`,
    },
    {
      field: 'operator_firstname',
      headerName: 'ผู้รับผิดชอบ',
      width: 100,
    },
    {
      field: 'task_note',
      headerName: 'หมายเหตุ',
      width: 150,
    },
    {
      field: 'status_name',
      headerName: 'สถานะ',
      width: 130,
      valueGetter: (params) =>
        `${(params.row.task_iscomplete === null || params.row.task_iscomplete === "") ? params.row.status_id_request === null || params.row.status_id_request === "" ? params.row.status_name : `${params.row.status_name} (รออนุมัติ - ${params.row.status_name_request})` : params.row.audit_id === null || params.row.audit_id === "" ? `${params.row.status_name} (ยังไม่ตรวจรับ)` : params.row.status_id === 5 || params.row.status_id === 0 ? params.row.status_name : params.row.status_id === 3 ? `ดำเนินการเสร็จสิ้น (เปลี่ยนอะไหล่)` : `ดำเนินการเสร็จสิ้น (${params.row.status_name})`}`,
    },
  ];

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

  const [tempStatus, setTempStatus] = useState('');
  const [isStatusChange, setIsStatusChange] = useState(false);

  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');

  const [pageSize, setPageSize] = useState(10);

  const [focusTask, setFocusTask] = useState([]);
  const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(false);

  const [estimationList, setEstimationList] = useState([]);
  const [estimationId, setEstimationId] = useState('');
  const [estimationName, setEstimationName] = useState('');

  const [headStatus, setHeadStatus] = useState('งานที่ยังไม่เสร็จสิ้นทั้งหมด');
  const [dialogStatus, setDialogStatus] = useState('');

  const isSkip = (value) => value !== '';

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT"
        || token.level_list[i].level_id === "DMIS_MER" || token.level_list[i].level_id === "DMIS_ENV"
        || token.level_list[i].level_id === "DMIS_HIT" || token.level_list[i].level_id === "DMIS_ALL") {

        pId = token.personnel_id;
        lvId = token.level_list[i].level_id;
        vId = token.level_list[i].view_id;

        refreshTable();

        break;
      }
    }

    setRecvId(token.personnel_id);

  }, []);

  function refreshTable() {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getoperator/${lvId}`)
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

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettasklist/${pId}/${lvId}/${vId}/${false}`)
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

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/counttask/${pId}/${lvId}/${vId}/${false}`)
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

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcompletetasklist/${pId}/${lvId}/${vId}/${false}`)
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

      ).then(

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getestimation`)
          .then((response) => response.json())
          .then((data) => {
            setEstimationList(data);
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
  }

  useEffect(() => {

    setDisableProcessTaskButton(false);
    setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter(dt => dt.status_id === filterStatusId));

    if (filterStatusId === 1) {
      setHeadStatus("งานรอรับเรื่อง");
    }
    else if (filterStatusId === 2) {
      setHeadStatus("งานกำลังดำเนินการ");
    }
    else if (filterStatusId === 3) {
      setHeadStatus("งานรออะไหล่");
    }
    else if (filterStatusId === 4) {
      setHeadStatus("งานส่งซ่อมภายนอก");
    }
    else if (filterStatusId === 5) {
      setHeadStatus("งานดำเนินการเสร็จสิ้น");
      setDisableProcessTaskButton(true);
      setFilterTaskList(completeTaskList);
    }
    else if (filterStatusId === 6) {
      setHeadStatus("งานซื้อใหม่ทดแทน");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId])

  // ========================================================

  const setTempTask = (taskId, inputLevelId) => {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettask/${taskId}/${inputLevelId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(`data receiveeee = ${data.task}`);
        setDeviceId(data.task_device_id);
        setSerialnumber(data.task_serialnumber);
        setPhoneNo(data.task_phone_no);
        setTaskNote(data.task_note);
        setStatusId(data.status_id);
        setTempStatus(data.status_id);
        setStatusName(data.status_name);
        setTaskCost(data.task_cost);
        setCategoryId(data.category_id);
        setCategoryName(data.category_name);
        setEstimationId(data.estimation_id);
        setEstimationName(data.estimation_name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcategories/${inputLevelId}`)
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

  const handleOpenTaskDialog = (taskId, statusId, operatorId, inputLevelId) => {

    setTaskId(taskId);
    setLevelId(inputLevelId);
    setDialogStatus(statusId)
    // console.log(`statusID = ${statusId} levelID = ${levelId}`);
    if (statusId === 1) {
      setRecvName(`${operatorList.find(o => o.personnel_id === recvId).personnel_firstname} ${operatorList.find(o => o.personnel_id === recvId).personnel_lastname}`);
      setAcceptTaskDialogOpen(true);
    }
    else if (statusId === 2 || statusId === 3 || statusId === 4 || statusId === 6) {
      if (operatorId !== '' && operatorId !== null) {
        setOperatorName(`${operatorList.find(o => o.personnel_id === operatorId).personnel_firstname} ${operatorList.find(o => o.personnel_id === operatorId).personnel_lastname}`);
        setOperatorId(operatorId);
      }
      setTempTask(taskId, inputLevelId);
      // setCategories(levelId);
      setProcessTaskDialogOpen(true);
    }
  };

  const handleCloseAcceptTaskDialog = () => {
    setTaskId("");
    setLevelId("");
    setOperatorId("");
    setOperatorName("");
    setEstimationId("");
    setEstimationName("");
    setDialogStatus("");
    setAcceptTaskDialogOpen(false);
  };

  const handleCloseProcessTaskDialog = () => {
    setTaskId("");
    setLevelId("");
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
    setEstimationId("");
    setEstimationName("");
    setProcessTaskDialogOpen(false);
    setIsStatusChange(false);
  };

  const handleAcceptTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      receiver_id: recvId,
      receiver_name: recvName,
      operator_id: operatorId,
      operator_name: operatorName,
      estimation_id: estimationId,
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
          handleCloseAcceptTaskDialog();
          refreshTable();
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

  const handleProcessTask = (taskCase) => {

    if (isStatusChange && tempStatus !== 2) {
      taskCase = statusId === 5 ? "complete" : "request";
    }

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      task_solution: solution,
      task_cost: document.getElementById('cost').value,
      task_serialnumber: serialnumber,
      task_device_id: deviceId,
      status_id_request: statusId,
      operator_id: operatorId,
      category_id: categoryId,
      task_phone_no: phoneNo,
      task_note: taskNote,
      estimation_id: estimationId,
      // eslint-disable-next-line object-shorthand
      taskCase: taskCase,
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
    // console.log(`taskCase ${jsonData.taskCase}`);

    if (jsonData.status_id === "" || jsonData.status_id === null) {
      alert("กรุณาระบุสถานะของงาน");
    }

    if (jsonData.operator_id === "") {
      alert("กรุณาเลือกผู้รับผิดชอบงาน");
      return;
    }

    if (jsonData.category_id === "" || jsonData.category_id === null) {
      alert("กรุณาเลือกหมวดหมู่งาน");
      return;
    }

    if (jsonData.task_device_id !== "" && jsonData.task_device_id.length !== 18) {
      alert("กรุณาใส่รหัสทรัพย์สินให้ถูกต้อง");
      return;
    }

    if (jsonData.status_id === 5 && jsonData.task_solution === "") {
      alert("กรุณาระบุรายละเอียดการแก้ปัญหา ");
      return;
    }

    if (jsonData.status_id === 3 || jsonData.status_id === 4) {
      if (jsonData.task_note === "" || jsonData.task_note === null) {
        alert("กรุณาระบุข้อมูลในหมายเหตุ");
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
          handleCloseProcessTaskDialog();
          refreshTable();
        }
        else {
          alert('ไม่สามารถดำเนินการได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการดำเนินการ');
      });

  };

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setFocusTaskDialogOpen(true);
  }

  const handleCloseFocusTaskDialog = () => {
    setFocusTask("");
    setFocusTaskDialogOpen(false);
  }

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งปัญหาออนไลน์ - Issue Inform Online Service(IIOS)
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3, }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent='center'>
          <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'error.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(1)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_checkin.jpg`}
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
          <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(2)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_working.jpg`}
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
          <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(3)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_spare.jpg`}
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
          <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(4)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_outsource.jpg`}
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

          <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(6)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_replace.jpg`}
                  alt="checkin"
                />
                <div style={{ position: "absolute", color: "white", top: "45%", left: "65%", transform: "translateX(-50%)", }}>
                  <Typography variant="h4">
                    {taskCount.replace}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </Card>

          <Card sx={{ width: 200, mb: 1, backgroundColor: 'success.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(5)}>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={`${process.env.PUBLIC_URL}/DMIS/DMIS_complete.jpg`}
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
          <Typography
            sx={{ flex: '1 1 100%', p: 1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            รายการงานแจ้งปัญหาออนไลน์ - {headStatus}
          </Typography>

          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <StripedDataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                sx={{
                  [`& .${gridClasses.cell}`]: {
                    py: 1,
                  },
                }}
                columns={columns}
                rows={filterTaskList}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 25, 100]}
                onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns status and traderName, the other columns will remain visible
                      id: false,
                    },
                  },
                }}
                components={{ Toolbar: QuickSearchToolbar }}
              />
            </div>
          </div>

        </Card>
      </Container>


      {/* ==================================รับเรื่อง============================================= */}
      <Dialog fullWidth maxWidth="md" open={acceptTaskDialogOpen} onClose={handleCloseAcceptTaskDialog}>
        <DialogTitle>รับเรื่อง</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาระบุผู้รับผิดชอบงาน
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
            options={
              levelId === "DMIS_IT" ?
                Object.values(operatorList).map((option) => option.level_id === "DMIS_IT" || option.level_id === "DMIS_HIT" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                : levelId === "DMIS_MT" ? Object.values(operatorList).map((option) => option.level_id === "DMIS_MT" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                  : Object.values(operatorList).map((option) => option.level_id === "DMIS_MER" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
            }
            fullWidth
            required
            renderInput={(params) => <TextField {...params} label="" />}
          />
          <DialogContentText>
            กรุณาระบุการประมาณวันดำเนินงาน
          </DialogContentText>
          <Autocomplete
            value={estimationName}
            onChange={(event, newValue) => {
              setEstimationName(newValue);
              if (newValue !== null && newValue !== "") {
                setEstimationId(estimationList.find(o => o.estimation_name === newValue).estimation_id);
              }
              else {
                setEstimationId("");
              }
            }}
            id="controllable-states-estimation-id"
            options={Object.values(estimationList).map((option) => option.estimation_name)}
            fullWidth
            required
            renderInput={(params) => <TextField {...params} label="" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptTaskDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleAcceptTask}>รับเรื่อง</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ====================================ดำเนินงาน========================================= */}
      <Dialog fullWidth maxWidth="md" open={processTaskDialogOpen} onClose={handleCloseProcessTaskDialog}>
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
                  if (status.find(o => o.status_name === newValue).status_id !== tempStatus) {
                    setIsStatusChange(true);
                  }
                  else {
                    setIsStatusChange(false);
                  }
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
              renderInput={(params) => <TextField {...params} label="สถานะของงาน" />}
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
            <TextField id="phoneNo" name="phoneNo" value={phoneNo === null ? "" : phoneNo} onChange={(event) => { setPhoneNo(event.target.value) }} label="เบอร์โทรติดต่อผู้แจ้งซ่อม" />
            <InputMask
              value={(deviceId === null ? '' : deviceId)}
              onChange={(event) => { setDeviceId(event.target.value) }}
              mask="99-99-999-999-9999"
              disabled={false}
              maskChar=""
            >
              {() => <TextField id="deviceId" name="deviceId" label="รหัสทรัพย์สิน" placeholder='xx-xx-xxx-xxx-xxxx' />}
            </InputMask>
            {((dialogStatus === 3 || dialogStatus === 4 || dialogStatus === 6) && dialogStatus === statusId) || statusId === 5 ? (
              <>
                <TextField
                  id="solution"
                  name="solution"
                  label="รายละเอียดของการแก้ปัญหา"
                  value={solution === null ? "" : solution}
                  onChange={(event) => { setSolution(event.target.value) }}
                  inputProps={{ maxLength: 140 }}
                  sx={{
                    '& input:valid + fieldset': {
                      borderColor: solution ? 'green' : 'red'
                    },
                  }}
                />
              </>
            ) : (
              <>
              </>
            )}

            <TextField id="serialnumber" name="serialnumber" value={serialnumber === null ? "" : serialnumber} onChange={(event) => { setSerialnumber(event.target.value) }} label="Serial Number" />
            <TextField id="cost" name="cost" value={taskCost === null ? "" : taskCost} onChange={(event) => { setTaskCost(event.target.value) }} label="งบประมาณที่ใช้" />
            <Autocomplete
              value={estimationName === null ? "" : estimationName}
              onChange={(event, newValue) => {
                setEstimationName(newValue);
                if (newValue !== null && newValue !== "") {
                  setEstimationId(estimationList.find(o => o.estimation_name === newValue).estimation_id);
                }
                else {
                  setEstimationId("");
                }
              }}
              id="controllable-states-estimation-id"
              options={Object.values(estimationList).map((option) => option.estimation_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="การประมาณวันดำเนินงาน" />}
            />
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
              options={
                levelId === "DMIS_IT" ?
                  Object.values(operatorList).map((option) => option.level_id === "DMIS_IT" || option.level_id === "DMIS_HIT" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                  : levelId === "DMIS_MT" ? Object.values(operatorList).map((option) => option.level_id === "DMIS_MT" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                    : Object.values(operatorList).map((option) => option.level_id === "DMIS_MER" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
              }
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ผู้รับผิดชอบงาน" />}
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
              options={
                levelId === "DMIS_IT" ?
                  Object.values(categories).map((option) => option.level_id === "DMIS_IT" ? option.category_name : "").filter(isSkip)
                  : levelId === "DMIS_MT" ? Object.values(categories).map((option) => option.level_id === "DMIS_MT" ? option.category_name : "").filter(isSkip)
                    : Object.values(categories).map((option) => option.level_id === "DMIS_MER" ? option.category_name : "").filter(isSkip)
              }
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="หมวดหมู่งาน" />}
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
              label="หมายเหตุ"
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
          {(dialogStatus === 3 || dialogStatus === 4 || dialogStatus === 6) && dialogStatus === statusId ? (
            <>
              <Button variant="contained" onClick={() => { handleProcessTask("complete") }}>ปิดงาน</Button>
            </>
          ) : (
            <></>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button onClick={handleCloseProcessTaskDialog}>ยกเลิก</Button>

          <Button variant="contained" onClick={() => { handleProcessTask(dialogStatus === 2 ? "request" : "edit") }}>ดำเนินการ</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ============================รายละเอียดงานแจ้งปัญหาออนไลน์======================================= */}
      <Dialog fullWidth maxWidth="md" open={focusTaskDialogOpen} onClose={handleCloseFocusTaskDialog}>
        <DialogTitle>รายละเอียดงานแจ้งปัญหาออนไลน์</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.status_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่เอกสาร:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ประเภทงาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.level_id === "DMIS_IT" ? "IT" : (focusTask.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_date_start ? (focusTask.task_date_start).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.issue_department_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_issue}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>Serial Number:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_serialnumber}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รหัสทรัพย์สิน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_device_id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.informer_firstname} {focusTask.informer_lastname}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_phone_no}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่รับเรื่อง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_date_accept ? (focusTask.task_date_accept).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เวลาดำเนินงาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.estimation_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับเรื่อง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.receiver_firstname} {focusTask.receiver_lastname}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ดำเนินการล่าสุด:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_date_process ? (focusTask.task_date_process).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับผิดชอบ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.operator_firstname} {focusTask.operator_lastname}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_note}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่เสร็จสิ้น:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_date_end ? (focusTask.task_date_end).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดการแก้ไขปัญหา:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_solution}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.task_cost}</Item>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFocusTaskDialog}>ปิดหน้าต่าง</Button>
          <Button onClick={() => { reportPDF(focusTask) }}>ปริ้นเอกสาร</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
