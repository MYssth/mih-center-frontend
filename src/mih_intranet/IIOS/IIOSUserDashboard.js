/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
// @mui
import { Typography, Card, CardActionArea, CardMedia, Grid, styled, alpha, Button, Box } from '@mui/material';

import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { IIOSTaskDetail } from './compenents/dialogs/taskdetails';

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
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
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
      <Button
        variant="outlined"
        sx={{ ml: 1 }}
        startIcon={<Icon icon="ic:baseline-refresh" width="24" height="24" />}
        onClick={() => {
          window.location.reload(false);
        }}
      >
        แสดงทั้งหมด
      </Button>
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
      `${
        params.row.level_id === 'DMIS_IT' ? 'IT' : params.row.level_id === 'DMIS_MT' ? 'ซ่อมบำรุง' : 'เครื่องมือแพทย์'
      }`,
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
    valueGetter: (params) => `${params.row.task_date_start.replace('T', ' ').replace('.000Z', ' น.')}`,
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
      `${
        params.row.status_id === 0
          ? params.row.status_name
          : params.row.task_iscomplete === null || params.row.task_iscomplete === ''
          ? params.row.status_id_request === null || params.row.status_id_request === ''
            ? params.row.status_name
            : `${params.row.status_name} (รออนุมัติ - ${params.row.status_name_request})`
          : params.row.audit_id === null || params.row.audit_id === ''
          ? `${params.row.status_name} (ยังไม่ตรวจรับ)`
          : params.row.status_id === 5
          ? params.row.status_name
          : params.row.status_id === 3
          ? `ดำเนินการเสร็จสิ้น (เปลี่ยนอะไหล่)`
          : `ดำเนินการเสร็จสิ้น (${params.row.status_name})`
      }`,
  },
  {
    field: 'task_note',
    headerName: 'หมายเหตุ',
    width: 180,
  },
  {
    field: 'task_device_id',
    headerName: 'รหัสทรัพย์สิน',
    width: 150,
  },
];

let rToken = '';

function IIOSUserDashboard() {
  const [taskList, setTaskList] = useState([]);
  const [completeTaskList, setCompleteTaskList] = useState([]);
  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');
  const [taskCount, setTaskCount] = useState([]);

  const [pageSize, setPageSize] = useState(10);

  const [focusTask, setFocusTask] = useState([]);

  const [open, setOpen] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);

  const [headStatus, setHeadStatus] = useState('งานที่ยังไม่เสร็จสิ้นทั้งหมด');
  const [version, setVersion] = useState('');

  const [noti, setNoti] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      const token = jwtDecode(localStorage.getItem('token'));
      for (let i = 0; i < token.lv_list.length; i += 1) {
        if (token.lv_list[i].mihapp_id === 'DMIS') {
          fetch(
            `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/gettasklist/${token.psn_id}/${
              token.lv_list[i].lv_id
            }/${token.lv_list[i].view_id}/${true}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${rToken}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              setTaskList(data);
              setFilterTaskList(data);
            })
            .catch((error) => {
              if (error.name === 'AbortError') {
                console.log('cancelled');
              } else {
                console.error('Error:', error);
              }
            })
            .then(
              fetch(
                `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/counttask/${token.psn_id}/${
                  token.lv_list[i].lv_id
                }/${token.lv_list[i].view_id}/${true}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${rToken}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  setTaskCount(data);
                })
                .catch((error) => {
                  if (error.name === 'AbortError') {
                    console.log('cancelled');
                  } else {
                    console.error('Error:', error);
                  }
                })
            )
            .then(
              fetch(
                `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getcompletetasklist/${token.psn_id}/${
                  token.lv_list[i].lv_id
                }/${token.lv_list[i].view_id}/${true}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${rToken}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  setCompleteTaskList(data);
                })
                .catch((error) => {
                  if (error.name === 'AbortError') {
                    console.log('cancelled');
                  } else {
                    console.error('Error:', error);
                  }
                })
            );

          fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getversion`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${rToken}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setVersion(data);
            })
            .catch((error) => {
              if (error.name === 'AbortError') {
                console.log('cancelled');
              } else {
                console.error('Error:', error);
              }
            });

          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (filterStatusId === 1) {
      setHeadStatus('งานรอรับเรื่อง');
    } else if (filterStatusId === 2) {
      setHeadStatus('งานกำลังดำเนินการ');
    } else if (filterStatusId === 3) {
      setHeadStatus('งานรออะไหล่');
    } else if (filterStatusId === 4) {
      setHeadStatus('งานส่งซ่อมภายนอก');
    } else if (filterStatusId === 5) {
      setHeadStatus('งานดำเนินการเสร็จสิ้น');
      setFilterTaskList(completeTaskList);
    } else if (filterStatusId === 6) {
      setHeadStatus('งานซื้อใหม่ทดแทน');
    }
    if (filterStatusId !== 5) {
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter((dt) => dt.status_id === filterStatusId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId]);

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setOpenTaskDetail(true);
  };

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | MIH Center </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <IIOSSidebar name="userdashboard" openNav={open} onCloseNav={() => setOpen(false)} notiTrigger={noti} />

      <IIOSTaskDetail
        openDialg={openTaskDetail}
        onCloseDialg={() => {
          setOpenTaskDetail(false);
          setNoti(!noti);
        }}
        data={focusTask}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>ระบบแจ้งปัญหาออนไลน์ - Issue Inform Online Service (IIOS) version: {version}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">หน้าหลักระบบแจ้งปัญหา</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Grid container columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center">
                    <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'error.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(1)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_checkin.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.inform}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                    <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(2)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_working.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.accept}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                    <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(3)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_spare.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.wait}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                    <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(4)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_outsource.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.outside}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>

                    <Card sx={{ width: 200, mr: 1, mb: 1, backgroundColor: 'warning.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(6)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_replace.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.replace}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>

                    <Card sx={{ width: 200, mb: 1, backgroundColor: 'success.main' }}>
                      <CardActionArea onClick={() => setFilterStatusId(5)}>
                        <div style={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={`${process.env.PUBLIC_URL}/DMIS/DMIS_complete.jpg`}
                            alt="checkin"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              color: 'white',
                              top: '45%',
                              left: '65%',
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <Typography variant="h4">{taskCount.complete}</Typography>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
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
                        onCellDoubleClick={(params) => {
                          handleOpenFocusTaskDialog(params.row);
                        }}
                        hideFooterSelectedRowCount
                        initialState={{
                          columns: {
                            columnVisibilityModel: {
                              // Hide columns status and traderName, the other columns will remain visible
                              id: false,
                              task_device_id: false,
                            },
                          },
                        }}
                        components={{ Toolbar: QuickSearchToolbar }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default IIOSUserDashboard;
