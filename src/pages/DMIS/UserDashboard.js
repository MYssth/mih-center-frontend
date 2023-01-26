/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
// @mui
import {
  Container,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  styled,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

import reportPDF from './components/report-pdf'

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

const columns = [

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
    width: 250,
  },
  {
    field: 'issue_department_name',
    headerName: 'แผนก',
    width: 150,
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
    field: 'estimation_name',
    headerName: 'เวลาดำเนินงาน',
    width: 120,
  },
  {
    field: 'status_name',
    headerName: 'สถานะ',
    width: 130,
    valueGetter: (params) =>
      `${(params.row.task_iscomplete === null || params.row.task_iscomplete === "") ? params.row.status_id_request === null || params.row.status_id_request === "" ? params.row.status_name : `${params.row.status_name} (รออนุมัติ)` : params.row.audit_id === null || params.row.audit_id === "" ? `${params.row.status_name} (ยังไม่ตรวจรับ)` : params.row.status_id === 5 ? params.row.status_name : `${params.row.status_name} (เสร็จสิ้น)`}`,
  },
  {
    field: 'task_note',
    headerName: 'หมายเหตุ',
    width: 180,
  },

];

export default function UserDashboard() {

  const [taskList, setTaskList] = useState([]);
  const [completeTaskList, setCompleteTaskList] = useState([]);
  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');
  const [taskCount, setTaskCount] = useState([]);

  const [pageSize, setPageSize] = useState(10);

  const [focusTask, setFocusTask] = useState([]);
  const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(false);

  useEffect(() => {

    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const signal = controller.signal;
    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_USER" ||
        token.level_list[i].level_id === "DMIS_IT" ||
        token.level_list[i].level_id === "DMIS_MT" ||
        token.level_list[i].level_id === "DMIS_MER" ||
        token.level_list[i].level_id === "DMIS_ENV" ||
        token.level_list[i].level_id === "DMIS_HIT" ||
        token.level_list[i].level_id === "DMIS_ALL") {
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${true}`, { signal })
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
          }

          ).then(

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/counttask/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${true}`, { signal })
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

            fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcompletetasklist/${token.personnel_id}/${token.level_list[i].level_id}/${token.level_list[i].view_id}/${true}`, { signal })
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

    return () => {
      controller.abort();
    }

  }, []);

  useEffect(() => {
    if (filterStatusId === 5) {
      setFilterTaskList(completeTaskList);
    }
    else {
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter(dt => dt.status_id === filterStatusId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId])

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
        <title> ระบบแจ้งปัญหาออนไลน์ | MIH Center </title>
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
            sx={{ ml: 1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            รายการงานแจ้งปัญหาออนไลน์
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
          <Button onClick={() => {reportPDF(focusTask)}}>ปริ้นเอกสาร</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}
    </>
  );
}
