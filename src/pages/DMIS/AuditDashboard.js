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
  Stack,
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

export default function auditdashboard() {

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          handleOpenAuditTaskDialog(params.row.task_id, params.row.level_id, params.row.status_id, params.row.audit_comment);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return <Button variant="contained" onClick={onClick}>ตรวจรับ</Button>;
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
      field: 'audit_comment',
      headerName: 'การตรวจรับ',
      width: 150,
    },
    {
      field: 'issue_department_name',
      headerName: 'แผนก',
      width: 130,
    },
    {
      field: 'status_name',
      headerName: 'สถานะ',
      width: 125,
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

  const [auditTaskList, setAuditTaskList] = useState([]);
  const [filterAuditTaskList, setFilterAuditTaskList] = useState([]);
  const [showReplacement, setShowReplacement] = useState(false);

  const [focusTask, setFocusTask] = useState('');
  const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(false);

  const [taskId, setTaskId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [auditId, setAuditId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [auditComment, setAuditComment] = useState('');

  const [auditTaskDialogOpen, setAuditTaskDialogOpen] = useState(false);

  useEffect(() => {

    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const signal = controller.signal;
    const token = jwtDecode(localStorage.getItem('token'));
    setAuditId(token.personnel_id);
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_USER" ||
        token.level_list[i].level_id === "DMIS_IT" ||
        token.level_list[i].level_id === "DMIS_MT" ||
        token.level_list[i].level_id === "DMIS_MER" ||
        token.level_list[i].level_id === "DMIS_ENV" ||
        token.level_list[i].level_id === "DMIS_HIT" ||
        token.level_list[i].level_id === "DMIS_ALL") {
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getaudittasklist/${token.personnel_id}/${token.level_list[i].view_id}`, { signal })
          .then((response) => response.json())
          .then((data) => {
            setAuditTaskList(data);
            setFilterAuditTaskList(data.filter(dt => dt.status_id !== 6));
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              console.log("cancelled")
            }
            else {
              console.error('Error:', error);
            }
          })
        break;
      }
    }
  }, [])

  useEffect(() => {
    if (showReplacement) {
      setFilterAuditTaskList(auditTaskList.filter(dt => dt.status_id === 6));
    }
    else {
      setFilterAuditTaskList(auditTaskList.filter(dt => dt.status_id !== 6));
    }
  }, [showReplacement])

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setFocusTaskDialogOpen(true);
  }

  const handleCloseFocusTaskDialog = () => {
    setFocusTask("");
    setFocusTaskDialogOpen(false);
  }

  const handleOpenAuditTaskDialog = (taskId, levelId, statusId, auditComment) => {
    setTaskId(taskId);
    setLevelId(levelId);
    setStatusId(statusId);
    setAuditComment(auditComment);
    setAuditTaskDialogOpen(true);
  }

  const handleCloseAuditTaskDialog = () => {
    setTaskId('');
    setLevelId('');
    setStatusId('');
    setAuditComment('');
    setAuditTaskDialogOpen(false);
  }

  const handleAuditTaskComment = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      audit_comment: auditComment,
      taskCase: "comment",
    };

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
          alert('บันทึกหมายเหตุการตรวจรับงานสำเร็จ');
          handleCloseAuditTaskDialog();
          window.location.reload(false);
        }
        else {
          alert('ไม่สามารถบันทึกหมายเหตุการตรวจรับงานได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกหมายเหตุการตรวจรับงาน');
      });

  }

  const handleAuditTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      audit_id: auditId,
      status_id: statusId,
      audit_comment: auditComment,
      taskCase: "audit",
    };

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
          alert('ตรวจรับงานสำเร็จ');
          handleCloseAuditTaskDialog();
          window.location.reload(false);
        }
        else {
          alert('ไม่สามารถตรวจรับงานได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการตรวจรับงาน');
      });
  }

  const handleShowReplacement = () => {
    setShowReplacement(!showReplacement);
  }

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">

        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งปัญหาออนไลน์ - Issue Inform Online Service(IIOS)
        </Typography>
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div" >
              รายการงานรอตรวจรับ - งานที่{showReplacement ? "ซื้อใหม่ทดแทน" : "ดำเนินการเสร็จสิ้น"}
            </Typography>
            <Button sx={{ mt: 1, mr: 1 }} variant="contained" onClick={handleShowReplacement}>
              แสดงงาน{showReplacement ? "ที่ดำเนินการเสร็จสิ้น" : "ซื้อใหม่ทดแทน"}
            </Button>
          </Stack>
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
                rows={filterAuditTaskList}
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
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.status_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่เอกสาร:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_id}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ประเภทงาน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.level_id === "DMIS_IT" ? "IT" : (focusTask.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_start ? (focusTask.task_date_start).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.issue_department_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_issue}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>Serial Number:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_serialnumber}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รหัสทรัพย์สิน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_device_id}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.informer_firstname} {focusTask.informer_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_phone_no}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่รับเรื่อง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_accept ? (focusTask.task_date_accept).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เวลาดำเนินงาน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.estimation_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับเรื่อง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.receiver_firstname} {focusTask.receiver_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ดำเนินการล่าสุด:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_process ? (focusTask.task_date_process).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับผิดชอบ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.operator_firstname} {focusTask.operator_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_note}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่เสร็จสิ้น:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_end ? (focusTask.task_date_end).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดการแก้ไขปัญหา:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_solution}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
              </Grid>
              <Grid xs={8}>
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

      {/* ==================================ตรวจรับงาน============================================= */}
      <Dialog fullWidth maxWidth="md" open={auditTaskDialogOpen} onClose={handleCloseAuditTaskDialog}>
        <DialogTitle>ตรวจรับงาน</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการตรวจรับงานนี้ใช่หรือไม่
          </DialogContentText>
          <TextField id="auditComment" name="auditComment"
            value={auditComment === null ? "" : auditComment}
            onChange={(event) => { setAuditComment(event.target.value) }}
            fullWidth
            sx={{ mt: 1 }}
            label="หมายเหตุการตรวจรับ" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAuditTaskDialog} >ยกเลิก</Button>
          <Button variant="contained" onClick={handleAuditTaskComment} >บันทึกหมายเหตุ</Button>
          <Button variant="contained" onClick={handleAuditTask} >ยืนยันการตรวจรับงาน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

    </>
  );
}