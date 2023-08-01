/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Stack, styled, alpha, Box, Button } from '@mui/material';
import jwtDecode from 'jwt-decode';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import { CBSUseRecDialg } from './components/dialogs/forms';
import { CBSTaskDetail } from './components/dialogs/taskdetails';

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

const headSname = `${localStorage.getItem('sname')} Center`;
let levelData = '';
let token = '';

function CBSUseRec() {
  const [sched, setSched] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);

  const [useRecDialg, setUseRecDialg] = useState(false);
  const [useRecData, setUseRecData] = useState([]);

  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [focusTask, setFocusTask] = useState('');

  const columns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 1,
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const handleUseRec = () => {
          setUseRecData(params.row);
          setUseRecDialg(true);
        };

        return (
          <Stack direction="row" spacing={1}>
            <Button onClick={handleUseRec} className="btn btn-success">
              ลงข้อมูล
            </Button>
          </Stack>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'grp_id',
      headerName: 'เลขที่กลุ่มงาน',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'drv_name',
      headerName: 'ผู้ขับ',
      flex: 1,
      minWidth: 180,
    },
  ];

  function QuickSearchToolbar() {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  useEffect(() => {
    token = jwtDecode(localStorage.getItem('token'));
    levelData = token.level_list.find((o) => o.mihapp_id === 'CBS');

    refreshTable();
  }, []);

  function refreshTable() {
    if (levelData.level_id === 'CBS_USER') {
      fetch(
        `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getusrdrvsched/${token.personnel_id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSched(data);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('cancelled');
          } else {
            console.error('Error:', error);
          }
        });
    } else {
      fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getdrvsched`)
        .then((response) => response.json())
        .then((data) => {
          setSched(data);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('cancelled');
          } else {
            console.error('Error:', error);
          }
        });
    }
  }

  return (
    <>
      <Helmet>
        <title> ระบบขอใช้รถ | {headSname} </title>
      </Helmet>

      <div>
        <CBSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

        <CBSUseRecDialg
          openDialg={useRecDialg}
          onCloseDialg={() => {
            setUseRecDialg(false);
            refreshTable();
          }}
          data={useRecData}
        />

        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="userec" openNav={open} onCloseNav={() => setOpen(false)} />
        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>บันทึกการใช้รถ</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="/intranet">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">
                  <a href="/cbsdashboard">หน้าหลักระบบขอใช้รถ</a>
                </li>
                <li className="breadcrumb-item my-2">บันทึกการใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body pt-3">
                    <h5 className="card-title">บันทึกการใช้รถ</h5>
                    <StripedDataGrid
                      autoHeight
                      getRowHeight={() => 'auto'}
                      sx={{
                        [`& .${gridClasses.cell}`]: {
                          py: 1,
                        },
                      }}
                      columns={columns}
                      rows={sched}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[10, 25, 100]}
                      hideFooterSelectedRowCount
                      // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                      // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                      onCellDoubleClick={(params) => {
                        console.log(params.row);
                        setFocusTask(params.row);
                        setOpenTaskDetail(true);
                      }}
                      initialState={{
                        columns: {
                          columnVisibilityModel: {
                            // Hide columns status and traderName, the other columns will remain visible
                            // id: false,
                          },
                        },
                      }}
                      components={{ Toolbar: QuickSearchToolbar }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default CBSUseRec;