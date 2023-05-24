/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// @mui
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Container,
  Typography,
  Card,
  styled,
  alpha,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';

import reportPDF from './components/report-pdf'

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

let lvId = "";
const headSname = `${localStorage.getItem('sname')} Center`;

export default function permitdashboard() {

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          handleOpenPermitTaskDialog(params.row.task_id, params.row.level_id, params.row.status_id_request, params.row.status_id_request === 5 && params.row.category_id === 1, params.row.category_id, params.row.category_name);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return <Button variant="contained" onClick={onClick}>ดำเนินการ</Button>;
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
      headerName: 'ปัญหา',
      width: 150,
    },
    {
      field: 'task_solution',
      headerName: 'การแก้ไข',
      width: 150,
    },
    {
      field: 'task_note',
      headerName: 'หมายเหตุ',
      width: 150,
    },
    {
      field: 'issue_department_name',
      headerName: 'แผนก',
      width: 130,
    },
    {
      field: 'status_name_request',
      headerName: 'สถานะที่ขออนุมัติ',
      width: 125,
      valueGetter: (params) =>
        `${params.row.status_id_request === 2 && params.row.category_id === 1 ? "กำลังดำเนินการ (HIMS)" :
          params.row.status_id_request === 5 && params.row.category_id === 1 ? "ดำเนินการเสร็จสิ้น (ขอวางโปรแกรม)" : params.row.status_name_request}`,
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

  ];

  // =========================================================

  const [pageSize, setPageSize] = useState(10);

  const [permitTaskList, setPermitTaskList] = useState([]);

  const [focusTask, setFocusTask] = useState('');
  const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(false);

  const [taskId, setTaskId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [permitId, setPermitId] = useState('');
  const [statusIdRequest, setStatusIdRequest] = useState('');
  const [pChange, setPChange] = useState(false);

  const [permitTaskDialogOpen, setPermitTaskDialogOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const isSkip = (value) => value !== '';

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));
    setPermitId(token.personnel_id);
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_USER" ||
        token.level_list[i].level_id === "DMIS_IT" ||
        token.level_list[i].level_id === "DMIS_MT" ||
        token.level_list[i].level_id === "DMIS_MER" ||
        token.level_list[i].level_id === "DMIS_ENV" ||
        token.level_list[i].level_id === "DMIS_HIT" ||
        token.level_list[i].level_id === "DMIS_ALL") {
        lvId = token.level_list[i].level_id;
        refreshTable();
        break;
      }
    }
  }, [])

  function refreshTable() {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getpermittasklist/${lvId}`)
      .then((response) => response.json())
      .then((data) => {
        setPermitTaskList(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled")
        }
        else {
          console.error('Error:', error);
        }
      });
  }

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setFocusTaskDialogOpen(true);
  }

  const handleCloseFocusTaskDialog = () => {
    setFocusTask("");
    setFocusTaskDialogOpen(false);
  }

  const handleOpenPermitTaskDialog = (taskId, levelId, statusIdRequest, isPChange, categoryId, categoryName) => {

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcategories/${levelId}`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setTaskId(taskId);
    setLevelId(levelId);
    setStatusIdRequest(statusIdRequest);
    setPChange(isPChange);
    setCategoryId(categoryId);
    setCategoryName(categoryName)
    setPermitTaskDialogOpen(true);
  }

  const handleClosePermitTaskDialog = () => {
    setTaskId('');
    setLevelId('');
    setStatusIdRequest('');
    setPChange('');
    setCategoryId('');
    setCategoryName('');
    setCategories([]);
    setPermitTaskDialogOpen(false);
  }

  const handlePermitTask = (permitCase) => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      permit_id: permitId,
      status_id_request: statusIdRequest,
      taskCase: permitCase,
      category_id: categoryId,
    };

    if ((jsonData.category_id === "" || jsonData.category_id === null) && (permitCase === "pConfirm" || permitCase === "permit")) {
      alert("กรุณาเลือกหมวดหมู่งาน");
      return;
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
          handleClosePermitTaskDialog();
          refreshTable();
        }
        else {
          alert('ไม่สามารถยืนยันการตรวจสอบงานได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการยืนยันตรวจสอบงาน');
      });
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
        <Card>

          <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div" >
            รายการงานรอตรวจสอบ
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
                rows={permitTaskList}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 25, 100]}
                onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
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
                <Item sx={{ textAlign: 'right' }}>หมวดหมู่งาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{focusTask.category_name}</Item>
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

      {/* ==================================อนุมัติงาน============================================= */}
      <Dialog fullWidth maxWidth="md" open={permitTaskDialogOpen} onClose={handleClosePermitTaskDialog}>
        <DialogTitle>อนุมัติงาน</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการอนุมัติงานนี้ใช่หรือไม่
          </DialogContentText>
          <br />
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
        </DialogContent>
        <DialogActions>
          {
            statusIdRequest === 3 || statusIdRequest === 4 || statusIdRequest === 6 ?
              <Box alignItems="flex-start">
                <Button variant="contained" onClick={() => handlePermitTask("permitEnd")}>ส่งมอบให้ผู้แจ้งดำเนินการ</Button>
              </Box>
              :
              <>
              </>
          }
          <div style={{ flex: '1 0 0' }} />
          <Button onClick={handleClosePermitTaskDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={() => handlePermitTask(pChange ? "pConfirm" : "permit")}>อนุมัติ</Button>
          <Button variant="contained" color="error" onClick={() => handlePermitTask(pChange ? "pReject" : "reject")}>ไม่อนุมัติ</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}