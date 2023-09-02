import { Helmet } from 'react-helmet-async';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// @mui
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Typography, Card, styled, alpha, Box, Button, Grid, Stack, CardActionArea, CardMedia } from '@mui/material';
import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { IIOSTaskDetail } from './compenents/dialogs/taskdetails';
import { IIOSTaskInfr } from './compenents/dialogs/forms';

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

let pId = '';
let viewId = '';
const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

function IIOSInformerTask() {
  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          setFocusTask(params.row);
          setOpenTaskInfr(true);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return (
          <Button variant="contained" onClick={onClick}>
            ตรวจรับ
          </Button>
        );
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
        `${
          params.row.level_id === 'DMIS_IT' ? 'IT' : params.row.level_id === 'DMIS_MT' ? 'ซ่อมบำรุง' : 'เครื่องมือแพทย์'
        }`,
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
      valueGetter: (params) => `${params.row.task_date_start.replace('T', ' ').replace('.000Z', ' น.')}`,
    },
    {
      field: 'operator_firstname',
      headerName: 'ผู้รับผิดชอบ',
      width: 100,
    },
    {
      field: 'task_device_id',
      headerName: 'รหัสทรัพย์สิน',
      width: 150,
    },
  ];

  // =========================================================

  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [openTaskInfr, setOpenTaskInfr] = useState(false);

  const [informerTaskList, setInformerTaskList] = useState([]);
  const [filterInformerTaskList, setFilterInformerTaskList] = useState([]);

  const [focusTask, setFocusTask] = useState('');
  const [auditId, setAuditId] = useState('');

  const [filterStatusId, setFilterStatusId] = useState('all');
  const [taskCount, setTaskCount] = useState([]);

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));
    pId = token.psn_id;

    setAuditId(token.psn_id);
    for (let i = 0; i < token.lv_list.length; i += 1) {
      if (token.lv_list[i].mihapp_id === 'DMIS') {
        viewId = token.lv_list[i].view_id;
        refreshTable();
        break;
      }
    }
  }, []);

  useEffect(() => {
    setFilterInformerTaskList(
      filterStatusId === 'all' ? informerTaskList : informerTaskList.filter((dt) => dt.status_id === filterStatusId)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId]);

  function refreshTable() {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getinformertasklist/${pId}/${viewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInformerTaskList(data);
        setFilterInformerTaskList(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/countinfortask/${pId}/${viewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
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
      });
  }

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <IIOSSidebar name="informertask" openNav={open} onCloseNav={() => setOpen(false)} />

      <IIOSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

      <IIOSTaskInfr
        openDialg={openTaskInfr}
        onCloseDialg={() => {
          setOpenTaskInfr(false);
          refreshTable();
        }}
        data={focusTask}
        auditId={auditId}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>งานที่ต้องดำเนินการเอง</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/iiosuserdashboard">หน้าหลักระบบแจ้งปัญหา</a>
              </li>
              <li className="breadcrumb-item my-2">งานที่ต้องดำเนินการเอง</li>
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
                  </Grid>

                  <Card>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                        งานที่ต้องดำเนินการเอง
                      </Typography>
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
                          rows={filterInformerTaskList}
                          pageSize={pageSize}
                          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          onCellDoubleClick={(params) => {
                            setFocusTask(params.row);
                            setOpenTaskDetail(true);
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
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default IIOSInformerTask;
