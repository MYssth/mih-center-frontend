/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
// @mui
import { Card, Typography, Button, CardActionArea, CardMedia, Grid, styled, alpha, Box, Checkbox } from '@mui/material';
import MainHeader from '../components/MainHeader';
import IIOSSidebar from './compenents/nav/IIOSSidebar';
import { IIOSTaskDetail } from './compenents/dialogs/taskdetails';
import { IIOSTaskAcpt, IIOSTaskProc } from './compenents/dialogs/forms';

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

let pId = '';
let lvId = '';
let vId = '';
const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

function IIOSITMTDashboard() {
  // เหลือทำ process หน้าดำเนินการ

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          handleOpenTaskDialog(params.row);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return (
          <Button
            variant="contained"
            disabled={disableProcessTaskButton || params.row.status_id_request !== null}
            onClick={onClick}
          >
            ดำเนินการ
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
      valueGetter: (params) => `${params.row.task_date_start.replace('T', ' ').replace('.000Z', ' น.')}`,
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
        `${
          params.row.status_id === 0
            ? params.row.status_name
            : params.row.task_iscomplete === null || params.row.task_iscomplete === ''
            ? params.row.status_id_request === null || params.row.status_id_request === ''
              ? params.row.status_name
              : `${params.row.status_name} (รออนุมัติ - ${params.row.status_name_request})`
            : params.row.audit_id === null || params.row.audit_id === ''
            ? params.row.status_id === 3
              ? `เปลี่ยนอะไหล่ (ยังไม่ตรวจรับ)`
              : `${params.row.status_name} (ยังไม่ตรวจรับ)`
            : params.row.status_id === 5 || params.row.status_id === 0
            ? params.row.status_name
            : params.row.status_id === 3
            ? `ดำเนินการเสร็จสิ้น (เปลี่ยนอะไหล่)`
            : `ดำเนินการเสร็จสิ้น (${params.row.status_name})`
        }`,
    },
    {
      field: 'task_device_id',
      headerName: 'รหัสทรัพย์สิน',
      width: 150,
    },
  ];

  const [open, setOpen] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [openTaskAcpt, setOpenTaskAcpt] = useState(false);
  const [openTaskProc, setOpenTaskProc] = useState(false);

  const [taskList, setTaskList] = useState([]);
  const [completeTaskList, setCompleteTaskList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [recvId, setRecvId] = useState('');

  const [status, setStatus] = useState([]);
  const [taskCount, setTaskCount] = useState([]);
  const [disableProcessTaskButton, setDisableProcessTaskButton] = useState(false);

  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');

  const [pageSize, setPageSize] = useState(10);

  const [focusTask, setFocusTask] = useState([]);

  const [estimationList, setEstimationList] = useState([]);

  const [headStatus, setHeadStatus] = useState('งานที่ยังไม่เสร็จสิ้นทั้งหมด');

  const [isHide, setIsHide] = useState(false);
  const [disIsHide, setDisIsHide] = useState(false);

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.lv_list.length; i += 1) {
      if (token.lv_list[i].mihapp_id === 'DMIS') {
        pId = token.psn_id;
        lvId = token.lv_list[i].lv_id;
        vId = token.lv_list[i].view_id;

        fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getoperator/${token.lv_list[i].lv_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setOperatorList(data);
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('cancelled');
            } else {
              console.error('Error:', error);
            }
          });

        refreshTable();

        break;
      }
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getestimation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEstimationList(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getstatus`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setRecvId(token.psn_id);
  }, []);

  async function refreshTable() {
    await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/gettasklist/${pId}/${lvId}/${vId}/${false}`,
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
          `${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/counttask/${pId}/${lvId}/${vId}/${false}`,
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
          `${process.env.REACT_APP_host}${
            process.env.REACT_APP_dmisPort
          }/getcompletetasklist/${pId}/${lvId}/${vId}/${false}`,
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
  }

  function filterTaskStatus() {
    setDisableProcessTaskButton(false);
    setDisIsHide(false);
    if (isHide) {
      setFilterTaskList(
        filterStatusId === 'all'
          ? taskList.filter((dt) => dt.status_id_request === null)
          : taskList.filter((dt) => dt.status_id === filterStatusId && dt.status_id_request === null)
      );
    } else {
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter((dt) => dt.status_id === filterStatusId));
    }
  }

  useEffect(() => {
    filterTaskStatus();
  }, [taskList]);

  useEffect(() => {
    filterTaskStatus();

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
      setDisableProcessTaskButton(true);
      setDisIsHide(true);
      setFilterTaskList(completeTaskList);
    } else if (filterStatusId === 6) {
      setHeadStatus('งานซื้อใหม่ทดแทน');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId]);

  // ========================================================

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
        <Checkbox
          checked={isHide}
          disabled={disIsHide}
          onChange={handleIsHide}
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
        />
        ซ่อนงานรออนุมัติ
      </Box>
    );
  }

  const handleIsHide = (event) => {
    if (event.target.checked) {
      setIsHide(true);
      setFilterTaskList(
        filterStatusId === 'all'
          ? taskList.filter((dt) => dt.status_id_request === null)
          : taskList.filter((dt) => dt.status_id === filterStatusId && dt.status_id_request === null)
      );
    } else {
      setIsHide(false);
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter((dt) => dt.status_id === filterStatusId));
    }
  };

  const handleOpenTaskDialog = (selTask) => {
    setFocusTask(selTask);
    if (selTask.status_id === 1) {
      setOpenTaskAcpt(true);
    } else if (
      selTask.status_id === 2 ||
      selTask.status_id === 3 ||
      selTask.status_id === 4 ||
      selTask.status_id === 6
    ) {
      setOpenTaskProc(true);
    }
  };

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setOpenTaskDetail(true);
  };

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <IIOSSidebar name="itmtdashboard" openNav={open} onCloseNav={() => setOpen(false)} />

      <IIOSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

      <IIOSTaskAcpt
        openDialg={openTaskAcpt}
        onCloseDialg={() => {
          setOpenTaskAcpt(false);
          refreshTable();
        }}
        data={focusTask}
        recvId={recvId}
        operList={operatorList}
        estList={estimationList}
      />

      <IIOSTaskProc
        openDialg={openTaskProc}
        onCloseDialg={() => {
          setOpenTaskProc(false);
          setIsHide(false);
          refreshTable();
        }}
        data={focusTask}
        statList={status}
        operList={operatorList}
        estList={estimationList}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>งานที่ได้รับ</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/iiosuserdashboard">หน้าหลักระบบแจ้งปัญหา</a>
              </li>
              <li className="breadcrumb-item my-2">งานที่ได้รับ</li>
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
                        // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
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

export default IIOSITMTDashboard;
